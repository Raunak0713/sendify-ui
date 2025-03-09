import { NextRequest, NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const { notificationId, developerUserId } = body;

    await fetchMutation(api.notification.deleteNotificationForMember, { notificationId, developerUserId });

    return NextResponse.json(
      { success: true, message: "Notification deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚨 Error deleting notification:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
