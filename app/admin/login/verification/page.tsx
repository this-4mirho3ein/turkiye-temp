import { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamic import with SSR enabled
const VerificationContainer = dynamic(
  () => import("@/components/admin/login/verification/VerificationContainer"),
  {
    ssr: true,
  }
);

// Metadata for the page
export const metadata: Metadata = {
  title: "تایید شماره موبایل | املاک ترکیه",
  description: "تایید شماره موبایل برای ورود به پنل مدیریت",
};

export default function VerificationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <VerificationContainer />
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
