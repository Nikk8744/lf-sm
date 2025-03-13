import React from 'react'
import { Header1 } from '@/components/ui/header'
import Footer from '@/components/Footer'
import NotificationHandler from '@/components/NotificationHandler'
// import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#EEEEEE]">
      {/* <SidebarProvider>
      <SidebarInset> */}
      <NotificationHandler />
      <div className='mb-20'>
      <Header1 />
      </div>
      <main className="flex-grow pt-22">{children}</main>
      <Footer />
      {/* </SidebarInset>
      </SidebarProvider> */}
    </div>
  )
}

export default Layout
