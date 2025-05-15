"use client";

import { useState } from "react";
import { Card } from "@heroui/react";
import { z } from "zod";
import PhoneInput from "./PhoneInput";
import LoginSubmitButton from "./LoginSubmitButton";
import { FaRegBuilding, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

// Schema for phone validation
const phoneSchema = z
  .string()
  .regex(/^\d+$/, "شماره موبایل فقط باید شامل اعداد باشد")
  .refine((val) => val.length === 11 || val.length === 10, {
    message: "شماره موبایل باید 10 یا 11 رقم باشد (با یا بدون صفر ابتدایی)",
  })
  .refine((val) => val.startsWith("0") || val.length === 10, {
    message: "شماره موبایل باید با 0 شروع شود یا 10 رقم باشد",
  });

interface LoginFormProps {
  onSubmit: (phoneNumber: string) => void;
}

const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneChange = (phone: string, isValid: boolean) => {
    setPhoneNumber(phone);
    setIsFormValid(isValid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);
    try {
      await onSubmit(phoneNumber);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden backdrop-blur-sm bg-white/90 border border-white/20 shadow-lg rounded-xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-4 px-5 text-white text-center">
            <div className="flex justify-center mb-2">
              <div className="bg-white/20 p-2.5 rounded-full backdrop-blur-sm">
                <FaRegBuilding className="text-white text-xl" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-0.5">ورود به پنل مدیریت</h2>
            <p className="text-blue-100 text-sm">املاک ترکیه | پنل ادمین</p>
          </div>

          <div className="p-4">
            {/* Security icon and message */}
            <div className="flex items-center gap-1.5 mb-4 bg-blue-50 p-2 rounded-lg text-blue-700 text-xs">
              <FaLock className="text-blue-500 text-sm" />
              <p>برای ورود، کد تایید به شماره موبایل شما ارسال خواهد شد</p>
            </div>

            <PhoneInput onPhoneChange={handlePhoneChange} />

            <LoginSubmitButton
              isLoading={isLoading}
              isDisabled={!isFormValid}
            />

            <div className="mt-4 text-center">
              <div className="text-xs text-gray-500">
                <p>با ورود به سیستم، شما قوانین و مقررات سایت را می‌پذیرید</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </form>
  );
};

export default LoginForm;
