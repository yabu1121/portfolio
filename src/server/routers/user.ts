import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

/**
 * 学習ポイント:
 * - zod: バリデーションライブラリ。入力の型チェックとバリデーション
 * - input: プロシージャへの入力を定義
 * - query: データを取得する操作(GETに相当)
 * - mutation: データを変更する操作(POST/PUT/DELETEに相当)
 */

export const userRouter = createTRPCRouter({
  // すべてのユーザーを取得
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(users);
  }),

  // IDでユーザーを取得
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);

      return result[0] ?? null;
    }),

  // 新しいユーザーを作成
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        bio: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db
        .insert(users)
        .values({
          name: input.name,
          email: input.email,
          bio: input.bio,
        })
        .returning();

      return result[0];
    }),

  // ユーザーを更新
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        email: z.string().email().optional(),
        bio: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      const result = await ctx.db
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();

      return result[0];
    }),

  // ユーザーを削除
  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(users).where(eq(users.id, input.id));
      return { success: true };
    }),
});
