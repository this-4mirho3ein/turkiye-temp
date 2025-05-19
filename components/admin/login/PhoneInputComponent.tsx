"use client";

import { useState } from "react";
import { z } from "zod";
import { BsPhone } from "react-icons/bs";
import { Button } from "@heroui/react";
import { RiArrowLeftLine } from "react-icons/ri";
import { PiSpinnerGap } from "react-icons/pi";

// Schema for validation with Persian error messages
const phoneSchema = z
  .string()
  .regex(/^\d+$/, "شماره موبایل فقط باید شامل اعداد باشد")
  .refine((val) => val.length === 11 || val.length === 10, {
    message: "شماره موبایل باید 10 یا 11 رقم باشد (با یا بدون صفر ابتدایی)",
  })
  .refine((val) => val.startsWith("0") || val.length === 10, {
    message: "شماره موبایل باید با 0 شروع شود یا 10 رقم بدون صفر باشد",
  });

interface PhoneInputComponentProps {
  onSubmit: (phoneNumber: string, countryCode: string) => void;
  isLoading?: boolean;
}

export default function PhoneInputComponent({
  onSubmit,
  isLoading = false,
}: PhoneInputComponentProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [countryCode, setCountryCode] = useState("98"); // Default country code for Iran

  const validatePhone = (value: string) => {
    try {
      phoneSchema.parse(value);
      setError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      }
      return false;
    }
  };

  const handleInputChange = (value: string) => {
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, "");

    // Limit to 11 digits max (0 + 10 digits)
    const limitedValue = digitsOnly.substring(0, 11);

    setPhoneNumber(limitedValue);
    validatePhone(limitedValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validatePhone(phoneNumber)) {
      // Format phone number by removing leading zero if present
      const formattedPhone = phoneNumber.startsWith("0")
        ? phoneNumber.substring(1)
        : phoneNumber;

      onSubmit(formattedPhone, countryCode);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="space-y-2">
        <div
          className={`
            relative rounded-lg overflow-hidden transition-all duration-200
            ${
              error
                ? "border-red-300 bg-red-50/50"
                : isFocused
                ? "border-blue-300 bg-blue-50/50"
                : "border-gray-200 bg-gray-50/50"
            }
            ${isFocused ? "border-2" : "border"}
          `}
        >
          <div className="flex items-center p-2">
            <div
              className={`p-1.5 rounded-full ${
                isFocused ? "bg-blue-100" : "bg-gray-100"
              }`}
            >
              <BsPhone
                className={`text-base ${
                  isFocused ? "text-blue-600" : "text-gray-500"
                }`}
              />
            </div>

            <div className="flex-grow mx-2 rtl">
              <label
                className={`text-xs font-medium ${
                  error
                    ? "text-red-600"
                    : isFocused
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
              >
                شماره تلفن همراه
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="09123456789"
                className="w-full bg-transparent border-none outline-none text-base py-0.5 rtl"
                dir="rtl"
                required
              />
            </div>

            {/* Validation indicator */}
            {phoneNumber.length > 0 && (
              <div
                className={`h-4 w-4 rounded-full flex items-center justify-center
                ${error ? "bg-red-100" : "bg-green-100"}`}
              >
                <span
                  className={`text-[10px] ${
                    error ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {error ? "!" : "✓"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && <p className="text-xs text-red-600">{error}</p>}

        {/* Help text with example */}
        <div className="flex items-center text-xs text-gray-500 gap-1.5">
          <span>مثال:</span>
          <div className="bg-gray-100 px-1.5 py-0.5 rounded">09142347137</div>
          <span>یا</span>
          <div className="bg-gray-100 px-1.5 py-0.5 rounded">9142347137</div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full flex items-center justify-center gap-2"
        color="primary"
        disabled={!phoneNumber || !!error || isLoading}
      >
        {isLoading ? (
          <PiSpinnerGap className="animate-spin text-lg" />
        ) : (
          <>
            <span>دریافت کد تایید</span>
            <RiArrowLeftLine />
          </>
        )}
      </Button>
    </form>
  );
}
