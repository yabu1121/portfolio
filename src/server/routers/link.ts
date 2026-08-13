import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

// 外部URLのOGPを読み取ってカード表示に使う。
// 対象は管理画面から登録されたURLだけだが、サーバーから任意の宛先へ
// 出ていく処理なので protocol は http/https に限定し、タイムアウトも付ける。
const ALLOWED_PROTOCOLS = new Set(['http:', 'https:']);
const FETCH_TIMEOUT_MS = 5000;
const MAX_HTML_BYTES = 200_000;
const CACHE_SECONDS = 60 * 60 * 24;

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

export const linkRouter = createTRPCRouter({
  // 失敗しても throw せず null を返す。呼び出し側は素のリンクにフォールバックする。
  preview: publicProcedure
    .input(z.object({ url: z.url().max(255) }))
    .query(async ({ input }) => {
      let target: URL;
      try {
        target = new URL(input.url);
      } catch {
        return null;
      }
      if (!ALLOWED_PROTOCOLS.has(target.protocol)) return null;

      try {
        const res = await fetch(target.toString(), {
          headers: { 'user-agent': 'Mozilla/5.0 (compatible; y4bu-portfolio/1.0)' },
          signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
          next: { revalidate: CACHE_SECONDS },
        });
        if (!res.ok) return null;

        const html = (await res.text()).slice(0, MAX_HTML_BYTES);

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
