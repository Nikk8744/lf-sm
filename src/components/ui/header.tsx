"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,

  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
//   NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
// import Link from "next/link";

function Header1() {

  const [isOpen, setOpen] = useState(false);
  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-background bg-[#43adb3]">
      <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
        <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
          <NavigationMenu className="flex justify-start items-start ">
            <NavigationMenuList className="flex justify-start gap-4 flex-row">

              <NavigationMenuItem className="hover:text-red-600 hover:bg-slate-200 rounded-md px-2 py-1 font-mono font-semibold text-lg">
                <NavigationMenuLink href="/"> Home </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem className="hover:text-red-600 hover:bg-slate-200 rounded-md px-2 py-1 font-mono font-semibold text-lg">
                <NavigationMenuLink href="/products"> Products </NavigationMenuLink>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex lg:justify-center">
          <p className="font-semibold font-mono text-2xl text-[#222831]">Farm mart</p>
        </div>

        <div className="flex justify-end w-full gap-4">
          <Button variant="ghost" className="hidden md:inline">
            Book a demo
          </Button>
          <div className="border-r hidden md:inline"></div>
          <Link href="/sign-in"><Button variant="outline" >Sign in</Button></Link>
          <Link href="/sign-up"><Button>Sign Up</Button></Link>
        </div>
        <div className="flex w-12 shrink lg:hidden items-end justify-end">
          <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          {isOpen && (
            <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
             
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export { Header1 };
