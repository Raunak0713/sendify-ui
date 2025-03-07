"use client"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"
import * as React from "react"
import { NavMain } from "../components/nav-main"
import { NavProjects } from "../components/nav-projects"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "./ui/sidebar"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="border-none bg-black">
      <SidebarHeader className="bg-black">
        <Link href={"/"} className="text-white py-1 flex gap-3 items-center">
          <div className="py-1 px-2 md:py-2 md:px-4 bg-white rounded-sm relative logo-container">
            <div className="text-zinc-900 font-bold text-sm md:text-lg">S</div>
          </div>
          <div className="font-bold text-xl sendify-text">Sendify</div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-black">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
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