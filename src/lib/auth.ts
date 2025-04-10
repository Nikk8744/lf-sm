import { db } from "@/database/drizzle";
import { farmers, users } from "@/database/schema";
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
                    // if(user.length == 0) return null;

                    // If not found in users, check farmers table
                    const farmer = await db.select().from(farmers).where(eq(farmers.email, credentials.email.toString())).limit(1);
                    // console.log("The farmer uissssssss",farmer)

                    const foundUser = user[0] || farmer?.[0];
                    if(!foundUser) return null;

                    // console.log("The found user issssss",foundUser)
                    
                    const isPasswordValid = await compare(
                        credentials.password.toString(),
                        // user[0].password,
                        foundUser.password,
                    );
                    if(!isPasswordValid){
                        throw new Error("Invalid password");
                    }
                    return {
                        id: foundUser.id.toString(),
                        email: foundUser.email,
                        name: foundUser.name,
                        role: foundUser.role === "FARMER" ? "FARMER" : (foundUser.role || "USER"),
                    }
                } catch (error) {
                    throw error
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user, trigger, session}) {
            if(user){
                token.id = user.id
                token.name = user.name
                token.role = user.role || "USER"
            }
            // console.log("The token isss",token)
            if(trigger === "update" && session){
                // session.user.name = token.name as string;
                token.name = session.user.name;
                // console.log("The session nameeeeeeee isss",session.user.name)
            }  
            return token;
        },
        async session({session, token}) { 
            // console.log("The session isss",session)
            if(session.user){
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.role = (token.role) as string;
            }
            
            return session
        }
    },
    pages: {
        signIn: "/sign-in",
        error: "/sign-in",

    },
    session: {
        strategy: 'jwt', // a session has 2 strategy db and jwt, we have chose jwt.
        // maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
} 