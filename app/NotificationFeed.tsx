
import type React from "react"
import { useEffect, useState, useRef } from "react"
import { io } from "socket.io-client"
import { Bell, X, Clock, ExternalLink } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "./Popover"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

type NotificationPayload = {
  content?: string
  buttonText?: string
  buttonUrl?: string
  timestamp?: string
}

type NotificationFeedProps = {
  userId: string
  align?: "start" | "center" | "end"
  light?: boolean
  dark?: boolean
}

export function NotificationFeed({ userId, align = "end", light, dark }: NotificationFeedProps) {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [bellHovered, setBellHovered] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLDivElement>(null)

  const isDarkMode = dark ?? !light;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("https://sendify.100xbuild.com/api/v1/get-notifications", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ developerUserId: userId }),
        })
        const data = await response.json()
        if (data.success && Array.isArray(data.notifications)) {
          setNotifications(data.notifications)
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
      const enhancedData = { ...data, timestamp: data.timestamp || new Date().toISOString() }
      setNotifications((prev) => [enhancedData, ...prev])
    })

    return () => {
      socket.disconnect()
    }
  }, [userId])


  const handleDeleteNotification = async (userId: string, notificationId: string) => {

    try {
      const response = await fetch("https://sendify.100xbuild.com/api/v1/delete-notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          developerUserId: userId, 
          notificationId: notificationId 
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success("Notification deleted")
      } else {
        toast.error("Failed to delete notification")
        console.error("Failed to delete notification:", data.message || "Unknown error")
      }
    } catch (error) {
      toast.error("Error deleting notification")
      console.error("Error deleting notification:", error)
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffMinutes < 1) return "Just now"
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement
        if (!target.closest('a[href="https://sendify.dev"]')) {
          setIsOpen(false)
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleBannerClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const styles = {
    container: {
      position: "relative" as const,
    },
    bellContainer: {
      position: "relative" as const,
      cursor: "pointer",
      padding: "12px",
      borderRadius: "50%",
      transition: "all 500ms",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      backdropFilter: "blur(8px)",
      border: "1px solid",
      display: "flex", // Added to ensure centering
      alignItems: "center", // Added to ensure centering
      justifyContent: "center", // Added to ensure centering
      width: "44px", // Fixed width to ensure perfect circle
      height: "44px", // Fixed height to match width for perfect circle
      ...(isDarkMode
        ? {
            background: "linear-gradient(to bottom right, #1f2937, #111827, #1f2937)",
            borderColor: "#374151",
          }
        : {
            background:
              "linear-gradient(to bottom right, rgba(219, 234, 254, 0.8), rgba(238, 242, 255, 1), rgba(221, 214, 254, 0.8))",
            borderColor: "#93c5fd",
          }),
    },
    bellContainerHover: {
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      ...(isDarkMode
        ? {
            background: "linear-gradient(to bottom right, #374151, #1f2937, #374151)",
          }
        : {
            background:
              "linear-gradient(to bottom right, rgba(191, 219, 254, 0.9), rgba(224, 231, 255, 1), rgba(196, 181, 253, 0.9))",
          }),
    },
    bellIcon: {
      width: "20px",
      height: "20px",
      color: isDarkMode ? "#818cf8" : "#4f46e5",
      filter: "drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))",
    },
    bellGlow: {
      position: "absolute" as const,
      inset: 0,
      borderRadius: "50%",
      filter: "blur(16px)",
      zIndex: -10,
      background: isDarkMode ? "rgba(79, 70, 229, 0.2)" : "rgba(99, 102, 241, 0.2)",
    },
    notificationBadge: {
      position: "absolute" as const,
      top: "-4px",
      right: "-4px",
      background: isDarkMode
        ? "linear-gradient(to bottom right, #6366f1, #a855f7, #3b82f6)"
        : "linear-gradient(to bottom right, #2563eb, #4f46e5, #7c3aed)",
      color: "white",
      fontSize: "10px",
      width: "18px", // Fixed width
      height: "18px", // Equal to width for perfect circle
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      fontWeight: 500,
      padding: 0, // Remove padding to avoid distortion
      border: isDarkMode ? "2px solid #1f2937" : "2px solid rgba(255, 255, 255, 0.8)",
      lineHeight: 1, // Ensures text is centered vertically
    },
    popoverContent: {
      marginTop: "12px",
      width: "420px",
      height: "420px",
      borderRadius: "12px",
      overflow: "hidden",
      padding: 0,
      border: "none",
      backdropFilter: "blur(8px)",
      boxShadow: isDarkMode
        ? "0 10px 25px -5px rgba(30, 41, 59, 0.5), 0 8px 10px -6px rgba(15, 23, 42, 0.4)"
        : "0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 8px 10px -6px rgba(99, 102, 241, 0.2)",
      ...(isDarkMode
        ? {
            background:
              "linear-gradient(to bottom right, rgba(17, 24, 39, 0.95), rgba(17, 24, 39, 1), rgba(31, 41, 55, 0.95))",
          }
        : {
            background:
              "linear-gradient(to bottom right, rgba(239, 246, 255, 0.9), rgba(255, 255, 255, 1), rgba(238, 242, 255, 0.9))",
          }),
    },
    contentWrapper: {
      display: "flex",
      flexDirection: "column" as const,
      height: "100%",
    },
    contentArea: {
      position: "relative" as const,
      flex: 1,
      overflow: "hidden",
    },
    contentGradient: {
      position: "absolute" as const,
      inset: 0,
      zIndex: -10,
      background: isDarkMode
        ? "linear-gradient(to bottom, rgba(31, 41, 55, 0.2), transparent, rgba(17, 24, 39, 0.2))"
        : "linear-gradient(to bottom, rgba(219, 234, 254, 0.2), transparent, rgba(224, 231, 255, 0.2))",
    },
    scrollArea: {
      maxHeight: "calc(100% - 40px)",
      overflowY: "auto" as const,
      padding: "12px",
    },
    emptyStateContainer: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      height: "340px",
      textAlign: "center" as const,
      padding: "24px",
    },
    emptyStateIcon: {
      width: "80px",
      height: "80px",
      marginBottom: "16px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      background: isDarkMode
        ? "linear-gradient(to bottom right, #1f2937, #111827, #1f2937)"
        : "linear-gradient(to bottom right, #dbeafe, #ffffff, #eef2ff)",
    },
    emptyStateBellIcon: {
      width: "40px",
      height: "40px",
      color: isDarkMode ? "#818cf8" : "#6366f1",
    },
    emptyStatePulse: {
      position: "absolute" as const,
      inset: 0,
      borderRadius: "50%",
      border: "4px solid",
      borderColor: isDarkMode ? "rgba(67, 56, 202, 0.5)" : "rgba(224, 231, 255, 0.5)",
    },
    emptyStateTitle: {
      color: isDarkMode ? "#f3f4f6" : "#312e81",
      fontWeight: 500,
      fontSize: "18px",
    },
    emptyStateText: {
      color: isDarkMode ? "#9ca3af" : "rgba(79, 70, 229, 0.7)",
      fontSize: "14px",
      marginTop: "4px",
    },
    notificationItem: ({
      borderRadius: "12px",
      padding: "16px",
      transition: "all 300ms",
      border: "1px solid",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
      backdropFilter: "blur(4px)",
      ...(isDarkMode
        ? {
            background: "linear-gradient(to bottom right, #1f2937, rgba(17, 24, 39, 0.6), #1f2937)",
            borderColor: "#374151",
          }
        : {
            background: "linear-gradient(to bottom right, #ffffff, rgba(239, 246, 255, 0.2), #ffffff)",
            borderColor: "#bfdbfe",
          }),
    }),
    notificationItemHover: isDarkMode
      ? {
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          background: "linear-gradient(to bottom right, #1f2937, #111827, #1f2937)",
          borderColor: "#4b5563",
        }
      : {
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          background: "linear-gradient(to bottom right, #eff6ff, rgba(224, 231, 255, 0.3), #eff6ff)",
          borderColor: "#93c5fd",
        },
    notificationItemFlex: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
    },
    notificationIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "24px",
      height: "24px",
      borderRadius: "50%",
      boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      padding: "4px",
      marginTop: "2px",
      ...(isDarkMode
        ? {
            background: "#374151",
            color: "#818cf8",
          }
        : {
            background: "#dbeafe",
            color: "#2563eb",
          }),
    },
    smallBellIcon: {
      width: "14px",
      height: "14px",
    },
    notificationContent: {
      flex: 1,
    },
    contentHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    notificationText: {
      color: isDarkMode ? "#e5e7eb" : "#1e3a8a",
      fontSize: "14px",
      lineHeight: "1.5",
      paddingRight: "8px",
    },
    closeButton: {
      color: isDarkMode ? "#d1d5db" : "#6b7280",
      transition: "colors 150ms",
      padding: "4px",
      borderRadius: "50%",
      flexShrink: 0,
      marginTop: "-4px",
      marginRight: "-4px",
      outline: "none",
      display: "flex", // Added for proper centering
      alignItems: "center", // Added for proper centering
      justifyContent: "center", // Added for proper centering
      width: "22px", // Fixed width for circle
      height: "22px", // Fixed height for circle
      ...(isDarkMode
        ? {
            background: "rgba(55, 65, 81, 0.5)",
          }
        : {
            background: "rgba(243, 244, 246, 0.5)",
          }),
    },
    closeButtonHover: isDarkMode
      ? {
          color: "#f9fafb",
          background: "#374151",
        }
      : {
          color: "#111827",
          background: "rgba(229, 231, 235, 0.8)",
        },
    timestamp: {
      display: "flex",
      alignItems: "center",
      marginTop: "8px",
      fontSize: "12px",
      color: isDarkMode ? "#9ca3af" : "#3b82f6",
    },
    clockIcon: {
      width: "12px",
      height: "12px",
      marginRight: "4px",
    },
    actionButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      fontSize: "12px",
      fontWeight: 500,
      padding: "6px 12px",
      borderRadius: "6px",
      transition: "all 300ms",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      marginTop: "12px",
      color: "#ffffff",
      border: "1px solid",
      ...(isDarkMode
        ? {
            background: "linear-gradient(to right, #4f46e5, #2563eb)",
            borderColor: "#4f46e5",
          }
        : {
            background: "linear-gradient(to right, #2563eb, #4f46e5)",
            borderColor: "#3b82f6",
          }),
    },
    actionButtonHover: isDarkMode
      ? {
          background: "linear-gradient(to right, #4338ca, #1d4ed8)",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        }
      : {
          background: "linear-gradient(to right, #1d4ed8, #4338ca)",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
    linkIcon: {
      width: "12px",
      height: "12px",
    },
    footer: {
      padding: "12px",
      backdropFilter: "blur(4px)",
      ...(isDarkMode
        ? {
            background:
              "linear-gradient(to right, rgba(31, 41, 55, 0.5), rgba(17, 24, 39, 0.5), rgba(31, 41, 55, 0.5))",
          }
        : {
            background:
              "linear-gradient(to right, rgba(219, 234, 254, 0.5), rgba(224, 231, 255, 0.5), rgba(219, 234, 254, 0.5))",
          }),
    },
    footerText: {
      textAlign: "center" as const,
      fontSize: "12px",
      color: isDarkMode ? "rgba(129, 140, 248, 0.7)" : "rgba(37, 99, 235, 0.7)",
    },
    footerLink: {
      fontWeight: 500,
      textDecoration: "underline",
      transition: "colors 150ms",
      ...(isDarkMode
        ? {
            color: "#a5b4fc",
            textDecorationColor: "#6366f1",
          }
        : {
            color: "#1d4ed8",
            textDecorationColor: "#1e40af",
          }),
    },
    footerLinkHover: isDarkMode
      ? {
          color: "#c7d2fe",
          textDecorationColor: "#818cf8",
        }
      : {
          color: "#1e40af",
          textDecorationColor: "#60a5fa",
        },
  }

  return (
    <div style={styles.container} ref={popoverRef}>
      <style>
        {`
          .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
          }
        `}
      </style>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            ref={bellRef}
            style={{
              ...styles.bellContainer,
              ...(bellHovered ? styles.bellContainerHover : {}),
            }}
            onClick={() => setIsOpen((prev) => !prev)}
            onMouseEnter={() => setBellHovered(true)}
            onMouseLeave={() => setBellHovered(false)}
          >
            <motion.div
              animate={{
                rotate: bellHovered ? [0, -5, 5, -5, 5, 0] : 0,
                scale: bellHovered ? 1.1 : 1,
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut",
                rotate: { repeat: 0, repeatType: "loop" },
              }}
            >
              <Bell style={styles.bellIcon} />
            </motion.div>

            {bellHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.bellGlow}
              />
            )}

            <AnimatePresence>
              {notifications.length > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  style={styles.notificationBadge}
                >
                  {notifications.length > 9 ? "9+" : notifications.length}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </PopoverTrigger>

        <PopoverContent align={align} style={styles.popoverContent}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={styles.contentWrapper}
          >
            <div style={styles.contentArea}>
              <div style={styles.contentGradient}></div>

              {notifications.length > 0 && <div style={{ height: "8px" }}></div>}

              <div className="hide-scrollbar" style={styles.scrollArea}>
                <AnimatePresence>
                  {notifications.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      style={styles.emptyStateContainer}
                    >
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [0.9, 1.05, 0.95, 1] }}
                        transition={{ duration: 1, delay: 0.5, times: [0, 0.3, 0.7, 1] }}
                        style={styles.emptyStateIcon}
                      >
                        <div style={{ position: "relative" as const }}>
                          <Bell style={styles.emptyStateBellIcon} />
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0.8] }}
                            transition={{
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "reverse",
                              duration: 3,
                              ease: "easeInOut",
                              times: [0, 0.4, 1],
                            }}
                            style={styles.emptyStatePulse}
                          />
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <p style={styles.emptyStateTitle}>No notifications yet</p>
                        <p style={styles.emptyStateText}>We&apos;ll notify you when something magical happens</p>
                      </motion.div>
                    </motion.div>
                  ) : (
                    notifications.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, scale: 0.9 }}
                        transition={{
                          duration: 0.4,
                          delay: index * 0.05,
                          exit: { duration: 0.2 },
                        }}
                        style={{
                          marginBottom: index < notifications.length - 1 ? "12px" : 0,
                        }}
                        whileHover={{
                          y: -2,
                          scale: 1.01,
                          ...styles.notificationItemHover,
                        }}
                      >
                        <div style={styles.notificationItemFlex}>
                          <div style={styles.notificationIcon}>
                            <Bell style={styles.smallBellIcon} />
                          </div>
                          <div style={styles.notificationContent}>
                            <div style={styles.contentHeader}>
                              <p style={styles.notificationText}>{item.content || "No content available"}</p>
                              <motion.button
                                whileHover={{
                                  scale: 1.1,
                                  rotate: 90,
                                  ...styles.closeButtonHover,
                                }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                                style={styles.closeButton}
                              > 
                                <X onClick={() => handleDeleteNotification(userId, 
                                  //@ts-expect-error will work
                                  item._id)} 
                                  style={{ width: "14px", height: "14px" }}
                                 />
                              </motion.button>
                            </div>
                            <div style={styles.timestamp}>
                              <Clock style={styles.clockIcon} />
                              <span>{item.timestamp ? formatTime(item.timestamp) : "Just now"}</span>
                            </div>
                            {item.buttonText && item.buttonUrl && (
                              <div>
                                <motion.a
                                  href={item.buttonUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={styles.actionButton}
                                  whileHover={{
                                    scale: 1.05,
                                    ...styles.actionButtonHover,
                                  }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {item.buttonText}
                                  <ExternalLink style={styles.linkIcon} />
                                </motion.a>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={styles.footer}
              onClick={handleBannerClick}
            >
              <p style={styles.footerText}>
                Powered by{" "}
                <a
                  href="https://sendify.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.footerLink}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = styles.footerLinkHover.color
                    e.currentTarget.style.textDecorationColor = styles.footerLinkHover.textDecorationColor
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = styles.footerLink.color
                    e.currentTarget.style.textDecorationColor = styles.footerLink.textDecorationColor
                  }}
                >
                  Sendify
                </a>
              </p>
            </motion.div>
          </motion.div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default NotificationFeed