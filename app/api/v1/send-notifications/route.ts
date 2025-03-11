import { api } from "../../../../convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userIds, content, buttonText, buttonUrl, projectId } = await req.json();

    const notificationId = await fetchMutation(api.notification.createNotifications, {
      members: userIds,
      content,
      buttonText,
      buttonUrl,
      projectId
    });


    const response = await fetch("https://sendify-socket.onrender.com/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ notificationId, userIds, content, buttonText, buttonUrl }),
    });

    if (!response.ok) {
      throw new Error("Failed to send notification");
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error in POST /api/send-notification:", error);

    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
