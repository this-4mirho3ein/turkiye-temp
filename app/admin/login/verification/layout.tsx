import { Metadata } from "next";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/components/admin/ui/ToastProvider";
import Providers from "../../providers";

export const metadata: Metadata = {
  title: "تایید شماره موبایل | املاک ترکیه",
  description: "تایید شماره موبایل برای ورود به پنل مدیریت",
};

export default function VerificationLayout({
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
