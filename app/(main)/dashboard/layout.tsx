import Sidebar from '@/components/Sidebar'
import React from 'react'

interface DashboardLayoutProps {
  children : React.ReactNode
}

const DashboardLayout = ({ children } : DashboardLayoutProps) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-grow md:ml-[245px] mt-16 p-3 md:p-5">
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout