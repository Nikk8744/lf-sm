"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Loader2,
  User,
} from "lucide-react";

export const Icons = {
  spinner: Loader2,
  eye: Eye,
  eyeOff: EyeOff,
  lock: Lock,
  mail: Mail,
  user: User,
};
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

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const isSignUp = buttonText.toLowerCase() === "sign-up";

  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
    <div className="space-y-2 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">
        Enter your details below to {isSignUp ? "create your account" : "sign in to your account"}
      </p>
    </div>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 mt-6">
        {isSignUp && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Icons.user className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="John Doe" 
                      className="pl-10" 
                      {...field}
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="relative">
                  <Icons.mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    className="pl-10"
                    {...field}
                    disabled={isLoading}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Icons.lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    className="pl-10 pr-10" 
                    placeholder="Enter your password"
                    {...field}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Icons.eyeOff className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Icons.eye className="h-5 w-5 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          {buttonText}
        </Button>
      </form>
    </Form>

    <div className="mt-6 text-center text-sm">
      <Link
        href={linkHref}
        className="text-primary hover:text-blue-600 font-medium"
      >
        {linkText}
      </Link>
    </div>
  </div>
  );
};

export default AuthForm;
