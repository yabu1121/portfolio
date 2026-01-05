import { createTRPCRouter, publicProcedure } from "../trpc";

export const skillRouter = createTRPCRouter({
  getAll: publicProcedure.query(async({ctx}) => {
    const {db} = ctx;
    const skillData = await db.query.techs.findMany({
      columns: {
        id: true,
        name: true,
        iconUrl: true,
        description: true,
      },
      // withで同時に取得できる
      with: {
        // withの中身はリレーションで定義した名前。
        myTechs: true,
      }
    });
      return skillData.map((tech) => {
        const myLevel = tech.myTechs[0];
        return {
          id: tech.id,
          name: tech.name,
          iconUrl: tech.iconUrl,
          level: myLevel?.level ?? 0,
          description: myLevel?.description ?? "",
        }
      });
    }),
  })