"use client";

import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  FiX,
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";

type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

export interface ToastRef {
  show: (props: ToastProps) => void;
  hide: () => void;
}

const Toast = forwardRef<ToastRef>((_, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState<ToastType>("info");
  const [duration, setDuration] = useState(3000); // Default 3 seconds
  const [onClose, setOnClose] = useState<(() => void) | undefined>(undefined);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    setPortalContainer(document.body);

    return () => {
      if (portalContainer) {
        document.body.removeChild(portalContainer);
      }
    };
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isVisible && duration) {
      timeoutId = setTimeout(() => {
        hide();
      }, duration);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVisible, duration]);

  const show = ({
    message,
    type = "info",
    duration = 3000,
    onClose,
  }: ToastProps) => {
    setMessage(message);
    setType(type);
    setDuration(duration);
    setOnClose(() => onClose);
    setIsVisible(true);
  };

  const hide = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  const getIcon = (): ReactNode => {
    switch (type) {
      case "success":
        return <FiCheckCircle className="w-5 h-5 text-success-500" />;
      case "error":
        return <FiAlertCircle className="w-5 h-5 text-danger-500" />;
      case "warning":
        return <FiAlertTriangle className="w-5 h-5 text-warning-500" />;
      case "info":
      default:
        return <FiInfo className="w-5 h-5 text-primary-500" />;
    }
  };

  const getBgColor = (): string => {
    switch (type) {
      case "success":
        return "bg-success-50 border-success-200";
      case "error":
        return "bg-danger-50 border-danger-200";
      case "warning":
        return "bg-warning-50 border-warning-200";
      case "info":
      default:
        return "bg-primary-50 border-primary-200";
    }
  };

  if (!portalContainer || !isVisible) return null;

  return createPortal(
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div
        className={`flex items-center justify-between p-4 rounded-lg shadow-md border ${getBgColor()} animate-fade-in`}
        role="alert"
      >
        <div className="flex items-center">
          {getIcon()}
          <p className="mr-3 text-sm text-gray-800">{message}</p>
        </div>
        <button
          onClick={hide}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <FiX className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>,
    portalContainer
  );
});

Toast.displayName = "Toast";

export default Toast;
