import { getAdminSession } from "@/app/lib/session";
import LoginForm from "./components/LoginForm";
import DashboardClient from "./components/DashboardClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | ODM Groove",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getAdminSession();
  
  if (!session) {
    return <LoginForm />;
  }

  return <DashboardClient user={session} />;
}
