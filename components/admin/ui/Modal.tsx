"use client";

import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { ReactNode } from "react";

// Re-export HeroUI components for direct use
export { ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure };

export interface ModalProps {
  children: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  placement?: "center" | "top" | "bottom" | "auto";
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
  radius?: "none" | "sm" | "md" | "lg";
  backdrop?: "transparent" | "blur" | "opaque";
  scrollBehavior?: "normal" | "inside" | "outside";
  hideCloseButton?: boolean;
  isDismissable?: boolean;
  isKeyboardDismissDisabled?: boolean;
  shouldBlockScroll?: boolean;
  className?: string;
  [key: string]: any;
}

export default function Modal({
  children,
  isOpen,
  onOpenChange,
  placement,
  size,
  radius,
  backdrop,
  scrollBehavior,
  hideCloseButton,
  isDismissable,
  isKeyboardDismissDisabled,
  shouldBlockScroll,
  className,
  ...props
}: ModalProps) {
  return (
    <HeroModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement={placement}
      size={size}
      radius={radius}
      backdrop={backdrop}
      scrollBehavior={scrollBehavior}
      hideCloseButton={hideCloseButton}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
      shouldBlockScroll={shouldBlockScroll}
      className={className}
      {...props}
    >
      {children}
    </HeroModal>
  );
}
