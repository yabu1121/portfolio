import { pgTable, uuid, varchar, timestamp, text, integer, boolean, primaryKey, index, date, bigserial } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const techs = pgTable('techs', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 100 }).notNull().unique(),
  description: text('description'),
  iconUrl: varchar('icon_url', { length: 255 }),
  // 'language' | 'framework' | 'library' | 'database' | 'infra'
  // level(理解度)を表示するのは language のみ。src/app/utils/techKind.ts を参照。
  kind: varchar('kind', { length: 20 }).notNull().default('library'),
});

export const myTechs = pgTable('my_techs', {
  id: uuid('id').defaultRandom().primaryKey(),
  techId: uuid('tech_id').notNull().references(() => techs.id, { onDelete: 'cascade' }),
  level: integer('level').default(0).notNull(),
  description: text('description'),
});

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  year: integer('year').notNull(),
  month: integer('month').notNull(),
  name: varchar('name').notNull(),
})

// 期間の表現は3パターン。開始・終了とも day は任意なので、
// 「月～月」「日～日」のどちらの粒度でも登録できる。
//   単発   : end_* がすべて null かつ is_ongoing = false → 2024.10 / 2024.10.15
//   期間   : end_year と end_month あり                  → 2024.04 – 2025.03
//   継続中 : is_ongoing = true                           → 2024.04 – 現在
// 表示の組み立ては src/app/utils/timelineDate.ts に集約している。
export const timeline = pgTable('timeline', {
  id: uuid('id').defaultRandom().primaryKey(),
  year: varchar('year', { length: 4 }).notNull(),
  month: integer('month').notNull(),
  day: integer('day'),
  endYear: varchar('end_year', { length: 4 }),
  endMonth: integer('end_month'),
  endDay: integer('end_day'),
  isOngoing: boolean('is_ongoing').default(false).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  detail: text('detail').notNull(),
  // 登壇資料・記事・リポジトリなど、その経歴の裏付けになる外部リンク（任意・複数可）。
  // 1つの経歴に「スライドと記事の両方」を紐付けたいので配列にしている。
  urls: text('urls').array(),
  // 成果物のスクリーンショット（任意・複数可）。Supabase に上げた public URL を入れる。
  // 文章だけでは伝わらない可視化などを、展開したときに見せるため。
  imageUrls: text('image_urls').array(),
  // 動きのある成果物（3Dの回転など）。GIFは容量が大きくアップロードAPIも受け付けないため、
  // mp4 を public/videos に置いてそのパスを入れる。
  videoUrl: varchar('video_url', { length: 255 }),
  /*
   * その経歴で話したスライド（slides.decks の slug）。
   *
   * 登壇やインターンの成果発表はスライドが残っていることが多いので、URL を
   * 文章に混ぜるのではなく紐付けて持ち、表紙つきで見せる。
   * **外部キーは張らない。** slides schema は別のリポジトリ（slides のビルド）が
   * 作る表で、こちらの移行と順序を揃えられないため。slug が消えていたら
   * 出さないだけにする。
   */
  deckSlug: varchar('deck_slug', { length: 120 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const works = pgTable('works', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  githubUrl: varchar('github_url', { length: 255 }),
  lpSiteUrl: varchar('lp_site_url', { length: 255 }),
  siteUrl: varchar('site_url', { length: 255 }),
  thumbnail: varchar('thumbnail', { length: 255 }),
  miniThumbnail: varchar('mini_thumbnail', { length: 255 }),
  category: varchar('category', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull().$onUpdate(() => new Date()),
});

/*
 * 作品に載せるメディア。1 つの作品に何枚でも付く。
 *
 * **works.thumbnail とは別物。** あちらは一覧に出す表紙 1 枚で、
 * こちらは詳細ページで捲って見せるもの。表紙をここに重複して入れない。
 *
 * kind は描き方の違いであって、拡張子ではない。
 *   image ... png / jpg / webp。<img> で出す
 *   gif   ... アニメーション gif。<img> だが「動く」と分かるよう印を付ける
 *   video ... mp4。<video> で出す。**mov は入れない**（Safari 以外で
 *             再生できないことがあるので、mp4 に変換して入れる）
 *
 * sort は小さいほど先。admin が並べ替えたときに振り直す。
 */
export const workMedia = pgTable('work_media', {
  id: uuid('id').defaultRandom().primaryKey(),
  workId: uuid('work_id').notNull().references(() => works.id, { onDelete: 'cascade' }),
  url: varchar('url', { length: 500 }).notNull(),
  kind: varchar('kind', { length: 10 }).notNull().default('image'),
  // 何の場面かの一言。スライドショーの下に出す
  caption: varchar('caption', { length: 255 }),
  sort: integer('sort').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  // 詳細ページは「その作品のものを並び順で」しか引かない
  workSortIdx: index('work_media_work_id_sort_idx').on(t.workId, t.sort),
}));

export const workMediaRelations = relations(workMedia, ({ one }) => ({
  work: one(works, { fields: [workMedia.workId], references: [works.id] }),
}));


/*
 * 3 サイト（www / blog / slides）共通の反応。
 *
 * **「種類 + 対象」で持ち、外部キーは張らない。** 記事は blog schema、
 * スライドは slides schema、作品は public と、相手が 3 つの表に散って
 * いるので 1 本の外部キーでは受けられない。消えた対象の行が残るが、
 * 出すときに突き合わせれば済む（数えるのはこちら側の都合で、相手の
 * 表の都合に合わせて消す必要はない）。
 *
 *   kind   ... 'post' | 'work' | 'deck' | 'page'
 *   target ... その中での目印。記事とスライドは slug、作品は id、
 *              page はパス
 *
 * **数えた結果ではなく 1 件ずつの行で持つ。** カウンタにすると、二重に
 * 足した・引き忘れたがそのまま残って直せない。
 *
 * visitor は端末に配った乱数（cookie）を鍵付きで変換したもの。
 * ip は水増しの歯止めだけに使う塩付きのハッシュ。どちらも元に戻せない。
 */
export const siteLikes = pgTable('site_likes', {
  kind: varchar('kind', { length: 16 }).notNull(),
  target: varchar('target', { length: 160 }).notNull(),
  visitor: varchar('visitor', { length: 64 }).notNull(),
  ip: varchar('ip', { length: 64 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  // 1 つの対象に 1 端末 1 回。連打は主キーの衝突で弾かれる
  pk: primaryKey({ columns: [t.kind, t.target, t.visitor] }),
  // 数えるときと、IP ごとの上限を見るときの形
  targetIdx: index('site_likes_target_idx').on(t.kind, t.target),
  ipIdx: index('site_likes_ip_idx').on(t.kind, t.target, t.ip),
}));

/*
 * 閲覧。**同じ端末の同じ日は 1 回。**
 * 読み直すたびに増やすと、自分で開き直した回数が混ざって数が意味を失う。
 */
export const siteViews = pgTable('site_views', {
  kind: varchar('kind', { length: 16 }).notNull(),
  target: varchar('target', { length: 160 }).notNull(),
  visitor: varchar('visitor', { length: 64 }).notNull(),
  day: date('day').notNull(),
  ip: varchar('ip', { length: 64 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.kind, t.target, t.visitor, t.day] }),
  targetIdx: index('site_views_target_idx').on(t.kind, t.target),
  ipIdx: index('site_views_ip_day_idx').on(t.kind, t.target, t.ip, t.day),
}));


/*
 * API の記録。**ページの描画は入れない。**
 *
 * 閲覧のたびに書き込みが増えると、数えるために遅くするという本末転倒に
 * なる。記録するのは API の呼び出しだけ。
 *
 * **Vercel にも同じものはある。** こちらで持つ理由は 2 つで、admin の中で
 * 見られることと、note に好きな手がかりを添えられること（どの操作か、
 * どの種類かなど）。表を変えずに切り口を足せる。
 *
 * ip は塩付きのハッシュ。誰かを追うためではなく、同じ相手からの連打が
 * 固まっているかを見るためだけに持つ。
 */
export const requestLog = pgTable('request_log', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  at: timestamp('at', { withTimezone: true }).defaultNow().notNull(),
  // 'www' | 'blog' | 'slides' | 'admin'
  site: varchar('site', { length: 10 }).notNull(),
  // 経路。**実際の URL ではなく型**（/posts/[slug]）。実 URL だと行が散って数えられない
  route: varchar('route', { length: 120 }).notNull(),
  method: varchar('method', { length: 8 }).notNull(),
  status: integer('status').notNull(),
  ms: integer('ms').notNull(),
  ip: varchar('ip', { length: 64 }),
  // 後から切り口を足すための自由欄（action=like など）
  note: varchar('note', { length: 120 }),
}, (t) => ({
  // 「最近のもの」と「経路ごとの集計」しか引かない
  atIdx: index('request_log_at_idx').on(t.at),
  routeIdx: index('request_log_route_at_idx').on(t.route, t.at),
}));

/*
 * お問い合わせの連投を止めるための数取り。
 *
 * **送る前に 1 つ予約する。** request_log を数える形にしていたが、
 * 記録は応答を返したあと（after）に書かれるので、同時に叩かれると
 * どれもまだ 0 件に見えて全部通ってしまう。ここは「足してから、
 * 足した結果を見る」1 文で済ませる（upsert の returning）。
 * 同じ瞬間に来ても、片方は必ず大きい数を受け取る。
 *
 * ip は塩付きのハッシュ。取れなかったときは 'unknown' の 1 つの枠に
 * まとめて入れる（**素通しにしない**）。
 * window は 10 分の切り捨て。古い行は掃除で消す。
 */
export const contactAttempts = pgTable('contact_attempts', {
  ip: varchar('ip', { length: 64 }).notNull(),
  windowStart: timestamp('window_start', { withTimezone: true }).notNull(),
  count: integer('count').default(0).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.ip, t.windowStart] }),
}));

