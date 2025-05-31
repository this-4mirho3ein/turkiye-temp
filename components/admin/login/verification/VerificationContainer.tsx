"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/ui/ToastProvider";
import LoginBackground from "../LoginBackground";
import VerificationForm from "./VerificationForm";
import adminAuthService from "../services/authService";
import { useAuth } from "@/contexts/AuthContext";
import { FaHeadset, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";

const VerificationContainer = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [displayPhone, setDisplayPhone] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  // Get phone number from session storage
  useEffect(() => {
    const storedPhone = sessionStorage.getItem("loginPhone");
    if (!storedPhone) {
      // Redirect back to login if no phone number is found
      router.replace("/admin/login");
      return;
    }

    setPhoneNumber(storedPhone);

    // Format the phone number for display (add leading "0")
    let displayNumber = storedPhone;
    if (!displayNumber.startsWith("0")) {
      displayNumber = "0" + displayNumber;
    }
    setDisplayPhone(displayNumber);

    console.log("Retrieved phone number from session:", storedPhone);
    console.log("Display phone number:", displayNumber);
  }, [router]);

  // Handle verification code submission
  const handleVerificationSubmit = async (code: string) => {
    if (!phoneNumber) return;

    setIsLoading(true);
    try {
      console.log(`Submitting code ${code} for phone ${phoneNumber}`);

      // Call API to login with the code
      const response = await adminAuthService.login(phoneNumber, code);

      console.log("Login API response:", response);

      if (response.success && response.data && response.data.accessToken) {
        // Extract token and user data from response
        const { accessToken, userId, roles, refreshToken, sessionId } =
          response.data;

        // Check if user has admin role
        if (!roles || !Array.isArray(roles) || !roles.includes("admin")) {
          // User doesn't have admin role - deny access
          console.log("Access denied - user does not have admin role:", roles);

          showToast({
            message: "شما مجوز دسترسی به پنل مدیریت را ندارید",
            type: "error",
            duration: 5000,
          });

          // Clear any stored authentication data
          sessionStorage.removeItem("loginPhone");
          sessionStorage.removeItem("isAuthenticating");

          // Redirect back to login page
          setTimeout(() => {
            router.replace("/admin/login");
          }, 2000);

          setIsLoading(false);
          return;
        }

        console.log("Access granted - user has admin role:", roles);

        // Set authenticating state to true to show loading screen
        setIsAuthenticating(true);

        // Set a flag in sessionStorage to prevent redirect loops during authentication
        sessionStorage.setItem("isAuthenticating", "true");

        // Store tokens in localStorage
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken || "");
        localStorage.setItem("userId", userId || "");
        localStorage.setItem("sessionId", sessionId || "");
        localStorage.setItem("roles", JSON.stringify(roles || []));

        // Store the token in cookie for middleware detection
        // Not setting 'expires' option makes this a session cookie that will be deleted when browser closes
        Cookies.set("accessToken", accessToken, {
          path: "/",
          secure: window.location.protocol === "https:",
          sameSite: "Lax",
        });

        // Set the x-access-token header for future API requests
        axios.defaults.headers.common["x-access-token"] = accessToken;

        // Also update the AuthContext state to avoid authentication conflicts
        // This ensures both auth systems are in sync
        const userData = {
          id: userId || "",
          roles: roles || [],
        };

        // Call the AuthContext login to sync both auth systems
        const loginResult = login(accessToken, userData);

        // Check if login was successful (user has admin role)
        if (!loginResult) {
          // Login failed due to role validation - this should not happen since we already checked
          // but adding as a safety measure
          console.log("AuthContext login failed - role validation failed");

          showToast({
            message: "شما مجوز دسترسی به پنل مدیریت را ندارید",
            type: "error",
            duration: 5000,
          });

          // Clear any stored authentication data
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("userId");
          localStorage.removeItem("sessionId");
          localStorage.removeItem("roles");
          sessionStorage.removeItem("loginPhone");
          sessionStorage.removeItem("isAuthenticating");

          // Redirect back to login page
          setTimeout(() => {
            router.replace("/admin/login");
          }, 2000);

          setIsLoading(false);
          setIsAuthenticating(false);
          return;
        }

        // Show success toast
        showToast({
          message: response.message || "شما با موفقیت وارد سیستم شدید",
          type: "success",
          duration: 3000,
        });

        // Clear session storage
        sessionStorage.removeItem("loginPhone");

        // Add a sufficient delay before redirect to ensure context updates completely
        setTimeout(() => {
          // Use window.location for a more reliable redirect that forces a full page reload
          // This ensures all authentication states are properly synchronized
          window.location.href = "/admin";

          // We don't need to manually remove the authenticating flag as the page will reload
        }, 1500);
      } else {
        // Show error toast and stay on the verification page
        showToast({
          message:
            response.message ||
            "کد وارد شده صحیح نمی‌باشد. لطفا دوباره تلاش کنید",
          type: "error",
          duration: 5000,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Verification error:", error);

      // Show error toast
      showToast({
        message: "مشکلی در ارتباط با سرور رخ داده است. لطفا دوباره تلاش کنید",
        type: "error",
        duration: 5000,
      });
      setIsLoading(false);
    }
  };

  // Handle resend code
  const handleResendCode = async () => {
    if (!phoneNumber) return;

    try {
      console.log("Resending code to phone:", phoneNumber);

      // Call the API to resend the code
      const response = await adminAuthService.sendLoginCode(phoneNumber);

      console.log("Resend code API response:", response);

      if (response.success) {
        // Show success toast
        showToast({
          message: response.message || "کد تایید مجدداً ارسال شد",
          type: "success",
          duration: 3000,
        });
      } else {
        // Show error toast
        showToast({
          message:
            response.message ||
            "خطا در ارسال مجدد کد تایید. لطفا دوباره تلاش کنید",
          type: "error",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Resend code error:", error);

      // Show error toast
      showToast({
        message: "مشکلی در ارتباط با سرور رخ داده است. لطفا دوباره تلاش کنید",
        type: "error",
        duration: 5000,
      });
    }
  };

  // If we're in authenticating state, show a loading screen
  if (isAuthenticating) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-4 overflow-hidden">
        <LoginBackground />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-lg shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col items-center z-10"
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: "linear",
            }}
            className="w-16 h-16 border-t-4 border-blue-600 border-solid rounded-full"
          />

          <h2 className="mt-6 text-lg font-semibold text-blue-800">
            در حال ورود به پنل مدیریت
          </h2>
          <p className="mt-2 text-sm text-gray-600">لطفاً صبر کنید...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between px-4 py-4 overflow-hidden">
      <LoginBackground />

      {/* Logo header */}
      <div className="pt-4 pb-3 z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-xl font-bold text-blue-800">املاک ترکیه</h1>
          <p className="text-blue-600 text-xs mt-0.5">پنل مدیریت سایت</p>
        </motion.div>
      </div>

      {/* Form container */}
      <div className="w-full max-w-sm mx-auto flex-grow flex items-center justify-center py-6">
        {phoneNumber && (
          <VerificationForm
            phoneNumber={displayPhone}
            onSubmit={handleVerificationSubmit}
            onResendCode={handleResendCode}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-2 mb-2 z-10"
      >
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/admin/login")}
          className="flex items-center gap-1.5 mx-auto bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-full px-3 py-1.5 text-blue-600 hover:bg-blue-50 text-xs"
        >
          <FaArrowRight className="text-xs" />
          <span>بازگشت به صفحه ورود</span>
        </motion.button>

        <div className="text-center text-[10px] text-gray-500 mt-2">
          <p>تمامی حقوق محفوظ است - املاک ترکیه &copy; ۱۴۰۳</p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationContainer;
