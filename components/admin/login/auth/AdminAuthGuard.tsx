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
      console.log("Admin route auth check:", isAuth);
      console.log("Context auth check:", contextIsAuthenticated);
      console.log("Is authenticating:", isAuthenticating);

      // If transitioning from successful login, don't redirect
      if (isAuthenticating === "true") {
        console.log("Currently in authentication transition, allowing access");
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      if (!isAuth && !contextIsAuthenticated) {
        // Only redirect if both authentication systems report as unauthenticated
        console.log(
          "Not authenticated in either system, redirecting to login page"
        );
        router.replace("/admin/login");
      } else {
        // If authenticated in at least one system, allow access
        console.log("Authenticated in at least one system, allowing access");
        setIsAuthenticated(true);
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
