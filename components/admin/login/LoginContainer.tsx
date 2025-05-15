"use client";

import { useRouter } from "next/navigation";
import LoginBackground from "./LoginBackground";
import LoginForm from "./LoginForm";
import { useToast } from "@/components/admin/ui/ToastProvider";
import adminAuthService from "./services/authService";
import { z } from "zod";
import { FaHeadset, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";

// Schema for phone validation
const phoneSchema = z
  .string()
  .regex(/^\d+$/, "شماره موبایل فقط باید شامل اعداد باشد")
  .refine((val) => val.length === 11 || val.length === 10, {
    message: "شماره موبایل باید 10 یا 11 رقم باشد (با یا بدون صفر ابتدایی)",
  })
  .refine((val) => val.startsWith("0") || val.length === 10, {
    message: "شماره موبایل باید با 0 شروع شود یا 10 رقم بدون صفر باشد",
  });

const LoginContainer = () => {
  const router = useRouter();
  const { showToast } = useToast();

  // Formats the phone number for server API
  const formatPhoneForApi = (phoneNumber: string): string => {
    // Remove any non-digit characters first
    let digitsOnly = phoneNumber.replace(/\D/g, "");

    // If starts with 0, remove it
    if (digitsOnly.startsWith("0")) {
      digitsOnly = digitsOnly.substring(1);
    }

    // The API expects the number without leading zero
    console.log("Original phone:", phoneNumber);
    console.log("Formatted for API:", digitsOnly);

    return digitsOnly;
  };

  const handleSubmit = async (phoneNumber: string) => {
    try {
      // Format phone number for API
      const formattedPhone = formatPhoneForApi(phoneNumber);

      // Log phone number for debugging
      console.log("Login phone number submitted:", phoneNumber);
      console.log("Formatted for API:", formattedPhone);

      // Send login code via API
      const response = await adminAuthService.sendLoginCode(formattedPhone);

      // Log response for debugging
      console.log("API response:", response);

      if (response.success) {
        // Show success toast
        showToast({
          message: response.message || "کد تایید با موفقیت ارسال شد",
          type: "success",
          duration: 3000,
        });

        // Store phone number in session storage for verification page
        sessionStorage.setItem("loginPhone", formattedPhone);

        // Redirect to verification page
        router.push("/admin/login/verification");
      } else {
        // Show error toast with additional details
        let errorMessage =
          response.message || "خطا در ارسال کد تایید. لطفا دوباره تلاش کنید";

        // Add more detailed guidance if needed
        showToast({
          message: errorMessage,
          type: "error",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      // Show error toast for unexpected errors
      showToast({
        message: "مشکلی در ارتباط با سرور رخ داده است. لطفا دوباره تلاش کنید",
        type: "error",
        duration: 5000,
      });
    }
  };

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
        <LoginForm onSubmit={handleSubmit} />
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-2 mb-2 w-full max-w-md mx-auto z-10"
      >
        <div className="bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm rounded-lg p-2.5">
          <div className="flex flex-col md:flex-row items-center gap-2 rtl">
            <div className="flex items-center gap-2 text-blue-800">
              <div className="bg-blue-100 p-1.5 rounded-full">
                <FaHeadset className="text-sm" />
              </div>
              <div className="text-center md:text-right">
                <p className="font-semibold text-sm">پشتیبانی</p>
                <p className="text-xs">۰۲۱-۱۲۳۴۵۶۷۸</p>
              </div>
            </div>

            <div className="h-10 w-px bg-gray-200 hidden md:block" />

            <div className="flex items-start gap-2 flex-grow text-gray-600">
              <FaInfoCircle className="text-blue-600 mt-0.5 text-xs" />
              <div className="text-xs">
                <p>
                  دسترسی به این پنل فقط برای کارکنان و نمایندگان مجاز امکان‌پذیر
                  است
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-gray-500 mt-2">
          <p>تمامی حقوق محفوظ است - املاک ترکیه &copy; ۱۴۰۳</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginContainer;
