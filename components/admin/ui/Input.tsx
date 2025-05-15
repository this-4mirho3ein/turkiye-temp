"use client";

import { Input as HeroInput } from "@heroui/react";
import { ReactNode } from "react";

export interface InputProps {
  type?: string;
  label?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  radius?: "none" | "sm" | "md" | "lg" | "full";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "warning"
    | "danger";
  variant?: "flat" | "bordered" | "underlined" | "faded";
  labelPlacement?: "inside" | "outside" | "outside-left";
  value?: string;
  defaultValue?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  description?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  autoComplete?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  [key: string]: any;
}

export default function Input({
  type = "text",
  label,
  placeholder,
  size,
  radius,
  color,
  variant,
  labelPlacement,
  value,
  defaultValue,
  startContent,
  endContent,
  description,
  errorMessage,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  autoComplete,
  onChange,
  onFocus,
  onBlur,
  className,
  ...props
}: InputProps) {
  return (
    <HeroInput
      type={type}
      label={label}
      placeholder={placeholder}
      size={size}
      radius={radius}
      color={color}
      variant={variant}
      labelPlacement={labelPlacement}
      value={value}
      defaultValue={defaultValue}
      startContent={startContent}
      endContent={endContent}
      description={description}
      errorMessage={errorMessage}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      autoComplete={autoComplete}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      className={className}
      {...props}
    />
  );
}
