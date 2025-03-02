import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  owners: defineTable({
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    profileImg: v.string()
  }),

  projects: defineTable({
    ownerId: v.id("owners"),
    name: v.string(),
    APIKEY: v.string(),
  }),

  notifications: defineTable({
    projectId: v.id("projects"),
    content: v.string(),
    buttonText: v.optional(v.string()),
    buttonUrl: v.optional(v.string()),
  }),

  members: defineTable({
    projectId : v.id("projects"),
    developerUserId: v.string(),
  }).index("byDeveloperUserId", ["developerUserId"]),

  notificationMembers: defineTable({
    notificationId: v.id("notifications"),
    memberId: v.id("members"),
  })
    .index("by_notification", ["notificationId"])
    .index("by_member", ["memberId"])
})