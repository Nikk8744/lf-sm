ALTER TABLE "orders" DROP CONSTRAINT "orders_shipping_address_addresses_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" text NOT NULL;