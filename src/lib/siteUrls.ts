/*
 * 他のサイトの配信元。手元では localhost を見る。
 * 相手のサイトに置いてある画像（スライドの表紙など）もここから組み立てる。
 */
export const BLOG_URL = process.env.NEXT_PUBLIC_BLOG_URL ?? 'https://blog.y4bu.net';
export const SLIDES_URL = process.env.NEXT_PUBLIC_SLIDES_URL ?? 'https://slides.y4bu.net';

export const postUrl = (slug: string) => `${BLOG_URL}/posts/${slug}`;
export const deckUrl = (slug: string) => `${SLIDES_URL}/${slug}/`;
export const deckThumbUrl = (slug: string) => `${SLIDES_URL}/thumbs/${slug}.png`;
