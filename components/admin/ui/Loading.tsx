"use client";

import { Spinner as HeroSpinner } from "@heroui/react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?:
    | "current"
    | "white"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  labelColor?:
    | "foreground"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  label?: string;
  className?: string;
  [key: string]: any;
}

export default function Spinner({
  size = "md",
  color = "primary",
  labelColor,
  label,
  className,
  ...props
}: SpinnerProps) {
  return (
    <HeroSpinner
      size={size}
      color={color}
      labelColor={labelColor}
      label={label}
      className={className}
      {...props}
    />
  );
}
