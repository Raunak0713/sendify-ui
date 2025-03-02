"use client";

import { NotificationFeed, Sendify } from "sendify";

export default function Home() {
  const handleSend = () => {
    const sendify = new Sendify("12")
    sendify.sendNotification(["meow"],"meow content", "meow text", "meow url")
  }

  return (
    <div className="flex justify-end mr-10 p-8">
      <NotificationFeed userId="meow"/>
      <button onClick={handleSend} className="bg-green-600 p-3 text-white rounded-full">Send API</button>
    </div>
  );
}
