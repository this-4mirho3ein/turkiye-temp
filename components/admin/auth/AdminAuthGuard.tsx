"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import adminAuthService from "@/components/admin/login/authService";

interface AdminAuthGuardProps {
  children: ReactNode;
}

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const authCheck = async () => {
      const isAuth = adminAuthService.isAuthenticated();

      if (!isAuth) {
        // Redirect to login page if not authenticated

        router.replace("/admin/login");
      } else {
        setIsAuthenticated(true);
      }

      setIsLoading(false);
    };

    authCheck();
  }, [router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-default-500 font-medium rtl">
            در حال بررسی دسترسی...
          </p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
};

export default AdminAuthGuard;
