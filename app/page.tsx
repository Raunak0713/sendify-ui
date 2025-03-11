"use client"

import { sendify } from "../lib/sendify";
import { NotificationFeed } from "./NotificationFeed";


// import HeroSection from "../components/HeroSection";
// import Navbar from "../components/Navbar";

const page = () => {
  const send = async () => {
    await sendify.sendNotification(["bao"],"mv","vd","hg")
  }
  return (
    <div className="">
      {/* <Navbar />
      <HeroSection /> */}
      <NotificationFeed userId="bao"/>
      <button onClick={send}>Send Notification</button>
    </div>
  );
};

export default page