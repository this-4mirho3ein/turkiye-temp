"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { BsPhone } from "react-icons/bs";

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

interface PhoneInputProps {
  onPhoneChange: (phoneNumber: string, isValid: boolean) => void;
  initialValue?: string;
}

export const PhoneInput = ({
  onPhoneChange,
  initialValue,
}: PhoneInputProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (initialValue) {
      const formatted = initialValue.replace(/\D/g, "");
      setPhoneNumber(formatted);
      validatePhone(formatted);
    }
  }, [initialValue]);

  const validatePhone = (value: string) => {
    try {
      phoneSchema.parse(value);
      setError(null);
      onPhoneChange(value, true);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
        onPhoneChange(value, false);
      }
      return false;
    }
  };

  const handleInputChange = (value: string) => {
    // Remove any non-digit characters
    const digitsOnly = value.replace(/\D/g, "");
    
    // Check if the first character is '0' and remove it (only when the user is typing)
    let formattedValue = digitsOnly;
    
    // Only apply the leading zero removal when the length of input is 1 (first character entered)
    if (formattedValue.length === 1 && formattedValue === "0") {
      formattedValue = "";
    }

    // Limit to 11 digits max (0 + 10 digits)
    const limitedValue = formattedValue.substring(0, 11);

    setPhoneNumber(limitedValue);
    validatePhone(limitedValue);
  };

  return (
    <div className="w-full mb-3 rtl">
      <div
        className={`
          relative mb-1.5 rounded-lg overflow-hidden transition-all duration-200
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
              className={`text-[10px] font-medium ${
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
      {error && <p className="text-xs text-red-600 mr-1.5 mb-1.5">{error}</p>}

      {/* Help text with example */}
      <div className="flex items-center text-[10px] text-gray-500 gap-1.5 mr-1.5">
        <span>مثال:</span>
        <div className="bg-gray-100 px-1.5 py-0.5 rounded">09142347137</div>
        <span>یا</span>
        <div className="bg-gray-100 px-1.5 py-0.5 rounded">9142347137</div>
      </div>
    </div>
  );
};

export default PhoneInput;
