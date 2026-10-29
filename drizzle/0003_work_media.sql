CREATE TABLE "work_media" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"work_id" uuid NOT NULL,
	"url" varchar(500) NOT NULL,
	"kind" varchar(10) DEFAULT 'image' NOT NULL,
	"caption" varchar(255),
	"sort" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "work_media" ADD CONSTRAINT "work_media_work_id_works_id_fk" FOREIGN KEY ("work_id") REFERENCES "public"."works"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "work_media_work_id_sort_idx" ON "work_media" USING btree ("work_id","sort");