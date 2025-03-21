CREATE TABLE "farmers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT 'Farmer' NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"role" "role" DEFAULT 'FARMER',
	"farm_name" text NOT NULL,
	"farm_description" text NOT NULL,
	"farm_address" text NOT NULL,
	"farm_city" text NOT NULL,
	"farm_state" text NOT NULL,
	"farm_zip" varchar NOT NULL,
	"farm_location" text,
	"years_of_experience" integer NOT NULL,
	"profile_image" text,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "farmers_id_unique" UNIQUE("id"),
	CONSTRAINT "farmers_email_unique" UNIQUE("email")
);
