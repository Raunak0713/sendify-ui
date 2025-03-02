import { query } from "./_generated/server";
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
