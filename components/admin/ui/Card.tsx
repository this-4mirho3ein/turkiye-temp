"use client";

import {
  Card as HeroCard,
  CardHeader,
  CardBody,
  CardFooter,
} from "@heroui/react";
import { ReactNode } from "react";
import React from "react";

// Re-export HeroUI components for direct use
export { CardHeader, CardBody, CardFooter };

export interface CardProps {
  children: ReactNode;
  isPressable?: boolean;
  isHoverable?: boolean;
  isBlurred?: boolean;
  isFooterBlurred?: boolean;
  shadow?: "sm" | "md" | "lg" | "none";
  radius?: "none" | "sm" | "md" | "lg";
  fullWidth?: boolean;
  disableAnimation?: boolean;
  className?: string;
  [key: string]: any;
}

export default function Card({
  children,
  isPressable,
  isHoverable,
  isBlurred,
  isFooterBlurred,
  shadow,
  radius,
  fullWidth,
  disableAnimation,
  className,
  ...props
}: CardProps) {
  // Convert children to array if it's not already an array
  const childrenArray = React.Children.toArray(children);

  return (
    <HeroCard
      isPressable={isPressable}
      isHoverable={isHoverable}
      isBlurred={isBlurred}
      isFooterBlurred={isFooterBlurred}
      shadow={shadow}
      radius={radius}
      fullWidth={fullWidth}
      disableAnimation={disableAnimation}
      className={className}
      {...props}
    >
      {childrenArray}
    </HeroCard>
  );
}
