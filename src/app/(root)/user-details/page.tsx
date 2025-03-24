"use client";

import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { CreditCard, MapPin, Package, User } from "lucide-react";
import { useEffect } from "react";

export default function UserDetailsPage() {
  const { data: session,status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/sign-in');
    }
  }, [status, router]);

  // Show loading state while checking session
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-row items-center gap-4 border-b pb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={session.user?.image ?? "/default-avatar.png"} alt="User Avatar" />
            <AvatarFallback>{session.user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">Account Settings</CardTitle>
            <p className="text-muted-foreground mt-1">Manage your account preferences and settings</p>
          </div>
        </CardHeader>

        <Tabs defaultValue="profile" className="p-6">
          <TabsList className="grid grid-cols-4 gap-4 w-full max-w-2xl mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile"> 
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg font-medium">{session.user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-lg font-medium">{session.user.name || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Member Since</label>
                  <p className="text-lg font-medium">January 2024</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Type</label>
                  <p className="text-lg font-medium">{session.user.role === "USER" ? "User" : "Farmer"}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-4 mt-8">
                <h3 className="text-lg font-semibold">Account Actions</h3>
                <div className="flex gap-4">
                  <Button onClick={() => router.push('/edit-profile')}>
                    Edit Profile
                  </Button>
                  <Button variant="outline" onClick={() => router.push('/change-password')}>
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="addresses">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Saved Addresses</h3>
              <p className="text-muted-foreground">No addresses saved yet. Comming Soon</p>
              <Button onClick={() => router.push('/add-address')}>
                Add New Address
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Recent Orders</h3>
                <Button variant="outline" onClick={() => router.push('/orders')}>
                  View All Orders
                </Button>
              </div>
              <p className="text-muted-foreground">No recent orders found. Comming Soon</p>
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Payment Methods</h3>
              <p className="text-muted-foreground">No payment methods saved. Comming Soon</p>
              <Button onClick={() => router.push('/add-payment-method')}>
                Add Payment Method
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <CardContent className="border-t pt-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => router.push('/')}>
              Back to Home
            </Button>
            <Button variant="destructive" onClick={ () => alert("You can't delete your account🤫🤫🤫🤫🤫")}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}