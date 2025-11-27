/// <reference types="next-auth" />

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      gender?: "male" | "female" | "trans" | "other"; // or your Gender enum/type
      username?: string;
    } & DefaultSession["user"]
  }

  interface User {
    id: string;
    gender?: "male" | "female" | "trans" | "other"; // match your User model
    username?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    gender?: "male" | "female" | "trans" | "other";
    username?: string;
  }
}

