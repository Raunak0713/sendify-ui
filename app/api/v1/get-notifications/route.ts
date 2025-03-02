import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { developerUserId } = await req.json();

    if (!developerUserId) {
      return NextResponse.json(
        { success: false, error: "developerUserId is required" },
        { status: 400 }
      );
    }

    const notifications = await fetchQuery(api.member.getNotifications, {
      developerUserId,
    });

    // Ensure notifications is an array and not undefined/null
    const safeNotifications = Array.isArray(notifications) ? notifications : [];

    return NextResponse.json({ success: true, notifications: safeNotifications });
  } catch (error) {
    console.error("Error in POST /api/v1/get-notifications:", error);

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 }
    );
  }
}
