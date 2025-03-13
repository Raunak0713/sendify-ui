import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";
import { DoorOpen, BookOpen } from "lucide-react";

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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 md:px-10",
        isScrolled
          ? "border-b border-zinc-700/50 backdrop-blur-md bg-zinc-900/50"
          : "border-b border-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-400">
            Sendify
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="https://docs.sendify.100xbuild.com" target="_blank">
            <button className="py-2 flex items-center px-4 sm:px-6 text-sm md:text-base rounded-full bg-zinc-800 text-orange-100 hover:bg-zinc-700 transition-all duration-300">
              Docs
              <BookOpen className="ml-2 h-5 w-5" />
            </button>
          </Link>

          {user ? (
            <>
              <Link href={"/dashboard/projects"}>
                <button className="py-2 flex items-center px-4 gap-3 sm:px-6 text-sm md:text-base rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-black font-medium hover:shadow-lg hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
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
