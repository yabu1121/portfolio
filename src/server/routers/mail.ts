import { contact } from "@/db/schema";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const mailRouter = createTRPCRouter({
  getMail: adminProcedure.query(async ({ctx}) => {
    const {db} = ctx;
    return await db.select({email: contact.email}).from(contact)
  })
})