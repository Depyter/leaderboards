import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getToken } from "@/lib/auth-server";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const token = await getToken();
  if (!token) {
    redirect("/login");
  }
  return <>{children}</>;
}
