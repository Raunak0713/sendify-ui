import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAllProjects = query({
  args : {
    clerkId : v.string()
  },
  handler : async(ctx, args) => {
    const user = await ctx.db
      .query("owners")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first()
    const ownerId = user?._id
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("ownerId"), ownerId))
      .collect()
    
    return projects || []
  }
})

export const createProject = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("owners")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const apiKey = crypto.randomUUID(); 

    const projectId = await ctx.db.insert("projects", {
      ownerId: user._id,
      name: args.name,
      APIKEY: apiKey,
    });

    return { projectId, apiKey };
  },
});
