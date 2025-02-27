import { boolean, decimal, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const ROLE_ENUM = pgEnum('role', ['ADMIN', 'USER', 'FARMER']);

export const users = pgTable('users', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    name: text('name').notNull().default('User'),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: ROLE_ENUM('role').default('USER'),
    googleId: varchar('google_id').unique(),
    stripeCustomerId: text('stripe_customer_id').unique(),
    createdAt: timestamp('created_at', {
        withTimezone: true,
    }).notNull().defaultNow(),
});


export const products = pgTable('products', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    name: text('name').notNull(),
    description: text('description'),
    price: decimal('price').notNull(),
    category: varchar('category').notNull(),
    image: text('image'),
    farmerId: uuid('farmer_id').notNull().references(() => users.id),
    quantity: integer('quantity'),
    farmLocation: text('farm_location'),
    createdAt: timestamp('created_at', {
        withTimezone: true,
    }).notNull().defaultNow(),
});

export const PAYMENT_STATUS_ENUM = pgEnum('payment_status', ['PENDING', 'COMPLETED', 'FAILED']);
export const ORDER_STATUS_ENUM = pgEnum('order_status', ['PENDING', 'SHIPPED', 'DELIVERED']);

export const orders = pgTable('orders', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    userId: uuid('user_id').notNull().references(() => users.id),
    totalAmount: decimal('total_amount').notNull(),
    // shippingAddress: uuid('shipping_address').notNull().references(() => userAddress.id),
    shippingAddress: text('shipping_address').notNull(),
    paymentStatus: PAYMENT_STATUS_ENUM('payment_status').default('PENDING'),
    paymentMethod: varchar('payment_method').notNull(), // You can add more payment method types as needed
    paymentIntentId: varchar('payment_intent_id').notNull(), // Stripe PaymentIntent ID
    orderStatus: ORDER_STATUS_ENUM('order_status').default('PENDING'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const userAddress = pgTable('addresses', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    userId: uuid('user_id').notNull().references(() => users.id),
    shippingAddress: text('shipping_address').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const orderItems = pgTable('orderItems', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    orderId: uuid('order_id').notNull().references(() => orders.id),
    productId: uuid('product_id').notNull().references(() => products.id),
    quantity: integer('quantity').notNull(),
    unitPrice: decimal('unit_price').notNull(),
    totalPrice: decimal('total_price').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const review = pgTable('reviews', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    userId: uuid('user_id').notNull().references(() => users.id),
    productId: uuid('product_id').notNull().references(() => products.id),
    rating: integer('rating').notNull(),
    comment: text('comment'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const SUBSCRIPTION_INTERVAL_ENUM = pgEnum('subscription_interval', ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']);
export const SUBSCRIPTION_STATUS_ENUM = pgEnum('subscription_status', ['ACTIVE', 'PAUSED', 'CANCELLED']);


export const subscriptionPlans = pgTable('subscription_plans', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    name: varchar('name').notNull(),
    description: text('description'),
    price: decimal('price').notNull(),
    interval: SUBSCRIPTION_INTERVAL_ENUM('interval').notNull(),
    isActive: boolean('is_active').default(true),
    maxProducts: integer('max_products').notNull(),
    stripeProductId: text('stripe_product_id').notNull().unique(), // this will liknk to stripe product - which link you plans to stripe
    stripePriceId: text('stripe_price_id').notNull().unique(), 
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const subscriptions = pgTable('subscriptions', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    userId: uuid('user_id').notNull().references(() => users.id),
    planId: uuid('plan_id').notNull().references(() => subscriptionPlans.id),
    status: SUBSCRIPTION_STATUS_ENUM('status').notNull(),
    currentPeriodStart: timestamp('current_period_start', { withTimezone: true }).notNull(),
    currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }).notNull(),
    stripeSubscriptionId: varchar('stripe_subscription_id').notNull().unique(),
    cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
    stripePriceId: text('stripe_price_id').notNull(),
    stripeCustomerId: text('stripe_customer_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const deliverySchedules = pgTable('delivery_schedules', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    subscriptionId: uuid('subscription_id').notNull().references(() => subscriptions.id),
    preferredDay: varchar('preferred_day').notNull(),
    preferredTime: varchar('preferred_time').notNull(),
    address: text('address').notNull(),
    instructions: text('instructions'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const subscriptionItems = pgTable('subscription_items', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    subscriptionId: uuid('subscription_id').notNull().references(() => subscriptions.id),
    productId: uuid('product_id').notNull().references(() => products.id),
    quantity: integer('quantity').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    // updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

/* 
Tables to create

users table - id, name, email, password, role, timestamps
products table: id, product_name, price, category, description, timestamps, farmerId(users), iamgeUrl, quantity
orders table: id, userId, productId, quantity, statu, totalAmount, shippingAddress, payment_method, timestamps
user_address table: id, userid(users), address [optional]
order_items: id, orderId(orders), productId(products), quantity, unitPrice, totalPrice, timestamps
cart_table: id, userId(users), productId(products), quantity, timestamps


-----------------
subscription feature:

subscription_plans: id, name, price, interval, features, timestamps
subscription: id, userId(users), planId(subscription_plans), status, start, end, stripe_subscription_id, timestamps

*/