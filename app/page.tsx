"use client"


import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";

const page = () => {
  return (
    <div className="h-screen md:overflow-hidden">
      <Navbar />
      <HeroSection />
    </div>
  );
};

export default page