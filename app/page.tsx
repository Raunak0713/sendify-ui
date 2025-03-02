"use client";

import { sendify } from "@/lib/sendify";
import { NotificationFeed } from "./NotificationFeed";
// import { NotificationFeed } from "sendify";

export default function Home() {
  const handleSend = () => {
    sendify.sendNotification(["meow"],"meow content live live live live live", "meow text text", "meow url")
  }

  return (
    <div className="flex justify-end mr-10 p-8">
      <NotificationFeed userId="meow"/>
      <button onClick={handleSend} className="bg-green-600 p-3 text-white rounded-full">Send API</button>
    </div>
  );
}
