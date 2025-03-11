import { Sendify } from "sendify";

const sendify = new Sendify(process.env.SENDIFY_API_KEY!, process.env.NEXT_PUBLIC_SENDIFY_PROJECT_ID!)

export { sendify }