import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const checkExisting = query({
  args : {
    clerkId : v.string()
  },
  handler : async (ctx, args) => {
    const user = await ctx.db
      .query("owners")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first()
    
    return user || null;
  }
})

export const createOwner = mutation({
  args : {
    name : v.string(),
    email : v.string(),
    clerkId : v.string(),
    profileImg : v.string(),
  },
  handler : async (ctx, args) => { 
    const user = await ctx.db.insert("owners", {
      email : args.email,
      name : args.name,
      profileImg : args.profileImg,
      clerkId : args.clerkId
    })
    return user;
  },
})