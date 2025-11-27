import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

type Gender = "male" | "female" | "trans" | "other";

function isValidGender(gender: string | undefined): gender is Gender {
  const allowedGenders: Gender[] = ["male", "female", "trans", "other"];
  return gender !== undefined && (allowedGenders as readonly string[]).includes(gender);
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }
        await connectToDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          gender: user.gender,
          username: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { id: string; gender?: string; username?: string } }) {
      if (user) {
        token.id = user.id;
        // Type guard for gender
        token.gender = isValidGender(user.gender) ? user.gender : undefined;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        // Type guard for gender
        const allowedGenders = ["male", "female", "trans", "other"];
        session.user.gender = allowedGenders.includes(token.gender as string)
          ? (token.gender as "male" | "female" | "trans" | "other")
          : undefined;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" as const },
  pages: { signIn: "/auth/login" },
  secret: process.env.NEXTAUTH_SECRET,
  // Note: Using 'as any' is necessary due to NextAuth v4's complex type requirements
  // that don't perfectly match our callback signatures. The runtime behavior is correct.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
