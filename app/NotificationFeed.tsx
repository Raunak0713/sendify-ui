// "use client"

// import { useEffect, useState } from "react"
// import { BellIcon, XIcon } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { io } from "socket.io-client"

// // Define the notification type
// type NotificationPayload = {
//   notificationId: string
//   content: string
//   buttonText?: string
//   buttonUrl?: string
//   timestamp?: string
// }

// interface NotificationFeedProps {
//   userId: string
//   align?: "start" | "center" | "end"
// }

// function NotificationFeed({ userId, align = "center" }: NotificationFeedProps) {
//   const [isCardOpen, setIsCardOpen] = useState(false)
//   const [notifications, setNotifications] = useState<NotificationPayload[]>([])
//   const [validUserId, setValidUserId] = useState<string | null>(null)

//   // Toggle Notification Feed
//   const toggleCard = () => {
//     setIsCardOpen(!isCardOpen)
//   }

//   // Track userId and update when available
//   useEffect(() => {
//     if (userId) {
//       setValidUserId(userId)
//     }
//   }, [userId])

//   // Fetch notifications when component mounts
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         console.log("📥 Fetching notifications for user ID:", userId)
//         const response = await fetch("https://sendify.100xbuild.com/api/v1/get-notifications", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ developerUserId: userId }),
//         })

//         const data = await response.json()
//         console.log("📋 Notifications response:", data)

//         if (data.success && Array.isArray(data.notifications)) {
//           setNotifications(
//             data.notifications.map((notif: any) => ({
//               notificationId: notif._id,
//               content: notif.content,
//               buttonText: notif.buttonText,
//               buttonUrl: notif.buttonUrl,
//               timestamp: new Date(notif._creationTime).toISOString(),
//             })),
//           )
//         }
//       } catch (error) {
//         console.error("❌ Failed to fetch notifications:", error)
//       }
//     }

//     fetchNotifications()
//   }, [userId])

//   // WebSocket connection for real-time notifications
//   useEffect(() => {
//     if (!validUserId) return

//     console.warn("⚡ Setting up WebSocket connection for user:", validUserId)
//     const socket = io("https://sendify-socket.onrender.com")

//     socket.emit("register", validUserId)
//     console.log("📡 Socket.IO: Emitted register event with userId:", validUserId)

//     socket.on("new-notification", (data: NotificationPayload) => {
//       console.log("🚀 Received new notification:", data)

//       if (!data.notificationId) {
//         console.error("❌ Missing notificationId in received data:", data)
//         return
//       }

//       const newNotification = {
//         ...data,
//         timestamp: data.timestamp || new Date().toISOString(),
//       }

//       setNotifications((prev) => [newNotification, ...prev])
//       console.log("✅ Updated state with new notification!")
//     })

//     return () => {
//       console.log("🛑 Cleaning up WebSocket connection...")
//       socket.disconnect()
//     }
//   }, [validUserId])

//   // Delete notification
//   const handleDeleteNotification = async (notificationId: string) => {
//     console.log("🗑️ Deleting notification:", notificationId)

//     // First update the UI for immediate feedback
//     setNotifications((prev) => prev.filter((n) => n.notificationId !== notificationId))

//     // Then make the API call
//     try {
//       const response = await fetch("https://sendify.100xbuild.com/api/v1/delete-notifications", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ notificationId, developerUserId: userId }),
//       })

//       if (!response.ok) {
//         console.error("❌ Error deleting notification:", response.status)
//         return
//       }

//       console.log("✅ Notification deleted successfully!")
//     } catch (error) {
//       console.error("❌ Failed to delete notification:", error)
//     }
//   }

//   // Function to determine the left position based on alignment
//   const getLeftPosition = () => {
//     switch (align) {
//       case "start":
//         return "0px"
//       case "end":
//         return "-370px" // 420px (width) - 50px (bell icon width)
//       case "center":
//       default:
//         return "-185px" // Half of 420px (width) - 25px (half of bell icon width)
//     }
//   }

//   return (
//     <div style={{ position: "relative", display: "inline-block" }}>
//       {/* Bell Icon with Notification Badge */}
//       <motion.div
//         style={{
//           position: "relative",
//           fontSize: "2rem",
//           cursor: "pointer",
//           color: "#EAB308",
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           width: "50px",
//           height: "50px",
//           borderRadius: "50%",
//           background: "linear-gradient(145deg, rgba(234, 179, 8, 0.15), rgba(234, 179, 8, 0.25))",
//           boxShadow: "0 4px 15px rgba(234, 179, 8, 0.2)",
//           border: "1px solid rgba(234, 179, 8, 0.3)",
//         }}
//         whileHover={{
//           scale: 1.1,
//           boxShadow: "0 6px 20px rgba(234, 179, 8, 0.3)",
//           background: "linear-gradient(145deg, rgba(234, 179, 8, 0.2), rgba(234, 179, 8, 0.3))",
//         }}
//         whileTap={{
//           scale: 0.95,
//           boxShadow: "0 2px 10px rgba(234, 179, 8, 0.15)",
//         }}
//         transition={{
//           type: "spring",
//           stiffness: 400,
//           damping: 17,
//         }}
//         onClick={toggleCard}
//       >
//         <BellIcon />

