import { NextRequest, NextResponse } from "next/server";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../convex/_generated/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { developerUserId } = body;

    // 🛑 Validate input
    if (!developerUserId || typeof developerUserId !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid developerUserId provided" },
        { status: 400 }
      );
    }

    // 🗑 Call Convex mutation directly
    await fetchMutation(api.member.deleteUserNotifications, { developerUserId });

    return NextResponse.json(
      { success: true, message: "Notifications deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("🚨 Error deleting notifications:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
