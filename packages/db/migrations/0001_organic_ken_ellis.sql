ALTER TABLE "users" RENAME COLUMN "name" TO "firstName";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "lastName" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerkId" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "created_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerkId_unique" UNIQUE("clerkId");