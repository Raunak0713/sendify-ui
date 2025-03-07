"use client"

import React from 'react';
import { Button } from '../components/ui/button'; 
import { UserButton, useUser } from '@clerk/nextjs';
import { CircleArrowRight } from 'lucide-react';
import Link from 'next/link';

const Navbar = () => {
  const { user } = useUser()
  return (
    <div className="">
      <div className="flex justify-between p-5 items-center">
        <Link href={"/"} className="text-white py-1 flex gap-3 items-center">
          <div className="py-1 px-2 md:py-2 md:px-4 bg-white rounded-sm relative">
            <div className="text-zinc-900 font-bold text-sm md:text-lg">S</div>
          </div>
          <div className="font-bold text-xl">Sendify</div>
        </Link>

        {user ? (
          <div className='flex items-center gap-3'>
            <Link href={"/dashboard"}>
              <Button>
                Dashboard
                <CircleArrowRight />
              </Button>
            </Link>
            <UserButton appearance={{ elements: { userButtonAvatarBox: { width: '2rem', height: '2rem',},},}}/>
          </div>
        ) : (
          <div>
            <Link href={"/sign-up"}>
              <Button variant={"outline"} className="mr-2">Sign Up</Button>
            </Link>
            <Link href={"/sign-up"}>
              <Button>Sign In</Button>
            </Link>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Navbar;