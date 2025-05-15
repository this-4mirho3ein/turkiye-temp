import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic import with SSR disabled for components with client-side functionality
const LoginContainer = dynamic(
  () => import("@/components/admin/login/LoginContainer"),
  {
    ssr: true,
  }
);

// Metadata for the page
export const metadata: Metadata = {
  title: "ورود به پنل مدیریت | املاک ترکیه",
  description: "ورود به پنل مدیریت وب سایت املاک ترکیه",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <LoginContainer />
    </Suspense>
  );
}

// Loading component
function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-default-500 font-medium rtl">در حال بارگذاری...</p>
      </div>
    </div>
  );
}
