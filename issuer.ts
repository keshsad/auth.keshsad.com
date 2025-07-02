import { issuer } from "@openauthjs/openauth";
import { CloudflareStorage } from "@openauthjs/openauth/storage/cloudflare";
import { GoogleProvider } from "@openauthjs/openauth/provider/google";
import { subjects } from "./subjects";

const storage = CloudflareStorage({
  namespace: "auth"
})

const app = issuer({
  providers: {
    google: GoogleProvider({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scopes: ["email"]
    })
  },
  subjects,
  storage,
  success: async (ctx, value) => {
    let user
    if (value.provider === "google") {
      console.log(value.tokenset.access)
      user = await getOrCreateUser(value.tokenset.access)
    }
    return ctx.subject("user", {
      userID: user!.id,
      email: user!.email
    })
  }
})

const getOrCreateUser = async (accessToken: string) => {
  // lookup user or create them
  return {
    id: "123",
    email: "rishikesh.sadanandan@gmail.com"
  }
}

export default app
