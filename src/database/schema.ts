import { decimal, integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

export const ROLE_ENUM = pgEnum('role', ['ADMIN', 'USER']);

export const users = pgTable('users', {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    email: text('email').notNull().unique(),
    password: text('password').notNull(),
    role: ROLE_ENUM('role').default('USER'),
    googleId: varchar('google_id').unique(),
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

/* 
Tables to create

users table - id, name, email, password, role, timestamps
products table: id, product_name, price, category, description, timestamps, farmerId(users), iamgeUrl, quantity
orders table: id, userId, productId, quantity, statu, totalAmount, shippingAddress, payment_method, timestamps
user_address table: id, userid(users), address [optional]
order_items: id, orderId(orders), productId(products), quantity, unitPrice, totalPrice, timestamps
cart_table: id, userId(users), productId(products), quantity, timestamps


*/