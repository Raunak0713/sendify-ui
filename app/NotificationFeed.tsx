"use client"

import { useEffect, useState } from "react"
import { BellIcon, XIcon } from "lucide-react"
import { motion } from "framer-motion"
import { io } from "socket.io-client"

// Define the notification type
type NotificationPayload = {
  notificationId: string
  content: string
  buttonText?: string
  buttonUrl?: string
  timestamp?: string
}

interface NotificationFeedProps {
  userId: string
}

function NotificationFeed({ userId = "mnb" }: NotificationFeedProps) {
  const [isCardOpen, setIsCardOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationPayload[]>([])

  const toggleCard = () => {
    setIsCardOpen(!isCardOpen)
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching notifications for user ID:", userId)
        const response = await fetch("https://sendify.100xbuild.com/api/v1/get-notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ developerUserId: userId }),
        })
        const data = await response.json()
        console.log("Notifications response:", data)
        if (data.success && Array.isArray(data.notifications)) {
          // Ensure each notification has a notificationId
          const validNotifications = data.notifications.filter((notification: any) => notification.notificationId)
          setNotifications(validNotifications)
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    fetchNotifications()
  }, [userId])

  useEffect(() => {
    const socket = io("https://sendify-socket.onrender.com")

    socket.emit("register", userId)

    socket.on("new-notification", (data: NotificationPayload) => {
      console.log("Received Data:", data)
      // Ensure the notification has a valid notificationId before adding it
      if (!data.notificationId) {
        console.error("Received notification without notificationId:", data)
        return
      }

      const enhancedData = {
        ...data,
        timestamp: data.timestamp || new Date().toISOString(),
        notificationId: data.notificationId, // Ensure notificationId is explicitly set
      }
      setNotifications((prev) => [enhancedData, ...prev])
    })

    return () => {
      socket.disconnect()
    }
  }, [userId])

  const handleDeleteNotification = async (notificationId: string) => {
    if (!notificationId) {
      console.error("Cannot delete notification: Missing notificationId")
      return
    }

    console.log("Deleting notification with ID:", notificationId)
    try {
      console.log("Preparing to send delete request")
      const response = await fetch("https://sendify.100xbuild.com/api/v1/delete-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notificationId,
          developerUserId: userId,
        }),
      })

      console.log("Delete request sent, response status:", response.status)

      if (!response.ok) {
        console.error("Error deleting notification: Server returned", response.status)
        const errorText = await response.text()
        console.error("Error response body:", errorText)
      } else {
        const responseData = await response.json()
        console.log("Delete successful, response data:", responseData)
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
    } finally {
      removeNotification(notificationId)
    }
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.notificationId !== id))
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Bell Icon with Notification Badge */}
      <motion.div
        style={{
          position: "relative",
          fontSize: "2rem",
          cursor: "pointer",
          color: "#EAB308",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "rgba(234, 179, 8, 0.2)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleCard}
      >
        <BellIcon />

        {/* Notification Badge */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: "-5px",
              right: "-5px",
              width: "18px",
              height: "18px",
              background: "#EAB308",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#18181B",
              border: "2px solid #18181B",
            }}
          >
            {notifications.length}
          </motion.div>
        )}
      </motion.div>

      {/* Notification Feed Card */}
      {isCardOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute",
            top: "60px",
            left: "0",
            width: "420px",
            height: "420px",
            background: "linear-gradient(135deg, #18181B, #27272A)",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ color: "#FFF", fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Notifications</h2>
          {notifications.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                textAlign: "center",
                color: "#FFF",
                fontSize: "16px",
              }}
            >
              <motion.div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(234, 179, 8, 0.2)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <BellIcon color="#EAB308" size={30} />
              </motion.div>
              <p>No notifications yet</p>
              <p>We&apos;ll notify you when something magical happens</p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                flex: 1,
                overflowY: "auto",
                paddingBottom: "50px",
                scrollbarWidth: "none",
                marginBottom: "31px",
                msOverflowStyle: "none",
              }}
            >
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification.notificationId || index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    background: "#323232",
                    borderRadius: "12px",
                    padding: "16px",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ color: "#FFF", fontSize: "14px", flex: 1 }}>{notification.content}</p>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        color: "#F87171",
                      }}
                      onClick={() => handleDeleteNotification(notification.notificationId)}
                    >
                      <XIcon />
                    </button>
                  </div>
                  {notification.buttonText && notification.buttonUrl && (
                    <a
                      href={notification.buttonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        padding: "10px 18px",
                        background: "#EAB308",
                        color: "#000",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontSize: "15px",
                        fontWeight: "600",
                        textAlign: "center",
                        transition: "background 0.2s",
                        width: "fit-content",
                      }}
                    >
                      {notification.buttonText}
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
          <div
            style={{
              textAlign: "center",
              color: "#FFF",
              fontSize: "14px",
              padding: "10px 0",
              fontWeight: "bold",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              position: "absolute",
              bottom: "10px",
              width: "100%",
              left: 0,
            }}
          >
            Powered with ❤️ by <span style={{ textDecoration: "underline", color: "#EAB308" }}>Sendify</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export { NotificationFeed }

export default NotificationFeed