export const contact = pgTable('contact', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  senderUser: varchar('sender_user', { length: 255 }),
  senderPassword: varchar('sender_password', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})


export const m2m_worksToTechs = pgTable('m2m_works_to_techs', {
  workId: uuid('work_id').notNull().references(() => works.id, { onDelete: 'cascade' }),
  techId: uuid('tech_id').notNull().references(() => techs.id, { onDelete: 'cascade' }),
  description: text('description'),
}, (t) => ({
  pk: primaryKey({ columns: [t.workId, t.techId] }),
}));

export const m2m_worksToTechsRelations = relations(m2m_worksToTechs, ({ one }) => ({
  work: one(works, { fields: [m2m_worksToTechs.workId], references: [works.id] }),
  tech: one(techs, { fields: [m2m_worksToTechs.techId], references: [techs.id] }),
}));

export const worksRelations = relations(works, ({ many }) => ({
  worksToTechs: many(m2m_worksToTechs),
  media: many(workMedia),
}));

export const techsRelations = relations(techs, ({ many }) => ({
  worksToTechs: many(m2m_worksToTechs),
  myTechs: many(myTechs), 
}));

export const myTechsRelations = relations(myTechs, ({ one }) => ({
  tech: one(techs, {
    fields: [myTechs.techId],
    references: [techs.id],
  }),
}));