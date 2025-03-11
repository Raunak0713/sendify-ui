import { api } from "../../../../convex/_generated/api"
import { fetchMutation } from "convex/nextjs"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { userIds, content, buttonText, buttonUrl, projectId } = await req.json()

    // Create notifications in the database and get the notificationId
    const notificationId = await fetchMutation(api.notification.createNotifications, {
      members: userIds,
      content,
      buttonText,
      buttonUrl,
      projectId,
    })

    console.log("Created notification with ID:", notificationId)

    // Make sure we have a valid notificationId before proceeding
    if (!notificationId) {
      throw new Error("Failed to create notification: No notificationId returned")
    }

    // Send the notification via the socket server
    const response = await fetch("https://sendify-socket.onrender.com/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notificationId, // Ensure this is passed correctly
        userIds,
        content,
        buttonText,
        buttonUrl,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Socket server error:", errorText)
      throw new Error(`Failed to send notification: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log("Socket server response:", data)

    return NextResponse.json({
      success: true,
      data,
      notificationId, // Include the notificationId in the response
    })
  } catch (error) {
    console.error("Error in POST /api/send-notification:", error)

    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 })
  }
}

