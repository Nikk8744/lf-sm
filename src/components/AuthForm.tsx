"use client";
import React from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
// import { useRouter } from 'next/navigation';
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, signUpSchema } from "@/lib/validations";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

interface AuthFormProps {
  onSubmit: (data: FormValues) => Promise<void>;
  title: string;
  buttonText: string;
  linkText: string;
  linkHref: string;
  schema: typeof signUpSchema | typeof signInSchema;
}

const AuthForm = ({
  onSubmit,
  title,
  buttonText,
  linkText,
  linkHref,
  schema,
}: AuthFormProps) => {
  // const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const isSignUp = buttonText.toLowerCase() === "sign-up";

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <p className="text-center font-medium text-lg font-mono text-black p-3">
        {title}
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {isSignUp && (
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>Enter your full name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Enter your email address.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            rules={{
              required: "Password is required",
              minLength: {
                value: 2,
                message: "Password must be at least 5 characters",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormDescription>Enter your password</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {buttonText}
          </Button>
        </form>
      </Form>
      <p className="text-center text-base font-semibold p-3">
        {/* {linkText}{" "} */}
        <Link
          href={linkHref}
          className="text-bold text-blue-500 hover:text-red-400"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default AuthForm;
