"use client";

import React from "react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/react";

interface VerificationContentProps {
  title: string;
  description: string;
}

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

const VerificationContent: React.FC<VerificationContentProps> = ({ title, description }) => {
  return (
    <motion.div 
      variants={itemVariants} 
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
    >
      <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>
      
      <div className="p-6">
        <div className="text-center py-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4 text-gray-400"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-2">بخش تأییدیه‌ها</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            این بخش در حال توسعه است. به زودی امکان مدیریت تأییدیه‌ها فراهم خواهد شد.
          </p>
          <button
            onClick={() => {
              addToast({
                title: 'اطلاعیه',
                description: 'این بخش در حال توسعه است و به زودی تکمیل خواهد شد.',
                color: 'primary',
                radius: 'md',
                variant: 'solid',
                timeout: 3000,
              });
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            اطلاعات بیشتر
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default VerificationContent;
