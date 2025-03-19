"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  // FormDescription,
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
    const formattedAddress = `${data.name}, ${data.address}, ${data.city}`;
    // Store shipping details in local storage for later use
    const shippingDetails = { ...data, formattedAddress };
    window.localStorage.setItem(
      "shippingDetails",
      JSON.stringify(shippingDetails)
    );

    // Verify storage
    const stored = window.localStorage.getItem("shippingDetails");
    console.log("Stored shipping details:", stored); // Debug log

    router.push("/checkout/payment");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  type="tel" 
                  placeholder="1234567890" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main Street" {...field} />
              </FormControl>
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
                <Input placeholder="New York" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Continue to Payment
        </Button>
      </form>
    </Form>
  );
};

export default ShippingForm;
