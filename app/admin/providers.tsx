"use client";

import AdminProviders from "@/components/admin/AdminProviders";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>;
}
