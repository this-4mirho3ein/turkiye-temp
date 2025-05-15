import { Metadata } from "next";
import Providers from "./providers";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/admin/ui/ToastProvider";

export const metadata: Metadata = {
  title: "پنل مدیریت | املاک ترکیه",
  description: "پنل مدیریت سیستم املاک ترکیه",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ToastProvider>
        <Providers>
          <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
        </Providers>
      </ToastProvider>
    </AuthProvider>
  );
}
