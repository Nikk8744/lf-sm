import { Header1 } from '@/components/ui/header'
import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <main className="min-h-screen bg-[#EEEEEE]">
        <div>
            <Header1 />
            <div className="min-h-max pt-24">
                {children}
            </div>
        </div>
    </main>
  )
}

export default layout