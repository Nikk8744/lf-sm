"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FarmerSignUpInput } from "@/lib/validations";
import { FarmerRegistrationForm } from "@/components/FarmerRegistrationForm";
import { toast } from "@/hooks/use-toast";
import { registerFarmer } from "@/lib/actions/auth";

export default function FarmerSignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FarmerSignUpInput) => {
    try {
      setIsLoading(true);
      
      const response = await registerFarmer(data);

    //   const result = await response.json();

      if (!response.error) {
        throw new Error(response.error || "Failed to register");
      }

      toast({
        title: "Registration successful!",
        description: "You can now login to your farmer account.",
      });

      router.push("/sign-in");
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if(isLoading){
    return <div>Loading...</div>
  }

  return (
    <div className="container max-w-4xl mx-auto py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Register as a Farmer</h1>
          <p className="text-muted-foreground">
            Join our marketplace and start selling your farm products
          </p>
        </div>
        <FarmerRegistrationForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}