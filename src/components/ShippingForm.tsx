"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { shippingDetailsSchema } from "@/lib/validations"; // Ensure this schema is defined in your validations file
import { useRouter } from "next/navigation";

const ShippingForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof shippingDetailsSchema>>({
    resolver: zodResolver(shippingDetailsSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      phone: "",
    },
  });

  const handleSubmit = (data: z.infer<typeof shippingDetailsSchema>) => {
    // Store shipping details in local storage for later use
    localStorage.setItem("shippingDetails", JSON.stringify(data));
    router.push("/checkout/payment");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-semibold text-center mb-6">Shipping Information</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormDescription>This is your full name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormDescription>This is where we will deliver your products.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City Name" {...field} />
                </FormControl>
                <FormDescription>Enter your city name.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="(123) 456-7890" {...field} />
                </FormControl>
                <FormDescription>Enter your phone number.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" className="mt-4">Proceed to Payment</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ShippingForm;
