import React from 'react'

interface DashboardLayoutProps {
  children : React.ReactNode
}

const DashboardLayout = ({ children } : DashboardLayoutProps) => {
  return (
    <div className="">
      { children }
    </div>
  )
}

export default DashboardLayout