"use client";
import { useEffect, useState, useRef } from "react";
import {
  setLoading,
  setLogin,
  setLogOut,
  useAuth,
} from "@/context/AuthContext";
import {
  catchMessage,
  successMessage,
} from "@/utils/showMessages";
import Joi from "joi";
import joiMessages from "@/utils/joiMessages";
import PhoneInput from "react-phone-input-2";
import fa from "react-phone-input-2/lang/ir.json";
import "react-phone-input-2/lib/style.css";
import { RiMailSendLine, RiLoader4Line } from "react-icons/ri";
import { sendOtpCode, verifyOtp } from "@/controllers/makeRequest";
import { useRouter } from "next/navigation";

export default function LoginComponent() {
  const { state, dispatch } = useAuth();
  const [formData, setFormData] = useState({
    mobileNumber: "",
    otp: "",
    countryCode: "98",
  });
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const router = useRouter();

  // Refs
  const phoneInputContainerRef = useRef<HTMLDivElement>(null);
  const otpInputRef = useRef<HTMLInputElement>(null);

  // Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  // Auto focus inputs
  useEffect(() => {
    setTimeout(() => {
      if (!otpSent) {
        phoneInputContainerRef.current?.querySelector("input")?.focus();
      } else {
        otpInputRef.current?.focus();
      }
    }, 100);
  }, [otpSent]);

  useEffect(() => {
    setLogOut(dispatch);
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateFields = (isCode: boolean, otp?: string) => {
    try {
      const schema = isCode
        ? Joi.object({
            mobileNumber: Joi.string()
              .required()
              .pattern(/^[0-9]{9,12}$/)
              .messages(joiMessages("mobile")),
            otp: Joi.string()
              .length(5)
              .required()
              .messages(joiMessages("confirmationCode")),
          })
        : Joi.object({
            mobileNumber: Joi.string()
              .required()
              .pattern(/^[0-9]{9,12}$/)
              .messages(joiMessages("mobile")),
          });

      const { error } = schema.validate(
        isCode
          ? { mobileNumber: formData.mobileNumber, otp: otp }
          : { mobileNumber: formData.mobileNumber },
        { abortEarly: false }
      );

      return !error;
    } catch (error) {
      console.error(error);
      setLoading(dispatch, false);
      catchMessage();
      return false;
    }
  };

  const handleLogin = async () => {
    if (!validateFields(false)) return;
    setLoading(dispatch, true);
    try {
      const response = await sendOtpCode(
        formData.mobileNumber,
        formData.countryCode
      );
      if (response.status === 200) {
        successMessage(response.message);
        setOtpSent(true);
        setCountdown(120);
      }
    } catch (error) {
      console.error(error);
      catchMessage();
    } finally {
      setLoading(dispatch, false);
    }
  };

  const handleVerifyOtp = async (otp?: string) => {
    if (!validateFields(true, otp)) return;

    setLoading(dispatch, true);

    try {
      const response = await verifyOtp(
        formData.mobileNumber,
        otp || formData.otp
      );
      if (response.status === 200) {
        const { access_token, refresh_token, role, user_id, wallet } = response;

        setLogin(dispatch, {
          accessToken: access_token,
          refreshToken: refresh_token,
          role,
          id: user_id,
          wallet,
        });

        successMessage(response.message);
        if (response.status === 200) {
          router.replace("/");
        }
      }
    } catch (error) {
      console.error(error);
      catchMessage();
    } finally {
      setLoading(dispatch, false);
    }
  };

  const handleResendOtp = async () => {
    setFormData({
      ...formData,
      otp: "",
    });
    setLoading(dispatch, true);

    try {
      const response = await sendOtpCode(
        formData.mobileNumber,
        formData.countryCode
      );
      successMessage(response.message);
      setCountdown(120);
    } catch (error) {
      console.error(error);
      catchMessage();
    } finally {
      setLoading(dispatch, false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      otpSent ? handleVerifyOtp() : handleLogin();
    }
  };

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              ورود / ساخت حساب جدید
            </h2>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
            {/* {!state.authenticated && ( */}
            <div className="space-y-6">
              {!otpSent ? (
                <>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium leading-6 text-gray-900 text-right"
                    >
                      شماره موبایل
                    </label>
                    <div
                      dir="ltr"
                      className="mt-2"
                      ref={phoneInputContainerRef}
                    >
                      <PhoneInput
                        localization={fa}
                        country={"ir"}
                        value={formData.countryCode}
                        onChange={(value, country: any) => {
                          handleChange(
                            "mobileNumber",
                            value.slice(country.dialCode.length)
                          );
                          handleChange("countryCode", country.dialCode);
                        }}
                        onKeyDown={handleKeyDown}
                        inputStyle={{
                          appearance: "textfield",
                          MozAppearance: "textfield",
                          WebkitAppearance: "none",
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #d1d5db",
                          borderRadius: "0.375rem",
                          textAlign: "center",
                        }}
                        dropdownStyle={{
                          padding: 10,
                        }}
                        containerStyle={{
                          width: "100%",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={handleLogin}
                      disabled={state.loading}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                    >
                      {state.loading ? (
                        <RiLoader4Line className="animate-spin h-5 w-5" />
                      ) : (
                        "ارسال کد تایید"
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <div dir="ltr" className="mt-2">
                      <label
                        htmlFor="otp"
                        className="block text-sm font-medium leading-6 text-gray-900 text-right"
                      >
                        کد تایید
                      </label>
                      <div className="flex justify-center gap-2 mt-2">
                        {[0, 1, 2, 3, 4].map((index) => (
                          <input
                            key={index}
                            ref={index === 0 ? otpInputRef : null}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={formData.otp[index] || ""}
                            onChange={(e) => {
                              const rawValue = e.target.value;
                              const value = rawValue.replace(/\D/g, "");

                              if (value || rawValue === "") {
                                // Update the OTP based on input
                                const newOtpArray = formData.otp.split("");
                                newOtpArray[index] = value;

                                const joinedOtp = newOtpArray.join("");
                                handleChange("otp", joinedOtp);

                                // Move focus
                                if (value && index < 4) {
                                  const nextInput = document.getElementById(
                                    `otp-${index + 1}`
                                  );
                                  nextInput?.focus();
                                }

                                // If all 5 digits are filled, call verify with the up-to-date value
                                if (
                                  newOtpArray.every((digit) => digit !== "")
                                ) {
                                  handleVerifyOtp(joinedOtp); // pass the correct value directly
                                }
                              }
                            }}
                            onKeyDown={(e) => {
                              if (
                                e.key === "Backspace" &&
                                !formData.otp[index] &&
                                index > 0
                              ) {
                                const prevInput = document.getElementById(
                                  `otp-${index - 1}`
                                );
                                prevInput?.focus();
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const pasteData = e.clipboardData
                                .getData("text/plain")
                                .replace(/\D/g, "")
                                .slice(0, 5); // just in case someone pastes more than 5 digits

                              if (pasteData.length === 5) {
                                handleChange("otp", pasteData);

                                handleVerifyOtp(pasteData);

                                // Optional: Move focus to last field
                                const lastInput =
                                  document.getElementById("otp-4");
                                lastInput?.focus();
                              }
                            }}
                            id={`otp-${index}`}
                            className="w-12 h-12 text-center text-xl rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                          />
                        ))}
                      </div>
                      <div
                        dir="rtl"
                        className="mt-2 flex flex-col items-center"
                      >
                        {countdown > 0 ? (
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-sm text-gray-500">
                              زمان باقیمانده:
                            </span>
                            <span className="font-medium text-indigo-600">
                              {formatCountdown(countdown)}
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center mt-2">
                            <button
                              onClick={handleResendOtp}
                              disabled={state.loading}
                              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium ${
                                state.loading
                                  ? "text-indigo-400 cursor-not-allowed"
                                  : "text-indigo-600 hover:text-indigo-500 hover:bg-indigo-50"
                              }`}
                            >
                              {state.loading ? (
                                <>
                                  <RiLoader4Line className="h-4 w-4 animate-spin" />
                                  در حال ارسال...
                                </>
                              ) : (
                                <>
                                  <RiMailSendLine className="h-4 w-4" />
                                  ارسال مجدد کد
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => handleVerifyOtp()}
                      disabled={state.loading}
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                    >
                      {state.loading ? (
                        <RiLoader4Line className="animate-spin h-5 w-5" />
                      ) : (
                        "تایید و ورود"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
              ورود شما به معنای پذیرش
              <a
                href="#"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                {" "}
                شرایط{" "}
              </a>
              این سایت و
              <a
                href="#"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                {" "}
                قوانین حریم خصوصی{" "}
              </a>
              است
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
