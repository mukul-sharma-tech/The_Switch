import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

// @ts-expect-error - NextAuth v4 default export is callable but types may not reflect this
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