//         {/* Notification Badge */}
//         {notifications.length > 0 && (
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{
//               type: "spring",
//               stiffness: 500,
//               damping: 15,
//               delay: 0.1,
//             }}
//             style={{
//               position: "absolute",
//               top: "-5px",
//               right: "-5px",
//               width: "20px",
//               height: "20px",
//               background: "linear-gradient(135deg, #EAB308, #F59E0B)",
//               borderRadius: "50%",
//               display: "flex",
//               justifyContent: "center",
//               alignItems: "center",
//               fontSize: "12px",
//               fontWeight: "bold",
//               color: "#18181B",
//               border: "2px solid #18181B",
//               boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
//             }}
//           >
//             {notifications.length}
//           </motion.div>
//         )}
//       </motion.div>

//       {/* Notification Feed Card */}
//       {isCardOpen && (
//         <motion.div
//           initial={{ opacity: 0, y: -20, scale: 0.95 }}
//           animate={{ opacity: 1, y: 0, scale: 1 }}
//           exit={{ opacity: 0, y: -20, scale: 0.95 }}
//           transition={{
//             duration: 0.4,
//             type: "spring",
//             stiffness: 300,
//             damping: 25,
//           }}
//           style={{
//             position: "absolute",
//             top: "60px",
//             left: getLeftPosition(),
//             width: "420px",
//             height: "420px",
//             background: "linear-gradient(135deg, #1A1A1F, #2A2A35)",
//             borderRadius: "20px",
//             boxShadow:
//               "0 15px 40px rgba(0, 0, 0, 0.4), 0 5px 15px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
//             padding: "20px",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//             border: "1px solid rgba(255, 255, 255, 0.08)",
//             backdropFilter: "blur(10px)",
//           }}
//         >
//           <h2
//             style={{
//               color: "#FFF",
//               fontSize: "24px",
//               fontWeight: "bold",
//               marginBottom: "20px",
//               background: "linear-gradient(90deg, #FFF, #AAA)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               textAlign: "center",
//               textShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
//             }}
//           >
//             Notifications
//           </h2>
//           {notifications.length === 0 ? (
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 flex: 1,
//                 textAlign: "center",
//                 color: "#FFF",
//                 fontSize: "16px",
//               }}
//             >
//               <motion.div
//                 style={{
//                   width: "70px",
//                   height: "70px",
//                   borderRadius: "50%",
//                   background: "linear-gradient(145deg, rgba(234, 179, 8, 0.15), rgba(234, 179, 8, 0.25))",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   marginBottom: "15px",
//                   boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
//                   border: "1px solid rgba(234, 179, 8, 0.3)",
//                 }}
//                 animate={{
//                   y: [0, -5, 0],
//                   boxShadow: [
//                     "0 8px 20px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
//                     "0 15px 30px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
//                     "0 8px 20px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
//                   ],
//                 }}
//                 transition={{
//                   repeat: Number.POSITIVE_INFINITY,
//                   duration: 3,
//                   ease: "easeInOut",
//                 }}
//               >
//                 <BellIcon color="#EAB308" size={35} />
//               </motion.div>
//               <p
//                 style={{
//                   fontWeight: "500",
//                   marginBottom: "8px",
//                   background: "linear-gradient(90deg, #FFF, #AAA)",
//                   WebkitBackgroundClip: "text",
//                   WebkitTextFillColor: "transparent",
//                 }}
//               >
//                 No notifications yet
//               </p>
//               <p
//                 style={{
//                   color: "rgba(255, 255, 255, 0.6)",
//                   fontSize: "14px",
//                 }}
//               >
//                 We&apos;ll notify you when something magical happens
//               </p>
//             </div>
//           ) : (
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 gap: "12px",
//                 flex: 1,
//                 overflowY: "auto",
//                 paddingBottom: "50px",
//                 scrollbarWidth: "none",
//                 marginBottom: "31px",
//                 msOverflowStyle: "none",
//                 padding: "5px",
//               }}
//             >
//               <AnimatePresence mode="sync">
//                 {notifications.map((notification, index) => (
//                   <motion.div
//                     key={notification.notificationId}
//                     layout
//                     layoutId={notification.notificationId}
//                     initial={{ opacity: 0, y: 15, scale: 0.97 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     exit={{
//                       x: -100,
//                       opacity: 0,
//                       transition: {
//                         duration: 0.3,
//                         ease: "easeInOut",
//                       },
//                     }}
//                     transition={{
//                       layout: {
//                         type: "spring",
//                         stiffness: 300,
//                         damping: 25,
//                         delay: 0.2, // Delay the layout transition
//                       },
//                       duration: 0.4,
//                       delay: index * 0.1,
//                       type: "spring",
//                       stiffness: 300,
//                       damping: 25,
//                     }}
//                     whileHover={{
//                       scale: 1.02,
//                       boxShadow: "0 8px 25px rgba(0, 0, 0, 0.3)",
//                     }}
//                     style={{
//                       background: `linear-gradient(145deg, rgba(42, 42, 53, 0.8), rgba(50, 50, 64, 0.9))`,
//                       backdropFilter: "blur(8px)",
//                       borderRadius: "14px",
//                       padding: "16px",
//                       boxShadow: "0 4px 20px rgba(0, 0, 0, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.07)",
//                       display: "flex",
//                       flexDirection: "column",
//                       gap: "10px",
//                       border: `1px solid rgba(234, 179, 8, 0.15)`,
//                       position: "relative",
//                       overflow: "hidden",
//                     }}
//                   >
//                     {/* Decorative accent */}
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: 0,
//                         left: 0,
//                         width: "4px",
//                         height: "100%",
//                         background: "linear-gradient(to bottom, #EAB308, rgba(234, 179, 8, 0.4))",
//                         borderTopLeftRadius: "14px",
//                         borderBottomLeftRadius: "14px",
//                       }}
//                     />
                    
//                     <div style={{ 
//                       display: "flex", 
//                       justifyContent: "space-between", 
//                       alignItems: "flex-start",
//                       paddingLeft: "8px" 
//                     }}>
//                       <p
//                         style={{
//                           color: "rgba(255, 255, 255, 0.95)",
//                           fontSize: "14px",
//                           flex: 1,
//                           lineHeight: "1.5",
//                           fontWeight: "400",
//                           textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
//                           margin: "0",
//                           letterSpacing: "0.2px",
//                         }}
//                       >
//                         {notification.content}
//                       </p>
//                       <motion.button
//                         style={{
//                           background: "rgba(248, 113, 113, 0.1)",
//                           border: "none",
//                           cursor: "pointer",
//                           fontSize: "16px",
//                           color: "#F87171",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           width: "30px",
//                           height: "30px",
//                           borderRadius: "50%",
//                           marginLeft: "8px",
//                           flexShrink: 0,
//                         }}
//                         whileHover={{
//                           background: "rgba(248, 113, 113, 0.2)",
//                           scale: 1.1,
//                         }}
//                         whileTap={{ scale: 0.9 }}
//                         transition={{ duration: 0.2 }}
//                         onClick={() => handleDeleteNotification(notification.notificationId)}
//                       >
//                         <XIcon size={16} />
//                       </motion.button>
//                     </div>
//                     {notification.buttonText && notification.buttonUrl && (
//                       <motion.a
//                         href={notification.buttonUrl}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         style={{
//                           display: "inline-block",
//                           padding: "8px 16px",
//                           background: "linear-gradient(135deg, #EAB308, #F59E0B)",
//                           color: "#000",
//                           borderRadius: "8px",
//                           textDecoration: "none",
//                           fontSize: "13px",
//                           fontWeight: "600",
//                           textAlign: "center",
//                           width: "fit-content",
//                           boxShadow: "0 3px 10px rgba(234, 179, 8, 0.3)",
//                           border: "1px solid rgba(234, 179, 8, 0.6)",
//                           marginLeft: "8px",
//                         }}
//                         whileHover={{
//                           scale: 1.03,
//                           boxShadow: "0 6px 15px rgba(234, 179, 8, 0.4)",
//                         }}
//                         whileTap={{ scale: 0.97 }}
//                         transition={{ duration: 0.2 }}
//                       >
//                         {notification.buttonText}
//                       </motion.a>
//                     )}
                    
//                     {/* Subtle timestamp */}
//                     {notification.timestamp && (
//                       <div
//                         style={{
//                           fontSize: "11px",
//                           color: "rgba(255, 255, 255, 0.4)",
//                           textAlign: "right",
//                           marginTop: "2px",
//                           fontStyle: "italic",
//                           paddingRight: "2px",
//                         }}
//                       >
//                         {new Date(notification.timestamp).toLocaleString().split(",")[0]}
//                       </div>
//                     )}
//                   </motion.div>
//                 ))}
//               </AnimatePresence>
//             </div>
//           )}
//           <div
//             style={{
//               textAlign: "center",
//               color: "rgba(255, 255, 255, 0.7)",
//               fontSize: "14px",
//               padding: "10px 0",
//               fontWeight: "bold",
//               borderTop: "1px solid rgba(255, 255, 255, 0.08)",
//               position: "absolute",
//               bottom: "10px",
//               width: "calc(100% - 40px)",
//               left: "20px",
//             }}
//           >
//             Powered with{" "}
//             <span
//               style={{
//                 background: "linear-gradient(90deg, #EAB308, #F59E0B)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 textDecoration: "underline",
//                 textUnderlineOffset: "2px",
//                 textDecorationColor: "rgba(234, 179, 8, 0.4)",
//                 cursor: "pointer",
//               }}
//             >
//               Sendify
//             </span>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   )
// }

// export { NotificationFeed }
// export default NotificationFeed