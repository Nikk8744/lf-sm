import { config } from 'dotenv';
import dummyProducts from '../../dummyProducts.json';   
// import { db } from './drizzle';
import {  products } from './schema';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';


config({ path: '.env.local'})

const sql = neon(process.env.DATABASE_URL!)
export const db = drizzle({client: sql})

const seed = async () => {
    console.log("Seeding data....")

    try {
        for(const product of dummyProducts){
            await db.insert(products).values({
                ...product,

            })
            console.log("Data seeded successfully")
        }
    } catch (error) {
        console.log("Error while seeding data:", error)
    }
}  

seed();