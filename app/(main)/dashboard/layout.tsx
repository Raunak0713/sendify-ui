"use client"
import React from 'react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../../../components/ui/sidebar'
import { AppSidebar } from '../../../components/app-sidebar'
import { Separator } from '../../../components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '../../../components/ui/breadcrumb'
import { usePathname } from 'next/navigation'

interface DashboardLayoutProps {
  children : React.ReactNode
}

const DashboardLayout = ({ children } : DashboardLayoutProps) => {
  const pathname = usePathname()

  const getPageTitle = () => {
    const pageNames: Record<string, string> = {
      "/dashboard": "Dashboard",
      "/dashboard/projects": "Projects",
      "/dashboard/billing": "Billing",
      "/dashboard/docs": "Documentation",
      "/dashboard/playground": "Playground",
    };
    return pageNames[pathname] || "Dashboard"; // Default to "Dashboard" if no match
  };

  return (
    <SidebarProvider className="dark">
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 bg-black shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#" className='text-white'>
                    {getPageTitle()}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex bg-black text-white flex-1 flex-col gap-4 p-4 pt-0">
          { children }
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout