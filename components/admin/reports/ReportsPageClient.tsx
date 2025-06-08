"use client";

import React, { useState } from "react";
import { FaSync } from "react-icons/fa";
import ReportDataFetcher, { ReportData } from "./ReportDataFetcher";
import ReportsDetails from "./ReportsDetails";
import Button from "../ui/Button";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client with longer cache settings for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
      refetchOnWindowFocus: false,
    },
  },
});

// Inner component that uses React Query
function ReportsPageClientInner() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [forceRefresh, setForceRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle data loaded from the fetcher
  const handleDataLoaded = (data: ReportData) => {
    setReportData(data);
    setIsLoading(false);
    setForceRefresh(false); // Reset forceRefresh flag after data is loaded
  };

  // Function to refresh data
  const refreshData = () => {
    setIsLoading(true);
    setForceRefresh(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">گزارش‌های سیستم</h1>
        <Button
          variant="solid"
          color="primary"
          startContent={<FaSync className={isLoading ? "animate-spin" : ""} />}
          onPress={refreshData}
          isDisabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "در حال بروزرسانی..." : "بروزرسانی"}
        </Button>
      </div>

      {/* Data Fetcher */}
      <ReportDataFetcher
        onDataLoaded={handleDataLoaded}
        forceRefresh={forceRefresh}
      />

      {/* Detailed Reports */}
      {isLoading ? (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500 shadow-sm">
          در حال بارگذاری گزارش‌ها...
        </div>
      ) : reportData ? (
        <ReportsDetails data={reportData} />
      ) : (
        <div className="bg-white rounded-lg p-8 text-center text-gray-500 shadow-sm">
          هیچ داده‌ای برای نمایش وجود ندارد
        </div>
      )}
    </div>
  );
}

// Wrapper component that provides React Query context
const ReportsPageClient = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReportsPageClientInner />
    </QueryClientProvider>
  );
};

export default ReportsPageClient;
