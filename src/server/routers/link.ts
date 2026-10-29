import { sql } from "drizzle-orm";
import { lookup } from "node:dns/promises";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

/*
 * 外部 URL の OGP を読み取ってカードにする。
 *
 * **サーバーが任意の宛先へ出ていく処理**なので、ここは丁寧に閉じる。
 * 開けっ放しにすると、他人が「このサーバーに代わりに取りに行かせる」
 * ことができてしまう（SSRF）。社内にしか見えない宛先を踏ませたり、
 * 外から見えないホストが在るかどうかを応答時間で探ったりできる。
 *
 * 閉じ方は 5 つ。
 *   1. **登録済みの URL しか取りに行かない**（いちばん効く）
 *   2. http / https 以外は断る
 *   3. DNS 解決後の私設・ループバック・リンクローカル宛は断る
 *   4. リダイレクト先も同じように検査する
 *   5. 本文は読みながら打ち切る（受け取ってから切るのでは遅い）
 */
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const FETCH_TIMEOUT_MS = 5000;
const MAX_HTML_BYTES = 200_000;
const CACHE_SECONDS = 60 * 60 * 24;
const MAX_REDIRECTS = 3;

/*
 * 取りに行ってはいけない宛先。**ホスト名が数字の IP のときに見る。**
 *
 * いまの構成では私設網への経路が無いので届かないが、あとで
 * プライベートネットワークを足した日にそのまま穴になる。先に塞いでおく。
 */
const BLOCKED_HOSTS = /^(localhost|.*\.localhost|.*\.internal|.*\.local)$/i;

const isBlockedIp = (host: string) => {
  // IPv6（[] を外す）
  if (host.startsWith('[') || host.includes(':')) {
    const v6 = host.replace(/^\[|\]$/g, '').toLowerCase();
    return (
      v6 === '::1' || v6 === '::' ||
      /^fe[89ab]/.test(v6) ||              // リンクローカル fe80::/10
      /^f[cd]/.test(v6) ||                 // ユニークローカル
      v6.startsWith('ff') ||               // マルチキャスト
      v6.startsWith('::ffff:')             // v4 を包んだもの
    );
  }

  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!m) return false;

  const [a, b] = m.slice(1).map(Number);
  if (m.slice(1).some((n) => Number(n) > 255)) return true;

  return (
    a === 0 ||                              // 0.0.0.0/8
    a === 10 ||                             // 10.0.0.0/8
    a === 127 ||                            // ループバック
    (a === 100 && b >= 64 && b <= 127) ||   // CGNAT 100.64.0.0/10
    (a === 169 && b === 254) ||             // リンクローカル・メタデータ
    (a === 172 && b >= 16 && b <= 31) ||    // 172.16.0.0/12
    (a === 192 && b === 168) ||             // 192.168.0.0/16
    (a === 198 && (b === 18 || b === 19)) ||// ベンチマーク用
    a >= 224                                // マルチキャスト・予約
  );
};

/*
 * ホスト名が公開 IP だけを向いていることを、実際に DNS を引いて確かめる。
 * URL に数字の IP が直接書かれていなくても、DNS が 127.0.0.1 や
 * 169.254.169.254 を返せば同じことなので、文字列検査だけでは足りない。
 * 複数の答えのうち 1 つでも非公開なら、切り替えによるすり抜けを避けるため拒否する。
 */
const isPublicDestination = async (target: URL) => {
  if (!ALLOWED_PROTOCOLS.has(target.protocol)) return false;
  if (target.username || target.password) return false;
  if (BLOCKED_HOSTS.test(target.hostname) || isBlockedIp(target.hostname)) return false;

  try {
    const addresses = await lookup(target.hostname, { all: true, verbatim: true });
    return addresses.length > 0 && addresses.every(({ address }) => !isBlockedIp(address));
  } catch {
    return false;
  }
};

