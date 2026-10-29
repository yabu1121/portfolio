import { revalidatePath } from 'next/cache';
import { withLog } from '@/lib/request-log'

/*
 * admin から叩かれて、公開ページのキャッシュを落とす。
 *
 * このサイトはビルド時に作った静的ページを返す（x-nextjs-prerender: 1）。
 * DB を書き換えても、ここを叩かないと次のデプロイまで古いままになる。
 *
 * **secret が未設定なら誰も通さない。** 設定漏れで誰でもキャッシュを落とせる
 * 状態にしない。
 */

/** 文字列長に依存しない比較。タイミング差で secret を推測されないようにする */
const safeEqual = (a: string, b: string) => {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);

  let diff = left.length ^ right.length;
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    diff |= (left[i] ?? 0) ^ (right[i] ?? 0);
  }
  return diff === 0;
};

const handlePost = async (request: Request): Promise<Response> => {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    console.error('REVALIDATE_SECRET が未設定のため revalidate を受け付けません');
    return new Response('Not configured', { status: 503 });
  }

  const given = request.headers.get('x-revalidate-secret');
  if (!given || !safeEqual(given, secret)) {
    return new Response('Forbidden', { status: 403 });
  }

  /*
   * 作品・技術・スキル・経歴はトップにも一覧にも詳細にも出るので、
   * どのページが影響を受けるか追うより、ルートレイアウト配下を全部落とす。
   * 個人サイトの規模なら作り直しの負荷は問題にならない。
   */
  revalidatePath('/', 'layout');

  return Response.json({ revalidated: true });
}

/* 記録は入口で取る。経路は型のまま */
export const POST = withLog('/api/revalidate', handlePost)
