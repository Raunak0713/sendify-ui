export const dynamic = "force-dynamic";

import { api } from "../../../convex/_generated/api";
import { currentUser } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

const page = async () => {
  try {
    console.log("🔍 Fetching current user...");
    const user = await currentUser();
    if (!user) {
      console.error("❌ No user found! Returning null.");
      return null;
    }
    console.log("✅ User found:", user);

    let databaseUser;
    try {
      console.log("🔍 Checking if user exists in database...");
      databaseUser = await fetchQuery(api.owner.checkExisting, { clerkId: user.id });
      console.log("✅ Database user check complete:", databaseUser);
    } catch (error) {
      console.error("❌ Error fetching user from database:", error);
      throw new Error("Failed to fetch user from database.");
    }

    if (!databaseUser) {
      try {
        console.log("🛠 Creating new user in database...");
        await fetchMutation(api.owner.createOwner, {
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress,
          name: user.firstName || "",
          profileImg: user.imageUrl,
        });
        console.log("✅ User successfully created in Convex!");
      } catch (error) {
        console.error("❌ Error creating user in Convex:", error);
        throw new Error("Failed to create user in Convex.");
      }
    }
  } catch (error) {
    console.error("🔥 Fatal error in onboarding page:", error);
    throw new Error("Something went wrong in the onboarding process.");
  }

  // 🚀 Move redirect OUTSIDE of try-catch
  return redirect("/dashboard");
};

export default page;
