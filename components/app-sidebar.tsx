"use client"
import { UserButton } from "@clerk/nextjs"
import {
  BookOpen,
  Settings2,
  SquareTerminal
} from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { NavMain } from "../components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar"

const data = {
  navMain: [
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "My Projects",
          url: "/dashboard/projects",
        },
        {
          title: "Create Project",
          url: "/dashboard/projects",
        },
      ],
    },
    
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-none bg-black">
      <SidebarHeader className="bg-black">
        <Link href={"/"} className="text-white py-1 flex gap-3 items-center">
          <div className="py-1 px-2 md:py-[6px] md:px-[14px] bg-white rounded-sm relative logo-container">
            <div className="text-zinc-900 font-bold text-sm md:text-lg">S</div>
          </div>
          <div className="font-bold text-xl sendify-text">Sendify</div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-black">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="bg-black">
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
      
      {/* Add a style tag to handle the collapse behavior */}
      <style jsx global>{`
        /* When the sidebar is collapsed, hide the text */
        [data-collapsed="true"] .sendify-text,
        [data-state="collapsed"] .sendify-text,
        .collapsed .sendify-text {
          display: none;
        }
        
        /* Make the logo smaller when collapsed */
        [data-collapsed="true"] .logo-container,
        [data-state="collapsed"] .logo-container,
        .collapsed .logo-container {
          padding: 0.08rem 0.42rem !important;
          margin: 0 auto;
        }
        
        [data-collapsed="true"] .logo-container div,
        [data-state="collapsed"] .logo-container div,
        .collapsed .logo-container div {
          font-size: 0.875rem !important;
        }
      `}</style>
    </Sidebar>
  )
}