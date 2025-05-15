"use client"; // Ensure this is a Client Component

import { ReactNode, useState } from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { AuthProvider, FiltersProvider } from "@/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavbarComponent from "./Navbar";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  // Split the pathname into parts
  const pathSegments = pathname.split("/").filter(Boolean); // Remove empty segments

  // Detect advertisement detail page
  const isAdvertisementDetail =
    pathSegments.length >= 3 &&
    /^[a-f0-9-]{36}$/.test(pathSegments[pathSegments.length - 1]);

    const isChatPage = pathname.startsWith("/chat");

  return (
    <HeroUIProvider>
      <ToastProvider />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <FiltersProvider>
            <div className="flex flex-col min-h-screen">
              {!isDashboard && <NavbarComponent />}
      

              <main className="flex-grow">{children}</main>

              {!isDashboard && !isChatPage && <Footer />}
            </div>
          </FiltersProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HeroUIProvider>
  );
}
