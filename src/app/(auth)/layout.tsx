import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth';
// import { getSession } from 'next-auth/react';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react'

const layout = async ({ children }: {children: ReactNode}) => {
    // const session = await getSession();
    const session = await getServerSession(authOptions);
    console.log("The session is",session)   
    if(session) redirect('/')
  return (
    <main className=" relative flex flex-row h-screen w-screen">
        <section className="flex-1 flex items-center justify-center">
            <div className='w-full max-w-md p-6'>
                <h1 className="text-4xl font-semibold text-center mb-6 font-mono">FARMERS MARKET</h1>
                {children}
            </div>
        </section>

        {/* Right image section  */}
        <section className='hidden lg:flex flex-1 items-center justify-center'>
            <Image src='/images/auth-image2.webp' alt='Auth-Image' width={1000} height={1000} className='w-full h-full object-cover' />
        </section>
    </main>
  )
}

export default layout