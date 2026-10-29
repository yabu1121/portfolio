CREATE TABLE "site_likes" (
	"kind" varchar(16) NOT NULL,
	"target" varchar(160) NOT NULL,
	"visitor" varchar(64) NOT NULL,
	"ip" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_likes_kind_target_visitor_pk" PRIMARY KEY("kind","target","visitor")
);
--> statement-breakpoint
CREATE TABLE "site_views" (
	"kind" varchar(16) NOT NULL,
	"target" varchar(160) NOT NULL,
	"visitor" varchar(64) NOT NULL,
	"day" date NOT NULL,
	"ip" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_views_kind_target_visitor_day_pk" PRIMARY KEY("kind","target","visitor","day")
);
--> statement-breakpoint
CREATE INDEX "site_likes_target_idx" ON "site_likes" USING btree ("kind","target");--> statement-breakpoint
CREATE INDEX "site_likes_ip_idx" ON "site_likes" USING btree ("kind","target","ip");--> statement-breakpoint
CREATE INDEX "site_views_target_idx" ON "site_views" USING btree ("kind","target");--> statement-breakpoint
CREATE INDEX "site_views_ip_day_idx" ON "site_views" USING btree ("kind","target","ip","day");