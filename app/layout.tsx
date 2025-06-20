import localFont from "next/font/local";
import type { Metadata } from "next";
import "@/app/globals.css";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Providers from "@/components/Providers";

// const queryClient = new QueryClient();
export const metadata: Metadata = {
  title: "پنل مدیریت املاک",
  description: "سیستم مدیریت املاک و مسکن",
};

// Change to const (non-exported) to fix type issues
const iranYekanX = localFont({
  src: [
    { path: "/woff2/IRANYekanX-Thin.woff2", weight: "100", style: "normal" },
    {
      path: "/woff2/IRANYekanX-UltraLight.woff2",
      weight: "200",
      style: "normal",
    },
    { path: "/woff2/IRANYekanX-Light.woff2", weight: "300", style: "normal" },
    {
      path: "/woff2/IRANYekanX-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    { path: "/woff2/IRANYekanX-Medium.woff2", weight: "500", style: "normal" },
    {
      path: "/woff2/IRANYekanX-DemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    { path: "/woff2/IRANYekanX-Bold.woff2", weight: "700", style: "normal" },
    {
      path: "/woff2/IRANYekanX-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    { path: "/woff2/IRANYekanX-Black.woff2", weight: "900", style: "normal" },
    {
      path: "/woff2/IRANYekanX-ExtraBlack.woff2",
      weight: "950",
      style: "normal",
    },
  ],
  display: "swap", // Optimized rendering
  variable: "--font-iranyekanx", // Define a CSS variable for styling
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className={iranYekanX.variable}>
      <body className={`antialiased relative min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
