"use client"

import { useEffect, useMemo, useState } from "react"
import { io } from "socket.io-client"
import { Bell, X, Clock, ExternalLink } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "./Popover"
import { motion, AnimatePresence } from "framer-motion"

type NotificationPayload = {
  content?: string
  buttonText?: string
  buttonUrl?: string
  timestamp?: string
}

type NotificationFeedProps = {
  userId: string
  align?: "start" | "center" | "end"
}

export function NotificationFeed({ userId, align = "end" }: NotificationFeedProps) {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([])
  const [isOpen, setIsOpen] = useState(false)
  
  const socket = useMemo(() => io("https://sendify-socket.onrender.com"), []);

  useEffect(() => {
      const fetchNotifications = async () => {
        try {
          console.log("🔹 Starting fetchNotifications...");

          const requestBody = { developerUserId: userId };
          console.log("📤 Request Body:", requestBody);

          const response = await fetch("https://sendify.100xbuild.com/api/v1/get-notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
          });

          console.log("📥 Response received:", response);

          if (!response.ok) {
            console.error("❌ Fetch failed with status:", response.status, response.statusText);
            throw new Error(`Failed to fetch notifications: ${response.statusText}`);
          }

          const data = await response.json();
          console.log("📄 Response JSON:", data);

          if (!data.success || !Array.isArray(data.notifications)) {
            console.error("❌ Invalid API response format:", data);
            throw new Error("Invalid API response format");
          }

          const enrichedData = data.notifications.map((item: NotificationPayload) => ({
            ...item,
            timestamp: item.timestamp || new Date().toISOString(),
          }));

          console.log("✅ Final notifications array:", enrichedData);
          setNotifications(enrichedData);
        } catch (error) {
          console.error("🚨 Error fetching notifications:", error);
        }
      };

      fetchNotifications();
      socket.emit("register", userId);

      socket.on("new-notification", (data: NotificationPayload) => {
        console.log("Received notification:", data);
        const enhancedData = {
          ...data,
          timestamp: data.timestamp || new Date().toISOString(),
        };
        setNotifications((prev) => [enhancedData, ...prev]);
      });

      return () => {
        socket.off("new-notification");
      };
    }, [userId, socket]); // ✅ Added `socket` to dependency array

    const clearNotifications = async () => {
      try {
        const response = await fetch("https://sendify.100xbuild.com/api/v1/delete-notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ developerUserId: userId }),
        });
    
        if (!response.ok) {
          throw new Error(`Failed to delete notifications: ${response.statusText}`);
        }
    
        console.log("✅ Notifications cleared successfully");
        setNotifications([]);
      } catch (error) {
        console.error("🚨 Error clearing notifications:", error);
      }
    };  

    const formatTime = (timestamp: string) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };
          
 

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="relative cursor-pointer group">
        <div className="relative p-2 rounded-full bg-blue-50 backdrop-blur-sm border border-blue-100 shadow-lg transition-all duration-300 group-hover:bg-blue-100">
          <Bell className="w-5 h-5 text-blue-600 transition-all duration-300 group-hover:scale-110" />
          <AnimatePresence>
            {notifications.length > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg"
              >
                {notifications.length > 9 ? "9+" : notifications.length}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PopoverTrigger>
      <PopoverContent align={align} className="mt-2 w-[420px] min-h-[420px] max-h-[420px] flex flex-col bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl shadow-2xl overflow-hidden p-0">
  <div className="sticky top-0 z-10 backdrop-blur-md bg-white/90 border-b border-gray-200 p-4 flex justify-between items-center">
    <h3 className="text-gray-800 font-medium">Notifications</h3>
    {notifications.length > 0 && (
      <button onClick={clearNotifications} className="text-gray-500 hover:text-gray-800 transition-colors duration-200 flex items-center text-xs gap-1">
        <X className="w-3.5 h-3.5" />
        <span>Clear all</span>
      </button>
    )}
  </div>

  {/* Ensure notification list has fixed height */}
  <div className="overflow-y-auto max-h-[350px] p-3 space-y-3 flex-1">
    <AnimatePresence>
      {notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center h-[250px] text-center p-6"
        >
          <div className="w-16 h-16 mb-4 rounded-full bg-blue-50 flex items-center justify-center">
            <Bell className="w-8 h-8 text-blue-300" />
          </div>
          <p className="text-gray-700 font-medium">No notifications yet</p>
          <p className="text-gray-500 text-sm mt-1">We'll notify you when something arrives</p>
        </motion.div>
      ) : (
        notifications.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-blue-100 border border-blue-100 rounded-lg p-4 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="min-w-2 h-2 mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" />
              <div className="flex-1 flex justify-between">
                <div>
                  <p className="text-gray-800 text-sm">{item.content || "No content available"}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500 -ml-5">
                    <Clock className="w-3 h-3 mr-2" />
                    <span>{item.timestamp ? formatTime(item.timestamp) : "Just now"}</span>
                  </div>
                </div>

                {item.buttonText && item.buttonUrl && (
                  <div>
                    <a
                      href={item.buttonUrl}
                      className="inline-flex items-center gap-1.5 text-xs font-medium bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-400 hover:to-cyan-300 text-white px-3 py-1.5 rounded-md transition-all duration-300 shadow-md hover:shadow-blue-200"
                    >
                      {item.buttonText}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))
      )}
    </AnimatePresence>
  </div>

  {/* Persistent footer, now properly aligned */}
  <div className="sticky bottom-0 h-10 z-10 p-2.5 text-center text-gray-500 text-xs font-medium border-t border-gray-200">
    Powered with{" "}
    <a
      href="https://sendify.100xbuild.com"
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold underline text-blue-500 hover:text-blue-600 transition-colors duration-200"
    >
      Sendify
    </a>
  </div>
</PopoverContent>

    </Popover>
  )
}
