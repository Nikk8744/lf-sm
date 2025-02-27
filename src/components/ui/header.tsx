"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  //   NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
// import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useCartStore } from "@/store/useCartStore";
import { Badge } from "./badge";

function  Header1() {
  const [isOpen, setOpen] = useState(false);
  const { data: session } = useSession();
  const cart = useCartStore((state) => state.cart);
  // const [dropdownOpen, setDropdownOpen] = useState(false);

  // Calculate total items in cart
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" }); // Optionally redirect to home after logout
  };

  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-[#48b5bb]">
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
        <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
          <NavigationMenu className="flex justify-start items-start ">
            <NavigationMenuList className="flex justify-start gap-4 flex-row">
              <NavigationMenuItem className="hover:text-red-600 hover:bg-slate-200 rounded-md px-2 py-1 font-mono font-semibold text-lg">
                <Link href="/"> Home </Link>
              </NavigationMenuItem>

              <NavigationMenuItem className="hover:text-red-600 hover:bg-slate-200 rounded-md px-2 py-1 font-mono font-semibold text-lg">
                <Link href="/products">
                  {" "}
                  Products{" "}
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem className="hover:text-red-600 hover:bg-slate-200 rounded-md px-2 py-1 font-mono font-semibold text-lg">
                <Link href="/orders"> Orders </Link>
              </NavigationMenuItem>

              <NavigationMenuItem className="hover:text-red-600 hover:bg-slate-200 rounded-md px-2 py-1 font-mono font-semibold text-lg">
                <Link href="/subscription-plans">Subscriptions</Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex lg:justify-center">
          <p className="font-semibold font-mono text-2xl text-[#222831]">
            Farm mart
          </p>
        </div>

        <div className="flex justify-end w-full gap-4">
        <Link href="/cart">
            <Button variant="ghost" className="flex gap-2 text-center relative">
              <ShoppingCart />
              <p className="text-base font-semibold">Cart</p>
              {cartItemsCount > 0 && (
                <Badge 
                  variant="myVariant" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-1 text-xs"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>

          {session?.user ? (
            <>
              <div className="border-r hidden md:inline"></div>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <button>
                      <Avatar>
                        <AvatarImage
                          src={session.user?.image ?? "/default-avatar.png"}
                          alt="User Avatar"
                        />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 bg-white p-4 shadow-lg rounded-md">
                    <Link href="/user-details">
                      <Button variant="outline" className="w-full text-left">
                        User Details
                      </Button>
                    </Link>
                    <Button
                      variant="default"
                      className="w-full mt-2"
                      onClick={handleLogout}
                    >
                      Log Out
                    </Button>
                  </PopoverContent>
                </Popover>
              </div>
            </>
          ) : (
            <>
              <div className="border-r hidden md:inline"></div>
              <Link href="/sign-in">
                <Button variant="outline">Sign in</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex w-12 shrink lg:hidden items-end justify-end">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          {isOpen && (
            <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8"></div>
          )}
        </div>
      </div>
    </header>
  );
}

export { Header1 };
