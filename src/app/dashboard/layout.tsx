import React from 'react'
import { Header1 } from '@/components/ui/header'
import Footer from '@/components/Footer'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#EEEEEE]">
      <div className='mb-20'>
        <Header1 />
      </div>
      <main className="flex-grow pt-22">{children}</main>
      <Footer />
    </div>
  )
}

export default DashboardLayout