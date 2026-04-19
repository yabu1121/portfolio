import { z } from "zod";
import { eq } from "drizzle-orm";
import { contact } from "@/db/schema";
import { adminProcedure, createTRPCRouter } from "../trpc";

export const mailRouter = createTRPCRouter({
  getMail: adminProcedure.query(async ({ ctx }) => {
    const [row] = await ctx.db.select().from(contact).limit(1);
    return row ?? null;
  }),

  setMail: adminProcedure
    .input(z.object({
      email: z.email("メール形式が不正です"),
      senderUser: z.email("送信元メールの形式が不正です"),
      senderPassword: z.string().min(1, "パスワードを入力してください"),
    }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db.select().from(contact).limit(1);

      if (existing) {
        const [updated] = await ctx.db
          .update(contact)
          .set({
            email: input.email,
            senderUser: input.senderUser,
            senderPassword: input.senderPassword,
          })
          .where(eq(contact.id, existing.id))
          .returning();
        return updated;
      }

      const [inserted] = await ctx.db
        .insert(contact)
        .values({
          email: input.email,
          senderUser: input.senderUser,
          senderPassword: input.senderPassword,
        })
        .returning();
      return inserted;
    }),
});
