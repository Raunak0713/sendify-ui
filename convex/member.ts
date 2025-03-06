import { internalMutation, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const getNotifications = query({
  args: {
    developerUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const member = await ctx.db
      .query("members")
      .filter((q) => q.eq(q.field("developerUserId"), args.developerUserId))
      .first();

    if (!member) return [];

    const notificationLinks = await ctx.db
      .query("notificationMembers")
      .filter((q) => q.eq(q.field("memberId"), member._id))
      .collect();

    const notificationIds = notificationLinks.map((link) => link.notificationId);

    if (notificationIds.length === 0) return []; 

    const notifications = [];
    for (const notificationId of notificationIds) {
      const notification = await ctx.db.get(notificationId as Id<"notifications">);
      if (notification) notifications.push(notification);
    }

    return notifications;
  },
});


export const deleteUserNotifications = mutation({
  args: {
    developerUserId: v.string(),
  },
  handler: async (ctx, args) => {
    // Step 1: Find the user in the `members` table
    const member = await ctx.db
      .query("members")
      .withIndex("byDeveloperUserId", (q) => q.eq("developerUserId", args.developerUserId))
      .first();

    if (!member) {
      console.log(`❌ No member found for developerUserId: ${args.developerUserId}`);
      return;
    }

    // Step 2: Find notifications linked to this member in `notificationMembers`
    const notifications = await ctx.db
      .query("notificationMembers")
      .withIndex("by_member", (q) => q.eq("memberId", member._id))
      .collect();

    if (notifications.length === 0) {
      console.log(`✅ No notifications found for user: ${args.developerUserId}`);
      return;
    }

    // Step 3: Delete all found notifications from `notificationMembers`
    await Promise.all(
      notifications.map((notification) =>
        ctx.db.delete(notification._id)
      )
    );

    console.log(`🗑️ Deleted ${notifications.length} notifications for user: ${args.developerUserId}`);
  },
});

export const deleteInactiveUsers = internalMutation({
  handler: async (ctx) => {
    const oneMinuteAgo = new Date(Date.now() - 60000); 

    const members = await ctx.db.query("members").collect();

    for (const member of members) {
      const recentNotification = await ctx.db
        .query("notificationMembers")
        .withIndex("by_member", (q) => q.eq("memberId", member._id))
        .order("desc")
        .first();

      if (!recentNotification || recentNotification._creationTime < oneMinuteAgo.getTime()) {
        const notificationMembersToDelete = await ctx.db
          .query("notificationMembers")
          .withIndex("by_member", (q) => q.eq("memberId", member._id))
          .collect();

        for (const notificationMember of notificationMembersToDelete) {
          await ctx.db.delete(notificationMember._id);
        }

        // Delete the member
        await ctx.db.delete(member._id);
      }
    }
  },
});

export const deleteMember = mutation({
  args : {
    id : v.id("members")
  },
  handler : async (ctx, args) => {
    await ctx.db.delete(args.id)
  }
})