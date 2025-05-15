"use client";

import {
  Dropdown as HeroDropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@heroui/react";
import { ReactNode } from "react";
import React from "react";

// Re-export HeroUI components for direct use
export { DropdownTrigger, DropdownMenu, DropdownItem, DropdownSection };

export interface DropdownProps {
  children: ReactNode;
  placement?:
    | "bottom"
    | "bottom-start"
    | "bottom-end"
    | "top"
    | "top-start"
    | "top-end";
  offset?: number;
  backdrop?: "blur" | "transparent" | "opaque";
  isDisabled?: boolean;
  shouldCloseOnBlur?: boolean;
  className?: string;
  [key: string]: any;
}

export default function Dropdown({
  children,
  placement,
  offset,
  backdrop,
  isDisabled,
  shouldCloseOnBlur,
  className,
  ...props
}: DropdownProps) {
  // Convert children to array if it's not already an array
  const childrenArray = React.Children.toArray(children);

  return (
    <HeroDropdown
      placement={placement}
      offset={offset}
      backdrop={backdrop}
      isDisabled={isDisabled}
      shouldCloseOnBlur={shouldCloseOnBlur}
      className={className}
      {...props}
    >
      {childrenArray}
    </HeroDropdown>
  );
}
