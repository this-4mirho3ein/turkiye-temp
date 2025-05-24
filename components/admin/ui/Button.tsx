"use client";

import { Button as HeroButton } from "@heroui/react";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export interface ButtonProps {
  children: ReactNode;
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
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

// Generate color styles using Tailwind classes based on the project's color scheme
const generateColorStyles = () => {
  return {
    default: {
      solid: "bg-gray-500 hover:bg-gray-600 text-white shadow-md hover:shadow-lg",
      bordered: "border-gray-500 text-gray-700 hover:bg-gray-100",
      light: "bg-gray-200 text-gray-700 hover:bg-gray-300",
      ghost: "text-gray-700 hover:bg-gray-100",
    },
    primary: {
      solid: "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg",
      bordered: "border-primary text-primary hover:bg-primary/10",
      light: "bg-primary/20 text-primary hover:bg-primary/30",
      ghost: "text-primary hover:bg-primary/10",
    },
    secondary: {
      solid: "bg-secondary hover:bg-secondary/90 text-white shadow-md hover:shadow-lg",
      bordered: "border-secondary text-secondary hover:bg-secondary/10",
      light: "bg-secondary/20 text-secondary-bronze hover:bg-secondary/30",
      ghost: "text-secondary hover:bg-secondary/10",
    },
    success: {
      solid: "bg-button hover:bg-button/90 text-white shadow-md hover:shadow-lg",
      bordered: "border-button text-button hover:bg-button/10",
      light: "bg-button/20 text-button hover:bg-button/30",
      ghost: "text-button hover:bg-button/10",
    },
    warning: {
      solid: "bg-secondary-bronze hover:bg-secondary-bronze/90 text-white shadow-md hover:shadow-lg",
      bordered: "border-secondary-bronze text-secondary-bronze hover:bg-secondary-bronze/10",
      light: "bg-secondary-bronze/20 text-secondary-bronze hover:bg-secondary-bronze/30",
      ghost: "text-secondary-bronze hover:bg-secondary-bronze/10",
    },
    danger: {
      solid: "bg-error hover:bg-error/90 text-white shadow-md hover:shadow-lg",
      bordered: "border-error text-error hover:bg-error/10",
      light: "bg-error/20 text-error hover:bg-error/30",
      ghost: "text-error hover:bg-error/10",
    }
  };
};

// Tailwind classes for button variants with improved transitions
const variantClasses = {
  solid: "transition-all duration-200 ease-in-out font-medium",
  bordered: "border-2 transition-all duration-200 ease-in-out font-medium",
  light: "transition-all duration-200 ease-in-out font-medium",
  ghost: "transition-all duration-200 ease-in-out font-medium",
  flat: "transition-all duration-200 ease-in-out font-medium",
  faded: "opacity-80 hover:opacity-100 transition-all duration-200 ease-in-out font-medium",
  shadow: "shadow-md hover:shadow-lg transition-all duration-200 ease-in-out font-medium",
};

// Tailwind classes for button sizes with improved spacing
const sizeClasses = {
  sm: "text-xs px-3 py-1.5 rounded space-x-1",
  md: "text-sm px-4 py-2 rounded-md space-x-1.5",
  lg: "text-base px-5 py-2.5 rounded-lg space-x-2",
  xl: "text-lg px-6 py-3 rounded-xl space-x-2.5",
};

// Tailwind classes for button radius
const radiusClasses = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export default function Button({
  children,
  color = "primary",
  variant = "solid",
  size = "md",
  radius = "md",
  fullWidth,
  isLoading,
  isDisabled,
  startContent,
  endContent,
  onPress,
  className,
  ...props
}: ButtonProps) {
  // Get variant class
  const variantClass = variantClasses[variant] || "";
  
  // Get size class
  const sizeClass = sizeClasses[size] || "";
  
  // Get radius class
  const radiusClass = radiusClasses[radius] || "";
  
  // Get color styles from theme
  const colorStyles = generateColorStyles();
  const colorClass = variant !== "faded" && variant !== "flat" && variant !== "shadow" 
    ? colorStyles[color]?.[variant] || ""
    : "";
  
  // Map our custom color to HeroUI color if needed
  // HeroUI Button accepts: "default" | "primary" | "secondary" | "success" | "warning" | "danger"
  // Our Button accepts: "default" | "primary" | "secondary" | "success" | "warning" | "danger"
  // So we can pass the color directly
  
  return (
    <HeroButton
      // Only pass the color if it's one of the allowed values
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
      className={twMerge(
        variantClass,
        sizeClass,
        radiusClass,
        colorClass,
        fullWidth && "w-full",
        isDisabled && "opacity-60 cursor-not-allowed",
        isLoading && "cursor-wait",
        className
      )}
      {...props}
    >
      {children}
    </HeroButton>
  );
}
