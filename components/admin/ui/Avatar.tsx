"use client";

import { Avatar as HeroAvatar, AvatarGroup, AvatarIcon } from "@heroui/react";
import { ReactNode } from "react";

// Re-export HeroUI components for direct use
export { AvatarGroup, AvatarIcon };

export interface AvatarProps {
  src?: string;
  name?: string;
  icon?: ReactNode;
  showFallback?: boolean;
  alt?: string;
  size?: "sm" | "md" | "lg";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  isBordered?: boolean;
  isDisabled?: boolean;
  isFocusable?: boolean;
  className?: string;
  [key: string]: any;
}

export default function Avatar({
  src,
  name,
  icon,
  showFallback,
  alt,
  size = "md",
  color,
  radius = "full",
  isBordered,
  isDisabled,
  isFocusable,
  className,
  ...props
}: AvatarProps) {
  return (
    <HeroAvatar
      src={src}
      name={name}
      icon={icon}
      showFallback={showFallback}
      alt={alt}
      size={size}
      color={color}
      radius={radius}
      isBordered={isBordered}
      isDisabled={isDisabled}
      isFocusable={isFocusable}
      className={className}
      {...props}
    />
  );
}
