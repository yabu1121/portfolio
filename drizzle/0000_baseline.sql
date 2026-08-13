CREATE TABLE "contact" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"sender_user" varchar(255),
	"sender_password" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" integer NOT NULL,
	"month" integer NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "m2m_works_to_techs" (
	"work_id" uuid NOT NULL,
	"tech_id" uuid NOT NULL,
	"description" text,
	CONSTRAINT "m2m_works_to_techs_work_id_tech_id_pk" PRIMARY KEY("work_id","tech_id")
);
--> statement-breakpoint
CREATE TABLE "my_techs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tech_id" uuid NOT NULL,
	"level" integer DEFAULT 0 NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "techs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"icon_url" varchar(255),
	"kind" varchar(20) DEFAULT 'library' NOT NULL,
	CONSTRAINT "techs_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "timeline" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"year" varchar(4) NOT NULL,
	"month" integer NOT NULL,
	"day" integer,
	"end_year" varchar(4),
	"end_month" integer,
	"end_day" integer,
	"is_ongoing" boolean DEFAULT false NOT NULL,
	"category" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"detail" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "works" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"github_url" varchar(255),
	"lp_site_url" varchar(255),
	"site_url" varchar(255),
	"thumbnail" varchar(255),
	"mini_thumbnail" varchar(255),
	"category" varchar(50),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "m2m_works_to_techs" ADD CONSTRAINT "m2m_works_to_techs_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "m2m_works_to_techs" ADD CONSTRAINT "m2m_works_to_techs_tech_id_techs_id_fk" FOREIGN KEY ("tech_id") REFERENCES "public"."techs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "my_techs" ADD CONSTRAINT "my_techs_tech_id_techs_id_fk" FOREIGN KEY ("tech_id") REFERENCES "public"."techs"("id") ON DELETE cascade ON UPDATE no action;