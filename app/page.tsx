"use client";

import { NotificationFeed, Sendify } from "sendify";

export default function Home() {
  const sendify = new Sendify("123")
  return (
    <div className="flex justify-end mr-10 p-8">
      <NotificationFeed userId="test-user"/>
      <button className="bg-green-600 p-3 text-white rounded-full">Send API</button>
    </div>
  );
}
