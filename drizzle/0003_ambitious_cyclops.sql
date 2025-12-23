CREATE TABLE "timeline" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" varchar(4) NOT NULL,
	"month" integer NOT NULL,
	"category" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"detail" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "works" ALTER COLUMN "description" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "techs" ADD COLUMN "level" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "techs" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "works" ADD COLUMN "category" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "works" DROP COLUMN "subtitle";--> statement-breakpoint
ALTER TABLE "works" DROP COLUMN "mini_thumbnail";