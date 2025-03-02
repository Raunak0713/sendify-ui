"use client";

import { NotificationFeed } from "sendify";

export default function Home() {
  return (
    <div className="flex justify-end mr-10 p-8">
      <NotificationFeed userId="test-user"/>
      <button className="bg-green-600 p-3 text-white rounded-full">Send API</button>
    </div>
  );
}
