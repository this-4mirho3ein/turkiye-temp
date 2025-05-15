import { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/admin/ui/ToastProvider";
import Providers from "../providers";

export const metadata: Metadata = {
  title: "ورود به پنل مدیریت | املاک ترکیه",
  description: "ورود به پنل مدیریت سیستم املاک ترکیه",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ToastProvider>
        <Providers>
          <div dir="rtl" className="rtl min-h-screen bg-background">
            {children}
          </div>
        </Providers>
      </ToastProvider>
    </AuthProvider>
  );
}
