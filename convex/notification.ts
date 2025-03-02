import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const createNotifications = mutation({
  args: {
    members: v.array(v.string()),
    content: v.string(),
    buttonText: v.optional(v.string()),
    buttonUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const projectId = "j9766ejvrqcmmsn5hbnearpc497baxrb" as Id<"projects">;

    const memberIds: Id<"members">[] = [];
    for (const devUserId of args.members) {
      let member = await ctx.db
        .query("members")
        .filter((q) => q.eq(q.field("developerUserId"), devUserId))
        .first();

      if (!member) {
        const newMemberId = await ctx.db.insert("members", {
          developerUserId: devUserId,
          projectId: projectId,
        });
        memberIds.push(newMemberId);
      } else {
        memberIds.push(member._id);
      }
    }

    const notificationId = await ctx.db.insert("notifications", {
      projectId,
      content: args.content,
      buttonText: args.buttonText,
      buttonUrl: args.buttonUrl,
    });

    for (const memberId of memberIds) {
      await ctx.db.insert("notificationMembers", {
        notificationId,
        memberId,
      });
    }
  },
});
