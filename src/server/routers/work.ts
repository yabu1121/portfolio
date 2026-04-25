import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { works } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

export const workRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const { db } = ctx;

    const worksData = await db.query.works.findMany({
      orderBy: [desc(works.createdAt)],
      with: {
        worksToTechs: {
          with: {
            tech: true,
          },
        },
      },
    });

    return worksData;
  }),

  getByID: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .query(async ({ ctx, input }) => {
      const { db } = ctx;
      const [row] = await db
        .select()
        .from(works)
        .where(eq(works.id, input.id))
        .limit(1);
      return row ?? null;
    }),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1).max(255),
      description: z.string().min(1),
      githubUrl: z.string().max(255).nullable(),
      lpSiteUrl: z.string().max(255).nullable(),
      siteUrl: z.string().max(255).nullable(),
      thumbnail: z.string().max(255).nullable(),
      miniThumbnail: z.string().max(255).nullable(),
      category: z.string().max(50).nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const [inserted] = await db
        .insert(works)
        .values(input)
        .returning();
      return inserted;
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
      title: z.string().min(1).max(255),
      description: z.string().min(1),
      githubUrl: z.string().max(255).nullable(),
      lpSiteUrl: z.string().max(255).nullable(),
      siteUrl: z.string().max(255).nullable(),
      thumbnail: z.string().max(255).nullable(),
      miniThumbnail: z.string().max(255).nullable(),
      category: z.string().max(50).nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const { id, ...values } = input;
      const [updated] = await db
        .update(works)
        .set(values)
        .where(eq(works.id, id))
        .returning();
      return updated;
    }),

  delete: adminProcedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { db } = ctx;
      const [deleted] = await db
        .delete(works)
        .where(eq(works.id, input.id))
        .returning();
      return deleted;
    }),
});
