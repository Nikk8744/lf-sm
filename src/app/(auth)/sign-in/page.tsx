"use client";
import { useRouter } from "next/navigation";
// import { signInWithCredentials } from "@/lib/actions/auth";
import { toast } from "@/hooks/use-toast";
import { signIn } from "next-auth/react";
import AuthForm from "@/components/AuthForm";
import { signInSchema } from "@/lib/validations";

interface FormValues {
  email: string;
  password: string;
}

export default function SignInPage() {
  const router = useRouter();


  async function onSubmit(data: FormValues) {
    // const result = await signInWithCredentials(data);
    const result = await signIn('credentials', { email: data.email, password: data.password, redirect: false });
    

    if (result?.ok) {
      toast({
        title: "Success",
        // description: isSignIn ? 'You have been signed in successfully' : 'You have been signed up successfully',
        description: "You have Logged In successfully",
      });

      router.push("/");
    } else {
      toast({
        title: "Error while Logging",
        description: result?.error,
        variant: "destructive",
      });
    }
  }

  return (
    <AuthForm 
      title="Welcome Back"
      buttonText="Sign-In"
      linkText="New To Farm Mart? Create an Account.."
      linkHref="/sign-up"
      onSubmit={onSubmit}
      schema={signInSchema}
    />
  );
}
