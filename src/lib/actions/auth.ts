"use server"

// import { signIn } from "@/auth";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { signIn } from "next-auth/react"; // this is a client side component only so either i'll have to make change in the auth and export signIn and signOut there or wirte the signin/login code in signin page 

export const signInWithCredentials = async (
    params: Pick<AuthCredentials, "email" | "password">,
) => {
    const { email, password } = params;

    try {
        const result = await signIn('credentials', { email, password, redirect: false });
        console.log("The result is",result)
        if(result?.error){
            return { success: false, error: result.error };
        }

        return { success: true }
    } catch (error) {
        console.log(error, "Error signing in");
        return { success: false, error: "Signin error, Please Try Again"}
    }
}

export const signUp = async (params: AuthCredentials) => {
    const {  email, password } = params;

    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

    if(existingUser.length > 0){
        return { success: false, error: "User already exists" };
    }

    const hashedPassword = await hash(password, 10);

    try {
        await db.insert(users).values({

            email,
            password: hashedPassword,
        });

        await signInWithCredentials({ email, password });
        return { success: true };
    } catch (error) {
        console.log(error, "Signup error");
        return {success: false, error: "Signup error"};
    }
};