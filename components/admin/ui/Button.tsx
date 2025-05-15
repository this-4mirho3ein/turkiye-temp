"use client";

import { Button as HeroButton } from "@heroui/react";
import { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "danger";
  variant?:
    | "solid"
    | "bordered"
    | "light"
    | "flat"
    | "faded"
    | "shadow"
    | "ghost";
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  fullWidth?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onPress?: () => void;
  className?: string;
  [key: string]: any;
}

export default function Button({
  children,
  color = "primary",
  variant = "solid",
  size = "md",
  radius,
  fullWidth,
  isLoading,
  isDisabled,
  startContent,
  endContent,
  onPress,
  className,
  ...props
}: ButtonProps) {
  return (
    <HeroButton
      color={color}
      variant={variant}
      size={size}
      radius={radius}
      fullWidth={fullWidth}
      isLoading={isLoading}
      isDisabled={isDisabled}
      startContent={startContent}
      endContent={endContent}
      onPress={onPress}
      className={className}
      {...props}
    >
      {children}
    </HeroButton>
  );
}
