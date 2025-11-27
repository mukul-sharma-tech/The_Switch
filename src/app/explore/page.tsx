import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions) as Session | null;

  if (!session) redirect("/auth/login");

  return <DashboardClient session={session} />;
}
