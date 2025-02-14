import { z } from "zod";

export const shippingDetailsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  phone: z.string().min(10, { message: "Phone number should be of 10 digits" }).max(10), 
});

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
})