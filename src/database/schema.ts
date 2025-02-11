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
    createdAt: timestamp('created_at', {
        withTimezone: true,
    }).notNull().defaultNow(),
});




/* 
Tables to create

users table - id, name, email, password, role, timestamps
products table: id, product_name, price, category, description, timestamps, farmerId(users), iamgeUrl, quantity
user_address table: id, userid(users), address [optional]
orders table: id, userId, productId, quantity, statu, totalAmount, shippingAddress, payment_method, timestamps
order_items: id, orderId(orders), productId(products), quantity, unitPrice, totalPrice, timestamps
cart_table: id, userId(users), productId(products), quantity, timestamps


*/