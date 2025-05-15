"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { FaCheck, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (
    type: ToastType,
    title: string,
    message: string,
    duration?: number
  ) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToastManager = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastManager must be used within a ToastProvider");
  }
  return context;
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [counter, setCounter] = useState(0);

  const showToast = (
    type: ToastType,
    title: string,
    message: string,
    duration = 3000
  ) => {
    const id = counter;
    setCounter((prev) => prev + 1);

    setToasts((prevToasts) => [
      ...prevToasts,
      { id, type, title, message, duration },
    ]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: number) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <FaCheck className="text-green-500" />;
      case "error":
        return <FaExclamationTriangle className="text-red-500" />;
      case "warning":
        return <FaExclamationTriangle className="text-yellow-500" />;
      case "info":
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getToastClassName = (type: ToastType) => {
    const baseClasses =
      "rounded-lg p-4 flex gap-3 items-start shadow-md mb-3 backdrop-blur-md";

    switch (type) {
      case "success":
        return `${baseClasses} bg-green-50 text-green-800 border border-green-200`;
      case "error":
        return `${baseClasses} bg-red-50 text-red-800 border border-red-200`;
      case "warning":
        return `${baseClasses} bg-yellow-50 text-yellow-800 border border-yellow-200`;
      case "info":
        return `${baseClasses} bg-blue-50 text-blue-800 border border-blue-200`;
      default:
        return baseClasses;
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col-reverse items-start">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={getToastClassName(toast.type)}
            onClick={() => removeToast(toast.id)}
            style={{ maxWidth: "320px", minWidth: "280px" }}
            role="alert"
          >
            <div className="pt-1">{getIcon(toast.type)}</div>
            <div className="flex-1">
              <div className="font-bold">{toast.title}</div>
              <div className="text-sm">{toast.message}</div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
