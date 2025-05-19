"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaInfoCircle,
  FaTimes,
  FaBell,
} from "react-icons/fa";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  title?: string;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, "id">) => void;
  hideToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const toastVariants = {
  initial: { opacity: 0, y: 20, x: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    x: 50,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const iconVariants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: 0.2,
      type: "spring",
      stiffness: 200,
    },
  },
};

const contentVariants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      delay: 0.1,
    },
  },
};

// Define color schemes based on toast type
const getToastStyles = (type: ToastType) => {
  switch (type) {
    case "success":
      return {
        background: "bg-gradient-to-l from-green-500 to-emerald-600",
        icon: <FaCheckCircle className="h-6 w-6 text-white" />,
        borderColor: "border-green-300",
        shadowColor: "shadow-green-500/20",
        ringColor: "ring-green-500/30",
      };
    case "error":
      return {
        background: "bg-gradient-to-l from-red-500 to-rose-600",
        icon: <FaExclamationCircle className="h-6 w-6 text-white" />,
        borderColor: "border-red-300",
        shadowColor: "shadow-red-500/20",
        ringColor: "ring-red-500/30",
      };
    case "warning":
      return {
        background: "bg-gradient-to-l from-amber-500 to-orange-600",
        icon: <FaExclamationCircle className="h-6 w-6 text-white" />,
        borderColor: "border-amber-300",
        shadowColor: "shadow-amber-500/20",
        ringColor: "ring-amber-500/30",
      };
    case "info":
    default:
      return {
        background: "bg-gradient-to-l from-blue-500 to-indigo-600",
        icon: <FaInfoCircle className="h-6 w-6 text-white" />,
        borderColor: "border-blue-300",
        shadowColor: "shadow-blue-500/20",
        ringColor: "ring-blue-500/30",
      };
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { ...toast, id }]);

    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      hideToast(id);
    }, 5000);
  }, []);

  const hideToast = useCallback((id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-4 w-full max-w-md rtl">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const styles = getToastStyles(toast.type);
            return (
              <motion.div
                key={toast.id}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={toastVariants}
                layout
                className={`${styles.background} rounded-xl overflow-hidden shadow-lg ${styles.shadowColor} border ${styles.borderColor} text-white ring-1 ${styles.ringColor}`}
              >
                <div className="flex items-center p-4">
                  <motion.div
                    variants={iconVariants}
                    className="flex-shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center ml-3"
                  >
                    {styles.icon}
                  </motion.div>
                  <motion.div
                    variants={contentVariants}
                    className="mr-3 flex-1 text-right"
                  >
                    {toast.title && (
                      <h4 className="text-white font-bold mb-1">
                        {toast.title}
                      </h4>
                    )}
                    <p className="text-white text-sm">{toast.message}</p>
                  </motion.div>
                  <button
                    onClick={() => hideToast(toast.id)}
                    className="flex-shrink-0 ml-2 bg-white/20 rounded-full p-1.5 hover:bg-white/30 transition-colors"
                  >
                    <FaTimes className="h-3.5 w-3.5 text-white" />
                  </button>
                </div>
                <div className="w-full bg-white/10 h-1">
                  <motion.div
                    className="h-full bg-white/40"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
