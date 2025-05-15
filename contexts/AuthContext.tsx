"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: any;
  login: (token: string, userData: any) => void;
  logout: () => void;
  setAuthHeader: (headers: Record<string, string>) => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "accessToken";
const USER_DATA_KEY = "userData";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [disableRedirects, setDisableRedirects] = useState(false);
  const [pendingAuth, setPendingAuth] = useState(false);

  // Initialize authentication state from localStorage (on client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(TOKEN_KEY);
      const userData = localStorage.getItem(USER_DATA_KEY);

      if (token) {
        setAccessToken(token);
        setIsAuthenticated(true);
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (e) {
            console.error("Error parsing user data from localStorage", e);
          }
        }
      }
      setIsLoading(false);
    }
  }, []);

  // Protect admin routes
  useEffect(() => {
    // Don't do anything while loading or if redirects are disabled
    if (isLoading || disableRedirects) {
      return;
    }

    // Check if we're in a loading transition (after successful login)
    const isAuthenticating =
      sessionStorage.getItem("isAuthenticating") === "true";

    // If we're in the authentication process, don't do any redirects
    if (isAuthenticating) {
      console.log("AuthContext: Currently authenticating, skipping redirects");
      return;
    }

    // Define routes that need protection
    const isAdminRoute =
      pathname.startsWith("/admin") &&
      !pathname.startsWith("/admin/login") &&
      !pathname.includes("verification");

    // Define login routes
    const isLoginRoute =
      pathname === "/admin/login" ||
      pathname.includes("/admin/login/verification");

    // If currently on verification page, don't redirect at all
    if (pathname.includes("/admin/login/verification")) {
      return;
    }

    if (isAdminRoute && !isAuthenticated) {
      // User is trying to access a protected route without authentication
      console.log("AuthContext: Not authenticated, redirecting to login", {
        pathname,
        isAuthenticated,
      });
      router.replace("/admin/login");
    } else if (isLoginRoute && isAuthenticated && !pendingAuth) {
      // User is authenticated but on login page - redirect to admin
      console.log("AuthContext: Already authenticated, redirecting to admin", {
        pathname,
        isAuthenticated,
      });
      router.replace("/admin");
    }
  }, [
    isAuthenticated,
    pathname,
    isLoading,
    disableRedirects,
    router,
    pendingAuth,
  ]);

  // Login function to store token and user data
  const login = (token: string, userData: any) => {
    console.log(
      "Login called with token:",
      !!token,
      "and userData:",
      !!userData
    );

    // Set pending auth to prevent immediate redirects
    setPendingAuth(true);

    // Temporarily disable redirects to prevent race conditions
    setDisableRedirects(true);

    // Store in localStorage
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

    // Update state
    setAccessToken(token);
    setUser(userData);
    setIsAuthenticated(true);

    // Re-enable redirects after state is updated
    setTimeout(() => {
      setDisableRedirects(false);
      setPendingAuth(false);
    }, 2000); // Wait 2 seconds before re-enabling redirects
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("roles");

    // Also clear any session storage flags
    sessionStorage.removeItem("isAuthenticating");
    sessionStorage.removeItem("loginPhone");

    // Update state
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);

    // Use window.location for a more reliable redirect
    window.location.href = "/admin/login";
  };

  // Utility function to set auth header for API requests
  const setAuthHeader = (headers: Record<string, string> = {}) => {
    if (accessToken) {
      return {
        ...headers,
        "x-access-token": accessToken,
      };
    }
    return headers;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        user,
        login,
        logout,
        setAuthHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
