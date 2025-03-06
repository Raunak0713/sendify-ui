"use client";

import { usePathname } from "next/navigation";
import { CreditCard, FileText, LayoutDashboard, Terminal } from "lucide-react";
import React from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const sidebarItems = [
  {
    label: "Projects",
    icon: LayoutDashboard,
    link: "/dashboard/projects",
  },
  {
    label: "Docs",
    icon: FileText,
    link: "/dashboard/docs",
  },
  {
    label: "Billing",
    icon: CreditCard,
    link: "/dashboard/billing",
  },
  {
    label: "Playground",
    icon: Terminal,
    link: "/dashboard/playground",
  },
];

const Sidebar = () => {
  const pathname = usePathname(); // Get current route

  return (
    <div className="flex">
      {/* Horizontal Header with border */}
      <header className="fixed top-0  left-0 w-full bg-gradient-to-r from-zinc-900 to-zinc-900/90 backdrop-blur-md z-40 h-18 flex items-center px-5 border-b border-white/10 shadow-lg">
        {/* Logo */}
        <Link href={"/"} className="flex gap-3 items-center">
          <div className="py-1 px-2 md:py-2 md:px-4 bg-white rounded-md shadow-md">
            <div className="text-zinc-900 font-bold text-sm md:text-lg">S</div>
          </div>
          <div className="font-bold text-xl text-white tracking-wide">Sendify</div>
        </Link>

        {/* Placeholder for additional header items */}
        <div className="ml-auto flex items-center space-x-4">
            <UserButton appearance={{ elements: { userButtonAvatarBox: { width: '2rem', height: '2rem',},},}}/>
        </div>
      </header>

      {/* Sidebar with border */}
      <aside className="hidden md:block fixed left-0 top-16 bottom-0 w-1/6  backdrop-blur-md p-5 text-white border-r border-white/10 shadow-xl">
        {/* Sidebar Items */}
        <nav className="mt-4">
          <ul className="space-y-3">
            {sidebarItems.map((item, index) => {
              const isActive = pathname.startsWith(item.link);
              return (
                <li key={index}>
                  <a
                    href={item.link}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition duration-300 ${
                      isActive
                        ? "bg-blue-500/20 text-white border-l-4 border-blue-500 shadow-md"
                        : "text-white/80  hover:text-white"
                    }`}
                  >
                    <item.icon size={22} className={isActive ? "text-blue-400" : "text-white/70"} />
                    <span className="text-lg">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

    </div>
  );
};

export default Sidebar;