/* リダイレクトも 1 段ごとに検査する。fetch の自動追従に任せると検査を迂回できる。 */
const fetchPublic = async (initial: URL): Promise<Response | null> => {
  let target = initial;

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    if (!(await isPublicDestination(target))) return null;

    const res = await fetch(target.toString(), {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; y4bu-portfolio/1.0)' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: 'manual',
      next: { revalidate: CACHE_SECONDS },
    });

    if (![301, 302, 303, 307, 308].includes(res.status)) return res;
    if (redirects === MAX_REDIRECTS) return null;

    const location = res.headers.get('location');
    if (!location) return null;
    try {
      target = new URL(location, target);
    } catch {
      return null;
    }
  }

  return null;
};

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
};

const decodeEntities = (s: string) =>
  s.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (full, code: string) => {
    if (code.startsWith('#')) {
      const isHex = code[1] === 'x' || code[1] === 'X';
      const n = parseInt(isHex ? code.slice(2) : code.slice(1), isHex ? 16 : 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : full;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? full;
  });

// content が property の前後どちらに来ても拾えるように2パターン見る
const pickMeta = (html: string, key: string): string | null => {
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${key}["'][^>]*content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name)=["']${key}["']`, 'i'),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeEntities(m[1]).trim() || null;
  }
  return null;
};

/** 上限まで読んだら打ち切る。残りは受け取らない */
const readCapped = async (res: Response, max: number) => {
  const body = res.body;
  if (!body) return (await res.text()).slice(0, max);

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let out = '';

  while (out.length < max) {
    const { done, value } = await reader.read();
    if (done) break;
    out += decoder.decode(value, { stream: true });
  }
  await reader.cancel().catch(() => {});

  return out.slice(0, max);
};

export const linkRouter = createTRPCRouter({
  // 失敗しても throw せず null を返す。呼び出し側は素のリンクにフォールバックする。
  preview: publicProcedure
    /*
     * **z.url() を使わない。** 形が違うときに tRPC が zod の中身を
     * そのまま返すので、内部のスキーマが外から見える。ここでは文字列と
     * してだけ受け取り、形の判定は自分でやって null を返す。
     */
    .input(z.object({ url: z.string().max(255) }))
    .query(async ({ ctx, input }) => {
      let target: URL;
      try {
        target = new URL(input.url);
      } catch {
        return null;
      }
      if (!(await isPublicDestination(target))) return null;

      /*
       * **登録済みの URL だけ取りに行く。** この機能が出すのは経歴と作品に
       * 紐づけたリンクのカードなので、DB に無い URL を取りに行く理由が無い。
       * ここを閉じると、外から任意の宛先を指定する余地が消える。
       */
      const found = await ctx.db.execute(sql`
        select 1
        where exists (select 1 from timeline where ${input.url} = any(urls))
           or exists (
             select 1 from works
             where github_url = ${input.url}
                or lp_site_url = ${input.url}
                or site_url = ${input.url}
           )
        limit 1`);
      const rows = Array.isArray(found) ? found : ((found as { rows?: unknown[] }).rows ?? []);
      if (rows.length === 0) return null;

      try {
        const res = await fetchPublic(target);
        if (!res?.ok) return null;

        /*
         * **読みながら打ち切る。** res.text() は全部受け取ってから切るので、
         * 相手が 1GB 返してきたら 1GB 受け取ってしまう。
         */
        const html = await readCapped(res, MAX_HTML_BYTES);

        const title = pickMeta(html, 'og:title') ?? pickMeta(html, 'twitter:title');
        const description = pickMeta(html, 'og:description') ?? pickMeta(html, 'twitter:description');
        const image = pickMeta(html, 'og:image') ?? pickMeta(html, 'twitter:image:src');
        const siteName = pickMeta(html, 'og:site_name');

        // タイトルも画像も取れないならカードにする意味がない
        if (!title && !image) return null;

        return {
          url: input.url,
          title,
          description,
          image,
          siteName: siteName ?? target.hostname.replace(/^www\./, ''),
        };
      } catch {
        return null;
      }
    }),
});
