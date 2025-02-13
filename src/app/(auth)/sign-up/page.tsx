"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/actions/auth";
import { toast } from "@/hooks/use-toast";

interface FormValues {
  email: string;
  password: string;
}

export default function SignUpPage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: FormValues) {
    const result = await signUp(data);

    if (result.success) {
      toast({
        title: "Success",
        // description: isSignIn ? 'You have been signed in successfully' : 'You have been signed up successfully',
        description: "You have been signed up successfully",
      });

      router.push("/");
    } else {
      toast({
        title: "Error Signing Up",
        description: result.error,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <p className="text-center font-medium font-mono text-black p-3">
        Join Farmers Market to start selling or buying local produce
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
