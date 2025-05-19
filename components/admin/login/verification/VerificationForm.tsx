"use client";

import { useState, useEffect } from "react";
import { Card } from "@heroui/react";
import { z } from "zod";
import { FaShieldAlt, FaHistory, FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

// Verification code schema
const verificationSchema = z.object({
  code: z
    .string()
    .length(6, "کد تایید باید ۶ رقم باشد")
    .regex(/^\d+$/, "کد تایید فقط باید شامل اعداد باشد"),
});

type VerificationData = z.infer<typeof verificationSchema>;

interface VerificationFormProps {
  phoneNumber: string;
  onSubmit: (code: string) => void;
  onResendCode: () => void;
  isLoading: boolean;
}

const VerificationForm = ({
  phoneNumber,
  onSubmit,
  onResendCode,
  isLoading,
}: VerificationFormProps) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(120); // 2 minutes countdown
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  // Set up countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    if (phone.length >= 10) {
      const last4 = phone.slice(-4);
      return `${last4}******`;
    }
    return phone;
  };

  // Format countdown for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Validate verification code
  const validateCode = (code: string) => {
    try {
      verificationSchema.parse({ code });
      setError(null);
      setIsValid(true);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      }
      setIsValid(false);
      return false;
    }
  };

  // Creates an array of individual digits for the OTP inputs
  const codeArray = Array.from({ length: 6 }, (_, index) => {
    return verificationCode[index] || "";
  });

  // Handle individual digit input
  const handleDigitChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length <= 1) {
      // Create new code with the single digit in the correct position
      const newCode = codeArray
        .map((digit, i) => (i === index ? value : digit))
        .join("");
      setVerificationCode(newCode);

      // Move focus to next input if a digit was entered
      if (value.length === 1 && index < 5) {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }

      const isNewCodeValid = validateCode(newCode);
      
      // Auto-submit if all 6 digits are filled and the code is valid
      if (isNewCodeValid && newCode.length === 6 && !isLoading) {
        onSubmit(newCode);
      }
    }
  };

  // Handle paste event to fill all inputs
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .substring(0, 6);
    setVerificationCode(pasteData);
    const isValid = validateCode(pasteData);
    
    // Auto-submit if all 6 digits are pasted and the code is valid
    if (isValid && pasteData.length === 6 && !isLoading) {
      onSubmit(pasteData);
    }
  };

  // Handle key press for backspace navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      // Move focus to previous input on backspace if current is empty
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateCode(verificationCode)) {
      onSubmit(verificationCode);
    }
  };

  // Handle resend code
  const handleResendCode = () => {
    setCountdown(120);
    onResendCode();
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
                <FaShieldAlt className="text-white text-xl" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-0.5">تایید شماره موبایل</h2>
            <p className="text-blue-100 text-sm flex justify-center items-center gap-1">
              <span>کد تایید به شماره</span>
              <span className="font-mono ltr inline-block bg-white/10 px-2 py-0.5 rounded-md">
                {formatPhoneNumber(phoneNumber)}
              </span>
              <span>ارسال شد</span>
            </p>
          </div>

          <div className="p-4">
            <div className="mb-4">
              <p className="text-gray-600 text-center text-xs mb-4">
                لطفا کد ۶ رقمی ارسال شده را وارد نمایید
              </p>

              {/* OTP Input Boxes */}
              <div className="flex justify-center gap-1 dir-ltr">
                {codeArray.map((digit, index) => (
                  <div
                    key={index}
                    className={`
                      relative w-9 h-11 border-2 rounded-md overflow-hidden transition-all
                      ${
                        focusedIndex === index
                          ? "border-blue-500 shadow-sm"
                          : digit
                          ? "border-blue-300"
                          : "border-gray-200"
                      }
                      ${
                        error && verificationCode.length === 6
                          ? "border-red-300"
                          : ""
                      }
                    `}
                  >
                    <input
                      id={`otp-input-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onPaste={handlePaste}
                      onFocus={() => setFocusedIndex(index)}
                      onBlur={() => setFocusedIndex(null)}
                      className="w-full h-full text-center text-base bg-transparent focus:outline-none"
                      autoComplete="one-time-code"
                    />
                    {/* Animation for filled input */}
                    {digit && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute inset-0 bg-blue-50 -z-10"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Error message */}
              {error && verificationCode.length === 6 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-xs text-center mt-2"
                >
                  {error}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={!isValid || isLoading}
              className={`
                w-full py-2 px-4 rounded-lg font-semibold text-white text-sm relative overflow-hidden
                flex items-center justify-center gap-1.5
                ${
                  !isValid || isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-tr from-blue-600 to-blue-700 hover:shadow-md"
                }
              `}
              whileTap={{ scale: !isValid || isLoading ? 1 : 0.98 }}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>در حال تایید...</span>
                </>
              ) : (
                <>
                  {isValid && <FaCheck className="text-white text-xs" />}
                  <span>تایید و ورود</span>
                </>
              )}
            </motion.button>

            {/* Countdown and Resend Action */}
            <div className="flex flex-col items-center mt-4">
              {countdown > 0 ? (
                <div className="flex items-center text-gray-500 text-xs gap-1.5">
                  <FaHistory className="text-blue-500 text-xs" />
                  <span>ارسال مجدد کد تا</span>
                  <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-mono text-xs">
                    {formatTime(countdown)}
                  </span>
                </div>
              ) : (
                <motion.button
                  type="button"
                  onClick={handleResendCode}
                  className="text-blue-600 text-xs flex items-center gap-1.5 hover:underline focus:outline-none"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaHistory className="text-xs" />
                  <span>ارسال مجدد کد تایید</span>
                </motion.button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </form>
  );
};

export default VerificationForm;
