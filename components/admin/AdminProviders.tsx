"use client";

import { ToastProvider } from "@heroui/react";
import { ReactNode } from "react";

export default function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <ToastProvider />
      {children}
    </>
  );
}
