import { api } from "@/convex/_generated/api";
import { fetchMutation } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { Sendify } from "sendify";

export async function POST(req: NextRequest) {
  try {
    const { userIds, content, buttonText, buttonUrl } = await req.json();
    const sendify = new Sendify("123");

    await fetchMutation(api.notification.createNotifications, {
      members: userIds,
      content,
      buttonText,
      buttonUrl,
    });

    await sendify.sendNotification(userIds, content, buttonText, buttonUrl);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/send-notification:", error);

    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
