CREATE TABLE "results" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "results_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer,
	"jobDescription" varchar NOT NULL,
	"resumeText" varchar NOT NULL,
	"overallScore" integer NOT NULL,
	"skillsMatchScore" integer NOT NULL,
	"experienceRelevanceScore" integer NOT NULL,
	"educationScore" integer NOT NULL,
	"matchedKeywords" varchar[],
	"missingKeywords" varchar[],
	"suggestions" jsonb[],
	"summary" varchar NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "results" ADD CONSTRAINT "results_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;