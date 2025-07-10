"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import adminAuthService from "@/components/admin/login/services/authService";
import { useAuth } from "@/contexts/AuthContext";

interface AdminAuthGuardProps {
  children: ReactNode;
}

const AdminAuthGuard = ({ children }: AdminAuthGuardProps) => {
  const router = useRouter();
  const { isAuthenticated: contextIsAuthenticated } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're in a loading transition (after successful login)
    const isAuthenticating = sessionStorage.getItem("isAuthenticating");

    // Check if user is authenticated
    const authCheck = async () => {
      const isAuth = adminAuthService.isAuthenticated();


      // If transitioning from successful login, don't redirect
      if (isAuthenticating === "true") {

        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      // Check for token in both localStorage and cookies
      const localToken = localStorage.getItem("accessToken");
      const cookieToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1];

      // If we have a token in either place, consider the user authenticated
      const hasValidToken = !!(localToken || cookieToken);

      if (hasValidToken || isAuth || contextIsAuthenticated) {
        // If authenticated in any system, allow access

        setIsAuthenticated(true);
      } else {
        // Only redirect if all authentication systems report as unauthenticated

        router.replace("/admin/login");
      }

      setIsLoading(false);
    };

    authCheck();
  }, [router, contextIsAuthenticated]);

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
