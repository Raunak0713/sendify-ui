import React from 'react';
import { Button } from '@/components/ui/button'; 

const Navbar = () => {
  return (
    <div className="">
      <div className="flex justify-between p-5 items-center">
        <div className="text-white py-1 flex gap-3 items-center">
          <div className="py-2 px-4 bg-white rounded-sm relative">
            <div className="text-zinc-900 font-bold text-lg">S</div>
          </div>
          <div className="font-bold text-xl">Sendify</div>
        </div>

        <div>
          <Button variant={"outline"} className="mr-2">Sign Up</Button>
          <Button>Sign In</Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
