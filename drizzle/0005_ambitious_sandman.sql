CREATE TABLE "my_techs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tech_id" uuid NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "timeline" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "timeline" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "works" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "works" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "works" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "works" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "m2m_works_to_techs" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "works" ADD COLUMN "site_url" varchar(255);--> statement-breakpoint
ALTER TABLE "my_techs" ADD CONSTRAINT "my_techs_tech_id_techs_id_fk" FOREIGN KEY ("tech_id") REFERENCES "public"."techs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "techs" DROP COLUMN "level";