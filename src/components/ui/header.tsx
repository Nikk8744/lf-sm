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
import { NotificationBell } from "../NotificationBell";

function Header1() {
  const [isOpen, setOpen] = useState(false);
  const { data: session } = useSession();
  // console.log({session});
  const cart = useCartStore((state) => state.cart);
  // const [dropdownOpen, setDropdownOpen] = useState(false);

  // Calculate total items in cart
  const cartItemsCount = cart.length;

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" }); // Optionally redirect to home after logout
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/about", label: "About" },
    { href: "/orders", label: "Orders" },
    { href: "/subscription-plans", label: "Subscriptions" },
  ];

  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-[#48b5bb] shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <p className="font-semibold font-mono text-xl sm:text-2xl text-[#222831]">
              Farm mart
            </p>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-4">
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      className="hover:text-red-600 hover:bg-slate-200 rounded-md px-3 py-2 font-mono font-semibold text-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Right side section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationBell />

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                className="relative p-2 sm:p-3 hover:bg-white/20 transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="hidden sm:inline ml-2 font-semibold">
                  Cart
                </span>
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

            {/* User Menu */}
            {session?.user ? (
              <div className="flex items-center">
                <div className="hidden md:block border-l border-white/20 h-8 mx-4" />
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="focus:outline-none focus:ring-2 focus:ring-white/20 rounded-full">
                      <Avatar>
                        <AvatarImage
                          src={session.user?.image ?? "/default-avatar.png"}
                          alt="User Avatar"
                        />
                        <AvatarFallback>
                          {session?.user.role === "FARMER" ? "F" : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2 mt-2">
                    <div className="flex flex-col gap-1">
                      <Link href="/user-details">
                        <Button variant="ghost" className="w-full justify-start">
                          User Details
                        </Button>
                      </Link>
                      <Link href="/subscriptions">
                        <Button variant="ghost" className="w-full justify-start">
                          My Subscriptions
                        </Button>
                      </Link>
                      {session.user?.role === "FARMER" && (
                        <Link href="/dashboard/farmer">
                          <Button variant="ghost" className="w-full justify-start">
                            Dashboard
                          </Button>
                        </Link>
                      )}
                      <div className="h-[1px] bg-gray-200 my-1" />
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleLogout}
                      >
                        Log Out
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <div className="hidden md:block border-l border-white/20 h-8 mx-4" />
                <Link href="/sign-in">
                  <Button variant="outline" className="bg-white/10 hover:bg-white/20">
                    Sign in
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-white text-[#070c0c] font-semibold hover:bg-white/90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="lg:hidden p-2 hover:bg-white/20"
              onClick={() => setOpen(!isOpen)}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg">
          <nav className="container mx-auto px-4 py-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-lg font-medium py-3 px-4 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {!session?.user && (
                <div className="flex flex-col gap-2 sm:hidden mt-4 pt-4 border-t">
                  <Link href="/sign-in">
                    <Button variant="outline" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export { Header1 };
