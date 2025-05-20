"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@heroui/react";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";
import { PiSpinnerGap } from "react-icons/pi";

// Verification code schema
const verificationSchema = z.object({
  code: z
    .string()
    .length(6, "کد تایید باید ۶ رقم باشد")
    .regex(/^\d+$/, "کد تایید فقط باید شامل اعداد باشد"),
});

interface SimpleOtpInputProps {
  onVerify: (code: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export default function SimpleOtpInput({
  onVerify,
  onBack,
  isLoading = false,
}: SimpleOtpInputProps) {
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

      validateCode(newCode);
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
    validateCode(pasteData);
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
      onVerify(verificationCode);
    }
  };

  // Handle resend code
  const handleResendCode = () => {
    setCountdown(120);
    onBack(); // Go back to phone input
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">
            لطفا کد ۶ رقمی ارسال شده را وارد نمایید
          </p>
        </div>

        {/* OTP Input Boxes */}
        <div className="flex justify-center gap-2 dir-ltr">
          {codeArray.map((digit, index) => (
            <div
              key={index}
              className={`
                relative w-10 h-12 border-2 rounded-md overflow-hidden transition-all
                ${
                  focusedIndex === index
                    ? "border-blue-500 shadow-sm"
                    : digit
                    ? "border-blue-300"
                    : "border-gray-200"
                }
                ${
                  error && verificationCode.length === 6 ? "border-red-300" : ""
                }
              `}
            >
              <input
                id={`otp-input-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(e, index)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-full h-full text-center text-xl font-medium bg-transparent border-none outline-none"
              />
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && <p className="text-xs text-red-600 text-center">{error}</p>}

        {/* Countdown Timer */}
        <div className="text-center">
          {countdown > 0 ? (
            <p className="text-xs text-gray-600">
              <span>زمان باقی‌مانده: </span>
              <span className="font-mono font-medium text-blue-600">
                {formatTime(countdown)}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendCode}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              ارسال مجدد کد
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          className="flex-1 flex items-center justify-center gap-1"
          color="secondary"
          variant="ghost"
          onClick={onBack}
          disabled={isLoading}
        >
          <RiArrowRightLine />
          <span>بازگشت</span>
        </Button>

        <Button
          type="submit"
          className="flex-1 flex items-center justify-center gap-1"
          color="primary"
          disabled={!isValid || isLoading}
        >
          {isLoading ? (
            <PiSpinnerGap className="animate-spin text-lg" />
          ) : (
            <>
              <span>تایید</span>
              <RiArrowLeftLine />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
