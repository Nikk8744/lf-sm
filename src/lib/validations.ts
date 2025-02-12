import { z } from "zod";

export const shippingDetailsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  phone: z.string().min(10, { message: "Phone number should be of 10 digits" }).max(10), 
});
