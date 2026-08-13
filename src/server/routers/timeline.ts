import { timeline } from "@/db/schema";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { asc, eq } from "drizzle-orm";

// create / update で共通の入力。day と end_* は任意なので
// 「月～月」「日～日」どちらの粒度でも登録できる。
const timelineFields = z.object({
  year: z.string(),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31).nullable().optional(),
  endYear: z.string().nullable().optional(),
  endMonth: z.number().int().min(1).max(12).nullable().optional(),
  endDay: z.number().int().min(1).max(31).nullable().optional(),
  isOngoing: z.boolean().optional().default(false),
  category: z.string(),
  title: z.string(),
  detail: z.string(),
  // スライド・記事・リポジトリなど、複数の裏付けリンクを持てる
  urls: z.array(z.url()).nullable().optional(),
});

type TimelineFields = z.infer<typeof timelineFields>;

// 3パターンの組み合わせとして成立しない入力を弾く
const checkPeriod = (v: TimelineFields, ctx: z.RefinementCtx) => {
  const hasEndYear = !!v.endYear;
  const hasEndMonth = v.endMonth != null;

  if (v.isOngoing && (hasEndYear || hasEndMonth || v.endDay != null)) {
    ctx.addIssue({
      code: 'custom',
      message: '継続中の項目に終了日は指定できません',
      path: ['isOngoing'],
    });
  }

  if (hasEndYear !== hasEndMonth) {
    ctx.addIssue({
      code: 'custom',
      message: '終了を指定する場合は年と月の両方が必要です',
      path: ['endMonth'],
    });
  }

  if (v.endDay != null && !hasEndMonth) {
    ctx.addIssue({
      code: 'custom',
      message: '終了日を指定するには終了年月が必要です',
      path: ['endDay'],
    });
  }

  if (hasEndYear && hasEndMonth) {
    // 日が未指定の側は範囲が広い方に倒して比較する（開始は月初、終了は月末扱い）
    const start = Number(v.year) * 10000 + v.month * 100 + (v.day ?? 1);
    const end = Number(v.endYear) * 10000 + v.endMonth! * 100 + (v.endDay ?? 31);
    if (end < start) {
      ctx.addIssue({
        code: 'custom',
        message: '終了は開始以降にしてください',
        path: ['endYear'],
      });
    }
  }
};

// 継続中なら終了日は保持しない。undefined は null に倒して
// 「値を消す」更新が効くようにする。
const normalize = (v: TimelineFields) => ({
  ...v,
  day: v.day ?? null,
  urls: v.urls ?? null,
  endYear: v.isOngoing ? null : (v.endYear ?? null),
  endMonth: v.isOngoing ? null : (v.endMonth ?? null),
  endDay: v.isOngoing ? null : (v.endDay ?? null),
});

export const timelineRouter = createTRPCRouter({
  getAllForPublic: publicProcedure.query(async({ctx}) => {
    const { db } = ctx;
    const rows = await db
      .select({
        year: timeline.year,
        month: timeline.month,
        day: timeline.day,
        endYear: timeline.endYear,
        endMonth: timeline.endMonth,
        endDay: timeline.endDay,
        isOngoing: timeline.isOngoing,
        category: timeline.category,
        title: timeline.title,
        detail: timeline.detail,
        urls: timeline.urls,
        imageUrls: timeline.imageUrls,
        videoUrl: timeline.videoUrl,
      })
      .from(timeline)
      .orderBy(asc(timeline.year), asc(timeline.month), asc(timeline.day))
    return rows
  }),

  getAll: adminProcedure.query(async({ctx}) => {
    const { db } = ctx;
    const rows = await db
      .select()
      .from(timeline)
      .orderBy(asc(timeline.year), asc(timeline.month), asc(timeline.day))
    return rows;
  }),

  getByID: adminProcedure
  .input(z.object({
    id: z.string().uuid(),
  }))
  .query(async({ctx, input}) => {
    const { db } = ctx;
    const { id } = input;
    const [row] = await db
      .select()
      .from(timeline)
      .where(eq(timeline.id, id))
      .limit(1)
    return row
  }),

  create: adminProcedure
    .input(timelineFields.superRefine(checkPeriod))
    .mutation(async ({ctx, input}) => {
      const { db } = ctx;
      const [inserted] = await db
        .insert(timeline)
        .values(normalize(input))
        .returning()
      return inserted
    }),

  delete: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ctx, input}) => {
      const { db } = ctx;
      const { id } = input;
      const [deleted] = await db
        .delete(timeline)
        .where(eq(timeline.id, id))
        .returning()
      return deleted
    }),

  update: adminProcedure
    .input(timelineFields.extend({ id: z.string().uuid() }).superRefine(checkPeriod))
    .mutation(async ({ctx, input}) => {
      const { db } = ctx;
      const { id, ...values } = input;
      const [updated] = await db
        .update(timeline)
        .set(normalize(values))
        .where(eq(timeline.id, id))
        .returning()
      return updated;
    })

})
