ALTER TABLE "subscription_plans" ADD COLUMN "stripe_product_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "subscription_plans" ADD COLUMN "stripe_price_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "stripe_customer_id" text;--> statement-breakpoint
ALTER TABLE "subscription_plans" ADD CONSTRAINT "subscription_plans_stripe_product_id_unique" UNIQUE("stripe_product_id");--> statement-breakpoint
ALTER TABLE "subscription_plans" ADD CONSTRAINT "subscription_plans_stripe_price_id_unique" UNIQUE("stripe_price_id");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_stripe_customer_id_unique" UNIQUE("stripe_customer_id");