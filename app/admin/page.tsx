"use client";

import { useEffect, useState } from "react";
import DashboardStats from "@/components/admin/DashboardStats";
import RecentActivities from "@/components/admin/RecentActivities";
import QuickActions from "@/components/admin/QuickActions";
import adminAuthService from "@/components/admin/login/services/authService";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    userId: "",
    roles: [] as string[],
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Remove the authentication transition flag if it exists
    // This ensures normal auth behavior is restored after successful login
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("isAuthenticating")
    ) {
      console.log("Clearing authentication transition flag on admin dashboard");
      sessionStorage.removeItem("isAuthenticating");
    }

    // Get authentication information
    const userId = localStorage.getItem("userId") || "";
    const roles = adminAuthService.getUserRoles();
    const isAuthenticated = adminAuthService.isAuthenticated();

    setUserInfo({
      userId,
      roles,
      isAuthenticated,
    });

    setIsLoading(false);

    // If not authenticated at this point, redirect to login
    if (!isAuthenticated && typeof window !== "undefined") {
      console.log("Not authenticated on dashboard, redirecting to login");
      router.replace("/admin/login");
    }
  }, [router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <p className="text-gray-600 font-medium rtl">
            در حال بارگذاری داشبورد...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">داشبورد مدیریت</h1>

      {userInfo.isAuthenticated && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-2 text-primary">
            اطلاعات کاربری
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <strong>شناسه کاربر:</strong> {userInfo.userId}
            </p>
            <p>
              <strong>نقش‌ها:</strong>{" "}
              {userInfo.roles.length ? userInfo.roles.join(", ") : "بدون نقش"}
            </p>
            <p>
              <strong>وضعیت احراز هویت:</strong>{" "}
              {userInfo.isAuthenticated ? "فعال" : "غیرفعال"}
            </p>
          </div>
        </div>
      )}

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivities />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
