"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminAuthGuard from "@/components/admin/login/auth/AdminAuthGuard";
import { ReactNode } from "react";

export default function AdminLayoutWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Don't render sidebar and navbar for login pages
  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  // Use AuthGuard for all admin routes except login
  return (
    <AdminAuthGuard>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex flex-col md:flex-row flex-1">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
