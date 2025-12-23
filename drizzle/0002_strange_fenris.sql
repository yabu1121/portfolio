CREATE TABLE "m2m_works_to_techs" (
	"work_id" uuid NOT NULL,
	"tech_id" uuid NOT NULL,
	CONSTRAINT "m2m_works_to_techs_work_id_tech_id_pk" PRIMARY KEY("work_id","tech_id")
);
--> statement-breakpoint
DROP TABLE "works_to_techs" CASCADE;--> statement-breakpoint
ALTER TABLE "m2m_works_to_techs" ADD CONSTRAINT "m2m_works_to_techs_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "m2m_works_to_techs" ADD CONSTRAINT "m2m_works_to_techs_tech_id_techs_id_fk" FOREIGN KEY ("tech_id") REFERENCES "public"."techs"("id") ON DELETE cascade ON UPDATE no action;