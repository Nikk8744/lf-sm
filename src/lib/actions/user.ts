import { z } from "zod";
import { changePasswordSchema, updateProfileSchema } from "../validations";
import { users } from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcryptjs";
import { getSession } from "next-auth/react";

export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
  // console.log("The data is",data)
  try {
    // const session = await getServerSession(authOptions); // this wont come as this is a client side function not server side 
    const session = await getSession();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const validatedData = updateProfileSchema.safeParse(data);
    // console.log("The validated data is",validatedData)

    if (!validatedData.success) {
      return { error: validatedData.error.errors[0].message };
    }

     await db
      .update(users)
      .set({
        name: validatedData.data.name,
      })
      .where(eq(users.id, session.user.id)).returning();
      // console.log("The updated user is",updatedUser)
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error("[UPDATE_PROFILE_ERROR]", error);
    return { error: "Failed to update profile" };
  }
}

export async function changePassword(
  data: z.infer<typeof changePasswordSchema>
) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const validatedData = changePasswordSchema.safeParse(data);

    if (!validatedData.success) {
      return { error: validatedData.error.errors[0].message };
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user[0]) {
      return { error: "User not found" };
    }

    const isPasswordValid = await compare(
      validatedData.data.currentPassword,
      user[0].password
    );
    if (!isPasswordValid) {
        return { error: "Invalid current password" };
    }

    const hashedPassword = await hash(validatedData.data.newPassword, 10);

    await db
      .update(users)
      .set({
        password: hashedPassword,
      })
      .where(eq(users.id, session.user.id));

    return { success: true };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error("[CHANGE_PASSWORD_ERROR]", error);
    return { error: "Failed to change password" };
  }
}
