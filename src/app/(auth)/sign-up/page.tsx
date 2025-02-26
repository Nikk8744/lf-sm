"use client";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/actions/auth";
import { toast } from "@/hooks/use-toast";
import AuthForm from "@/components/AuthForm";
import { signUpSchema } from "@/lib/validations";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

export default function SignUpPage() {
  const router = useRouter();

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
    <AuthForm 
    title="Join Farmers Market to start selling or buying local produce"
    buttonText="Sign-Up"
    linkText="Already have an account? Sign In"
    linkHref="/sign-in"
    onSubmit={onSubmit}
    schema={signUpSchema}
  />
  );
}
