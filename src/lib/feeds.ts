import { and, desc, eq, isNotNull, lte, sql } from 'drizzle-orm';
import { db } from '@/db';
import { posts } from '@/db/blog';
import { decks } from '@/db/slides';

/*
 * 他の 2 サイトの中身を読む。
 *
 * 同じ Supabase を共有しているので、schema をまたいで読むだけで連携できる
 * （blog.posts / slides.decks）。**書き込みはしない。**
 *
 * このページは静的に作られるので、記事やデッキを足しただけでは更新されない。
 * admin が保存のたびに portfolio の /api/revalidate を叩く。
 */

/** 公開済みで、公開日時が過ぎた記事（blog と同じ条件） */
export const listRecentPosts = (limit = 3) =>
  db
    .select({
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
      coverImage: posts.coverImage,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .where(and(eq(posts.published, true), isNotNull(posts.publishedAt), lte(posts.publishedAt, sql`now()`)))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);

/** 公開中のデッキ（slides のビルドと同じ条件） */
export const listRecentDecks = (limit = 3) =>
  db
    .select({
      slug: decks.slug,
      title: decks.title,
      date: decks.date,
      event: decks.event,
      slideCount: decks.slideCount,
    })
    .from(decks)
    .where(
      and(
        eq(decks.published, true),
        eq(decks.frontmatterDraft, false),
        sql`${decks.missingAt} is null`,
        sql`(${decks.publishAt} is null or ${decks.publishAt} <= now())`,
      ),
    )
    .orderBy(desc(decks.date), decks.slug)
    .limit(limit);
