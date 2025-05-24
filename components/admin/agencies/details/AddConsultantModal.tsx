"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addAgencyConsultant } from "@/controllers/makeRequest";
import { addToast } from "@heroui/react";
import { z } from "zod";

interface AddConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyId: string;
  isAgencyOwner: boolean;
  onSuccess: () => void;
}

// Validation schema
const phoneSchema = z.string()
  .min(10, "شماره تلفن باید حداقل 10 رقم باشد")
  .max(15, "شماره تلفن نمی‌تواند بیشتر از 15 رقم باشد")
  .regex(/^[0-9+\-\s]+$/, "شماره تلفن باید فقط شامل اعداد، +، - و فاصله باشد")
  .transform(val => {
    // Remove any non-digit characters
    let cleaned = val.replace(/\D/g, '');
    
    // If the number starts with 0, remove it
    if (cleaned.startsWith('0')) {
      console.log('Removing leading 0 from phone number');
      cleaned = cleaned.substring(1);
    }
    
    console.log('Transformed phone number:', cleaned);
    return cleaned;
  });

const AddConsultantModal: React.FC<AddConsultantModalProps> = ({
  isOpen,
  onClose,
  agencyId,
  isAgencyOwner,
  onSuccess
}) => {
  const [phone, setPhone] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Handle phone number input change
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Prevent leading zero
    if (value === '0') {
      return; // Don't update state if user enters only a zero
    }
    
    // If value starts with 0, remove it
    if (value.startsWith('0')) {
      setPhone(value.substring(1));
    } else {
      setPhone(value);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate and transform phone number
      const validatedPhone = phoneSchema.parse(phone);
      console.log('Original phone:', phone, 'Validated phone:', validatedPhone);
      
      setLoading(true);
      setError(null);
      
      // API call to add consultant
      const response = await addAgencyConsultant(agencyId, validatedPhone);
      
      if (response.success) {
        // Show success toast notification with message from API
        addToast({
          title: 'موفق', // Success
          description: response.message || 'مشاور با موفقیت اضافه شد',
          color: 'success',
          radius: 'md',
          variant: 'solid',
          timeout: 3000,
        });
        
        setPhone("");
        onSuccess();
        onClose();
      } else {
        // Show error toast notification with message from API
        addToast({
          title: 'خطا', // Error
          description: response.message || 'خطا در افزودن مشاور',
          color: 'danger',
          radius: 'md',
          variant: 'solid',
          timeout: 3000,
        });
        
        setError(response.message || "خطا در افزودن مشاور");
      }
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        // Show validation error toast
        addToast({
          title: 'خطای اعتبارسنجی', // Validation Error
          description: err.errors[0].message,
          color: 'danger',
          radius: 'md',
          variant: 'solid',
          timeout: 3000,
        });
        
        setError(err.errors[0].message);
      } else {
        // Show general error toast
        addToast({
          title: 'خطا', // Error
          description: err.message || 'خطا در افزودن مشاور',
          color: 'danger',
          radius: 'md',
          variant: 'solid',
          timeout: 3000,
        });
        
        setError(err.message || "خطا در افزودن مشاور");
      }
    } finally {
      setLoading(false);
    }
  };

  // If user is not agency owner, don't render the modal
  if (!isAgencyOwner) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">افزودن مشاور</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-purple-600 ml-2"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      <label htmlFor="phone" className="block text-gray-700 font-medium">
                        شماره تلفن مشاور
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="phone"
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="مثال: 9123456789"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors text-gray-800 dir-ltr text-left"
                        dir="ltr"
                      />
                    </div>
                    {error && (
                      <p className="mt-2 text-red-600 text-sm">{error}</p>
                    )}
                    <p className="mt-2 text-gray-500 text-sm">
                      شماره تلفن کاربری که می‌خواهید به عنوان مشاور اضافه کنید را وارد کنید.
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors ml-2"
                    >
                      انصراف
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          در حال پردازش...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="ml-1"
                          >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          افزودن مشاور
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddConsultantModal;
