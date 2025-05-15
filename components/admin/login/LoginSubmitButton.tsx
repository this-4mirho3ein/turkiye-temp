"use client";

import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

interface LoginSubmitButtonProps {
  isLoading: boolean;
  isDisabled: boolean;
}

const LoginSubmitButton = ({
  isLoading,
  isDisabled,
}: LoginSubmitButtonProps) => {
  return (
    <motion.button
      type="submit"
      disabled={isDisabled || isLoading}
      className={`
        w-full relative overflow-hidden py-2 px-4 rounded-lg font-semibold text-white text-sm
        transition-all duration-300 transform group
        ${
          isDisabled || isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-tr from-blue-600 to-blue-700 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
        }
      `}
      whileTap={{ scale: isDisabled || isLoading ? 1 : 0.98 }}
    >
      <span className="relative z-10 flex items-center justify-center gap-1.5">
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
            <span>در حال ارسال...</span>
          </>
        ) : (
          <>
            <span>ارسال کد تایید</span>
            <FaArrowLeft className="text-xs" />
          </>
        )}
      </span>

      {/* Decorative elements for advanced button styling */}
      {!isDisabled && !isLoading && (
        <>
          <span className="absolute top-0 left-0 h-full w-full bg-white/10 transform -translate-x-full hover:translate-x-0 transition-transform duration-300" />
          <span className="absolute right-0 bottom-0 h-8 w-8 bg-white/20 rounded-full transform translate-x-full translate-y-full group-hover:translate-x-1/3 group-hover:translate-y-1/3 transition-transform duration-500" />
        </>
      )}
    </motion.button>
  );
};

export default LoginSubmitButton;
