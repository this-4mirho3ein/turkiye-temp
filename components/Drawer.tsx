import { IoIosClose } from "react-icons/io";
import React, { useEffect } from "react";
import { Button } from "@heroui/react";

const Drawer = ({
  isOpen,
  onClose,
  title,
  component,
  children,
  actionButtonTitle,
  actionBottonClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  component?: React.ReactNode;
  actionButtonTitle?: string;
  actionBottonClick?: () => void;
  children: any;
}) => {
  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // Prevent background scroll
    } else {
      document.body.style.overflow = "auto"; // Enable background scroll when drawer is closed
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup in case of unmount
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 bg-white transition-transform duration-300 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b p-4 shadow-md">
        {component}
        <h6 className="text-md text-center font-medium text-gray-900">
          {title}
        </h6>
        <Button onPress={onClose} variant="light" color="danger" isIconOnly>
          <IoIosClose size={32} />
          <span className="sr-only">Close menu</span>
        </Button>
      </div>
      {/* Scrollable Content */}
      <div className="h-[calc(100vh-120px)] overflow-y-auto pb-20">
        {children}
      </div>
      {/* Fixed Bottom Buttons */}{" "}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg">
        {actionButtonTitle ? (
          <button
            className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
            onClick={actionBottonClick}
          >
            {actionButtonTitle}
          </button>
        ) : (
          <button
            className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
            onClick={onClose}
          >
            بستن
          </button>
        )}
      </div>
    </div>
  );
};

export default Drawer;
