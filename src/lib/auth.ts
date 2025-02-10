import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
 
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"},
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Missing email or password!!")
                }

                try {
                    const user = await db.select().from(users).where(eq(users.email, credentials.email.toString())).limit(1);
                    if(user.length == 0) return null;

                    const isPasswordValid = await compare(
                        credentials.password.toString(),
                        user[0].password,
                    );
                    if(!isPasswordValid){
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user[0].id.toString(),
                        email: user[0].email,
                        // name: user[0].name,
                    }
                } catch (error) {
                    throw error
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {},
        async session({session, token}) {}
    },
    session: {
        strategy: 'jwt', // a session has 2 strategy db and jwt, we have chose jwt.
    }
} 