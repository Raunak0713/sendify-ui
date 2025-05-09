import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { DoorOpen } from "lucide-react";

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-4 left-4 right-4 z-50 transition-all duration-300 px-6 md:px-10",
        isScrolled
          ? "max-w-md sm:max-w-lg md:max-w-7xl mx-auto rounded-2xl py-3 shadow-lg backdrop-blur-sm bg-zinc-900/60 border border-zinc-700/50"
          : "w-full py-4 border-b border-transparent"
      )}
    >

      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-3 md:p-5 bg-orange-500 rounded-lg relative">
            <div className="absolute bottom-[-3px] left-[6.6px] md:top-[5px] md:left-[13px] text-lg md:text-2xl font-bold">
              S
            </div>
          </div>
          <span className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-400">
            Sendify
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href={"/dashboard/projects"}>
                <button className="py-2 flex items-center px-2 gap-3 md:px-6 text-sm md:text-base rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-black font-medium hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                  Dashboard
                  <DoorOpen />
                </button>
              </Link>
              <UserButton />
            </>
          ) : (
            <>
              <Link href={"/sign-in"}>
                <button className="py-2 px-4 text-sm md:text-base rounded-full bg-zinc-800 text-orange-100 hover:bg-zinc-700 transition-all duration-300">
                  Log in
                </button>
              </Link>
              <Link href={"/sign-up"}>
                <button className="py-2 px-4 sm:px-6 text-sm md:text-base rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-black font-medium hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                  Sign up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
