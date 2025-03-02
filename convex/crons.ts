import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "delete inactive users",
  { hours : 720 },
  internal.member.deleteInactiveUsers
)

export default crons