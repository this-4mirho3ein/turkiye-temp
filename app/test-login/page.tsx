"use client";

import { useState } from "react";
import { Card, CardBody, CardFooter } from "@heroui/react";
import PhoneInputComponent from "@/components/admin/login/PhoneInputComponent";
import SimpleOtpInput from "@/components/admin/login/SimpleOtpInput";
import { RiAdminLine, RiShieldKeyholeLine } from "react-icons/ri";

export default function TestLoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneSubmit = (phone: string, countryCodeValue: string) => {
    console.log("Phone submit function called with:", {
      phone,
      countryCode: countryCodeValue,
    });
    alert(`Phone submit: ${phone}, Country Code: ${countryCodeValue}`);
    setPhoneNumber(phone);
    setCountryCode(countryCodeValue);
    setStep("otp");
  };

  const handleOtpVerify = (otp: string) => {
    console.log("OTP verify function called with:", otp);
    alert(`OTP verify: ${otp}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card
        className="max-w-md w-full mx-auto overflow-hidden shadow-xl"
        radius="lg"
      >
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-5 px-6 flex items-center gap-3 text-white">
          <div className="p-2 bg-white/20 rounded-full">
            {step === "phone" ? (
              <RiAdminLine className="text-2xl" />
            ) : (
              <RiShieldKeyholeLine className="text-2xl" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold">تست لاگین</h1>
            <p className="text-sm text-blue-100">
              {step === "phone" ? "ورود شماره" : "تایید کد"}
            </p>
          </div>
        </div>

        <CardBody className="px-6 py-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-red-600 rounded-full"></span>
              {error}
            </div>
          )}

          {step === "phone" ? (
            <PhoneInputComponent
              onSubmit={handlePhoneSubmit}
              isLoading={isLoading}
            />
          ) : (
            <SimpleOtpInput
              onVerify={handleOtpVerify}
              onBack={() => setStep("phone")}
            />
          )}
        </CardBody>

        <CardFooter className="bg-gray-50 px-6 py-4 flex justify-center">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} - تست صفحه لاگین
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
