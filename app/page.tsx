"use client"

import Footer from "../components/footer";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";

const page = () => {
  return (
    <div className="h-screen">
      <Navbar />
      <HeroSection />
      <Footer />
    </div>
  );
};

export default page