CREATE TABLE "request_log" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"at" timestamp with time zone DEFAULT now() NOT NULL,
	"site" varchar(10) NOT NULL,
	"route" varchar(120) NOT NULL,
	"method" varchar(8) NOT NULL,
	"status" integer NOT NULL,
	"ms" integer NOT NULL,
	"ip" varchar(64),
	"note" varchar(120)
);
--> statement-breakpoint
CREATE INDEX "request_log_at_idx" ON "request_log" USING btree ("at");--> statement-breakpoint
CREATE INDEX "request_log_route_at_idx" ON "request_log" USING btree ("route","at");