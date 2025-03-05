import { api } from "@/convex/_generated/api";
import { currentUser } from "@clerk/nextjs/server"
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await currentUser();
  if(!user) return null;
  const databaseUser = await fetchQuery(api.owner.checkExisting, { clerkId : user?.id})
  
  if(!databaseUser){
    await fetchMutation(api.owner.createOwner, {
      clerkId : user.id,
      email : user.emailAddresses[0].emailAddress,
      name : user.firstName || "",
      profileImg : user.imageUrl
    })
  }
  return redirect("/dashboard")
}

export default page