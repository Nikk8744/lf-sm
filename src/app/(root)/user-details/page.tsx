"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function UserDetailsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={session.user?.image ?? "/default-avatar.png"} alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg font-medium">{session.user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg font-medium">{session.user.name || "Not provided"}</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => router.push('/')}>
              Back to Home
            </Button>
            <Button>
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}