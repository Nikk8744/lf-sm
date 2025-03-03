import React from 'react'
import { Header1 } from '@/components/ui/header'
import Footer from '@/components/Footer'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/sign-in')
  if(session.user.role !== "FARMER") redirect('/')

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