import React from "react";
import { Header1 } from "@/components/ui/header";
import Footer from "@/components/Footer";
import NotificationHandler from "@/components/NotificationHandler";
// import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#EEEEEE]">
      {/* <SidebarProvider>
      <SidebarInset> */}
      <NotificationHandler />
      <div className="mb-12 sm:mb-14">
        <Header1 />
      </div>

      {/* <header className="flex-none md-20">
        <Header1 />
      </header> */}

      <main className="flex-grow pt-4 sm:pt-6 ">{children}</main>

      {/* <Footer /> */}
      {/* Footer Section */}
      <footer className="flex-none w-full">
        <Footer />
      </footer>
      {/* </SidebarInset>
      </SidebarProvider> */}
    </div>
  );
};

export default Layout;
