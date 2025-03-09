"use client"
// import HeroSection from "../components/HeroSection";
// import Navbar from "../components/Navbar";
import NotificationFeed from "./NotificationFeed";

const page = () => {
  return (
    <div className="h-screen md:overflow-hidden">
      {/* <Navbar />
      <HeroSection /> */}
      <NotificationFeed userId="12" />
    </div>
  );
};

export default page