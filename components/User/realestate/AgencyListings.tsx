import React, { useState, useEffect } from "react";
import { Card, CardBody, Pagination, Spinner } from "@heroui/react";
import { Advertisements } from "@/components/Advertisement/AdvertisementsComponent";
import { Ads } from "@/types/interfaces";
import { getUserAds } from "@/controllers/makeRequest";
import { FiHome, FiFilter, FiGrid, FiList } from "react-icons/fi";

interface AgencyListingsProps {
  userData?: any;
}

export default function AgencyListings({ userData }: AgencyListingsProps) {
  const [data, setData] = useState<Ads[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const itemsPerPage = 10;

  // View mode state (grid or list)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchAgencyListings = async (page: number, filter: string = "all") => {
    try {
      setIsLoading(true);

      // When integrating with real API, you'll need to replace this with the actual API call
      // For now, we'll use getUserAds as a placeholder
      const response = await getUserAds(userData?.accessToken || "", page);

      if (response.status === 200 && response.data) {
        // Process data similarly to Dashboard component
        if (response.data.results && Array.isArray(response.data.results)) {
          // Filter the data based on activeFilter if needed
          let filteredData = response.data.results;
          if (filter !== "all") {
            filteredData = filteredData.filter((ad: any) =>
              filter === "sell"
                ? ad.transaction_type === "فروش"
                : ad.transaction_type === "اجاره"
            );
          }

          setData(filteredData);
          setTotalItems(filteredData.length);
          setTotalPages(Math.ceil(filteredData.length / itemsPerPage));
        } else if (response.data.data && Array.isArray(response.data.data)) {
          let filteredData = response.data.data;
          if (filter !== "all") {
            filteredData = filteredData.filter((ad: any) =>
              filter === "sell"
                ? ad.transaction_type === "فروش"
                : ad.transaction_type === "اجاره"
            );
          }

          setData(filteredData);
          setTotalItems(filteredData.length);
          setTotalPages(response.data.meta?.lastPage || 1);
        } else if (Array.isArray(response.data)) {
          let filteredData = response.data;
          if (filter !== "all") {
            filteredData = filteredData.filter((ad: any) =>
              filter === "sell"
                ? ad.transaction_type === "فروش"
                : ad.transaction_type === "اجاره"
            );
          }

          setData(filteredData);
          setTotalItems(filteredData.length);
          setTotalPages(1);
        } else {
          setData([]);
          setTotalItems(0);
          setTotalPages(1);
        }
        setError(null);
      } else {
        throw new Error("Failed to fetch agency listings");
      }
    } catch (err: any) {
      console.error("Error fetching agency listings:", err);
      if (err.status === 404) {
        setData([]);
        setTotalPages(1);
        setError(null);
      } else {
        const errorMessage =
          err?.data?.message || "Failed to fetch agency listings";
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgencyListings(currentPage, activeFilter);
  }, [currentPage, activeFilter, userData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-medium">املاک آژانس</h3>
        </div>
        <div className="flex w-full h-64 items-center justify-center">
          <Spinner size="lg" color="primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center border-b pb-4">
          <h3 className="text-lg font-medium">املاک آژانس</h3>
        </div>
        <div className="flex w-full h-64 items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-lg font-medium">املاک آژانس</h3>
        <div className="flex gap-2">
          <button className="px-3 py-2 bg-primary text-white rounded-md flex items-center gap-2 text-sm">
            <FiHome size={16} />
            ثبت ملک جدید
          </button>
        </div>
      </div>

      {/* Filters and View Mode */}
      <div className="flex justify-between items-center my-4">
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-3 py-1.5 text-xs rounded-md ${
              activeFilter === "all"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            همه
          </button>
          <button
            onClick={() => handleFilterChange("sell")}
            className={`px-3 py-1.5 text-xs rounded-md ${
              activeFilter === "sell"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            فروش
          </button>
          <button
            onClick={() => handleFilterChange("rent")}
            className={`px-3 py-1.5 text-xs rounded-md ${
              activeFilter === "rent"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            اجاره
          </button>
        </div>

        <div className="flex items-center">
          <span className="text-sm text-gray-500 ml-2">نمایش:</span>
          <div className="flex space-x-1 space-x-reverse">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid"
                  ? "bg-gray-200 text-gray-800"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              title="نمایش شبکه‌ای"
            >
              <FiGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list"
                  ? "bg-gray-200 text-gray-800"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
              title="نمایش لیستی"
            >
              <FiList size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Listings */}
      <Card>
        <CardBody>
          {data && Array.isArray(data) && data.length > 0 ? (
            <>
              <Advertisements
                ads={data}
                limit={itemsPerPage}
              />
              {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                  <Pagination
                    total={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              هیچ ملکی یافت نشد
            </div>
          )}
        </CardBody>
      </Card>

      {/* Summary at bottom */}
      {totalItems > 0 && (
        <div className="mt-4 text-sm text-gray-500 flex justify-between">
          <span>تعداد کل املاک: {totalItems}</span>
          <span>
            در حال نمایش صفحه {currentPage} از {totalPages}
          </span>
        </div>
      )}
    </div>
  );
}
