"use client";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/actions/auth";
import { toast } from "@/hooks/use-toast";
import AuthForm from "@/components/AuthForm";
import { signUpSchema } from "@/lib/validations";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
// import { useForm } from "react-hook-form";

interface FormValues {
  name: string;
  email: string;
  password: string;
}

export default function SignUpPage() {
  const router = useRouter();
  // const form = useForm<FormValues>();

  async function onSubmit(data: FormValues) {
    const result = await signUp(data);

    if (result.success) {
      toast({
        title: "Success",
        // description: isSignIn ? 'You have been signed in successfully' : 'You have been signed up successfully',
        description: "You have been signed up successfully",
      });

      // form.reset();

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
    <div className="w-full max-w-md space-y-8">
      {/* Customer Sign Up Section */}
      <div className="space-y-6">
        
        <AuthForm 
          title="Create an Account"
          buttonText="Sign-Up"
          linkText="Already have an account? Sign In"
          linkHref="/sign-in"
          onSubmit={onSubmit}
          schema={signUpSchema}
        />
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or</span>
        </div>
      </div>

      {/* Farmer Sign Up Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Sign Up as Farmer</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Join our marketplace as a seller
          </p>
        </div>
        
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li>• Create your farm profile</li>
          <li>• List and manage your products</li>
          <li>• Connect with local customers</li>
          <li>• Track orders and earnings</li>
        </ul>

        <Button 
          className="w-full"
          onClick={() => router.push('/farmer-sign-up')}
        >
          Register as Farmer
        </Button>
      </div>
    </div>
  );
}
