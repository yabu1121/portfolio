CREATE TABLE "techs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"icon_url" varchar(255),
	"color" varchar(7),
	CONSTRAINT "techs_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "works" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"subtitle" varchar(255) NOT NULL,
	"description" text,
	"thumbnail" varchar(255) NOT NULL,
	"mini_thumbnail" varchar(255),
	"lp_site_url" varchar(255),
	"github_url" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "works_to_techs" (
	"work_id" uuid NOT NULL,
	"tech_id" uuid NOT NULL,
	CONSTRAINT "works_to_techs_work_id_tech_id_pk" PRIMARY KEY("work_id","tech_id")
);
--> statement-breakpoint
DROP TABLE "posts" CASCADE;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "works_to_techs" ADD CONSTRAINT "works_to_techs_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "works_to_techs" ADD CONSTRAINT "works_to_techs_tech_id_techs_id_fk" FOREIGN KEY ("tech_id") REFERENCES "public"."techs"("id") ON DELETE cascade ON UPDATE no action;