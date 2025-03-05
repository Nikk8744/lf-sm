import { z } from "zod";

export const shippingDetailsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  phone: z.string().min(10, { message: "Phone number should be of 10 digits" }).max(10), 
});

export const signUpSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email(),
  password: z.string().min(8).max(100),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
})

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  image: z.string().url("Invalid image URL"),
  category: z.string().min(1, "Category is required"),
  farmLocation: z.string().min(1, "Farm location is required"),
  quantity: z.coerce.number().min(0, "Quantity must be 0 or greater"),
})

export const productUpdateSchema = productSchema.partial();

export const createOrderSchema = z.object({
  items: z.array(z.object({
      productId: z.string(),
      quantity: z.number().positive(),
      price: z.number().positive(),
  })),
  totalAmount: z.number().positive(),
  shippingAddress: z.string(),
  paymentMethod: z.string(),
  paymentIntentId: z.string(),
  userId: z.string(),
  isWebhook: z.boolean().optional(),
});

export const orderItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().positive(),
  unitPrice: z.string(),
  totalPrice: z.string(),
});

export const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(3).max(500).optional(),
});


export const subscriptionPlansSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters").optional(),
  price: z.number().positive("Price must be a positive number"),
  interval: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]),
  isActive: z.boolean().optional(),
  maxProducts: z.number().positive("Must include at least one product"),
})

export const createSubscriptionSchema = z.object({
  planId: z.string().uuid(),
  paymentMethodId: z.string().min(1),
    deliverySchedule: z.object({
        preferredDay: z.string(),
        preferredTime: z.string(),
        address: z.string(),
        instructions: z.string().optional(),
    }),
})

export const trackingUpdateSchema = z.object({
  status: z.enum([
      'ORDER_PLACED',
        'CONFIRMED',
        'PROCESSING',
        'PACKED',
        'SHIPPED',
        'OUT_FOR_DELIVERY',
        'DELIVERED'
  ]),
  message: z.string().optional(),
  location: z.string().optional(),
});