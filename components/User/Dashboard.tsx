"use client";
import { Card, CardBody, Pagination, Spinner } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { Advertisements } from "@/components/Advertisement/AdvertisementsComponent";
import { Ads } from "@/types/interfaces";
import { getUserAds } from "@/controllers/makeRequest";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const [data, setData] = useState<Ads[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 15;
  const { state } = useAuth();

  const fetchAds = async (page: number) => {
    try {
      setIsLoading(true);
      console.log("Fetching user ads for page:", page);
      const response = await getUserAds(state.accessToken, page);
      console.log("Raw API response:", response);

      if (response.status === 200 && response.data) {
        console.log("Response data structure:", response.data);

        // Check for results array structure (like in Bookmarks)
        if (response.data.results && Array.isArray(response.data.results)) {
          console.log("Data found in response.data.results");
          setData(response.data.results);
          setTotalItems(response.data.count || response.data.results.length);
          setTotalPages(
            response.data.count
              ? Math.ceil(response.data.count / itemsPerPage)
              : 1
          );
          console.log(
            `Found ${response.data.results.length} items, total count: ${response.data.count}`
          );
        }
        // Check if response has nested data structure
        else if (response.data.data && Array.isArray(response.data.data)) {
          console.log("Data structure detected: response.data.data");
          setData(response.data.data);
          setTotalItems(response.data.data.length);
          setTotalPages(response.data.meta?.lastPage || 1);
        }
        // If data is directly in response.data and is an array
        else if (Array.isArray(response.data)) {
          console.log("Data structure detected: direct response.data array");
          setData(response.data);
          setTotalItems(response.data.length);
          setTotalPages(1); // Default to 1 page if meta is not available
        }
        // Fallback for unexpected structures
        else {
          console.log("Unexpected data structure, setting empty array");
          setData([]);
          setTotalItems(0);
          setTotalPages(1);
        }

        setError(null);
      } else {
        console.error(
          "Response status is not 200 or data is missing:",
          response
        );
        throw new Error("Failed to fetch advertisements");
      }
    } catch (err: any) {
      console.error("Error details:", err);
      // If it's a 404, treat it as empty data rather than an error
      if (err.status === 404) {
        console.log("Received 404 - setting empty data");
        setData([]);
        setTotalPages(1);
        setError(null);
      } else {
        const errorMessage =
          err?.data?.message || "Failed to fetch advertisements";
        console.error("Setting error message:", errorMessage);
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAds(currentPage);
  }, [currentPage, state.accessToken]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="col-span-12 lg:col-span-9 bg-white rounded-2xl shadow-md">
        <div className="p-4">
          <div className="flex w-full h-64 items-center justify-center">
            <Spinner size="lg" color="primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-12 lg:col-span-9 bg-white rounded-2xl shadow-md">
        <div className="p-4">
          <div className="flex w-full h-64 items-center justify-center text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 lg:col-span-9 bg-white rounded-2xl shadow-md">
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">آگهی های من</h2>
          {totalItems > 0 && (
            <span className="text-sm text-gray-500">
              {totalItems} آگهی یافت شد
            </span>
          )}
        </div>

        <Card>
          <CardBody>
            {data && Array.isArray(data) && data.length > 0 ? (
              <>
                <Advertisements ads={data} limit={itemsPerPage} />
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
                شما هنوز هیچ آگهی ثبت نکرده‌اید
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
