import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { developerUserId } = await req.json();

    if (!developerUserId) {
      return NextResponse.json({ success: false, error: "developerUserId is required" }, { status: 400 });
    }

    const notifications = await fetchQuery(api.member.getNotifications, { developerUserId });

    return NextResponse.json({ success: true, notifications: notifications || [] }); // ✅ Always return an array
  } catch (error) {
    console.error("Error in API:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
