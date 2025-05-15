"use client";

import {
  createContext,
  useContext,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import Toast, { ToastProps, ToastRef } from "./Toast";

interface ToastContextType {
  showToast: (props: ToastProps) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toastRef = useRef<ToastRef>(null);

  const showToast = useCallback((props: ToastProps) => {
    if (toastRef.current) {
      toastRef.current.show(props);
    }
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast ref={toastRef} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
