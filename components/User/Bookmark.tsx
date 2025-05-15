"use client";
import { Card, CardBody, Spinner, Pagination } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { Advertisements } from "@/components/Advertisement/AdvertisementsComponent";
import { Ads } from "@/types/interfaces";
import { getUserBookmarks } from "@/controllers/makeRequest";
import { useAuth } from "@/context/AuthContext";

interface BookmarkResponse {
  data: Ads[];
  total_count: number;
  page: number;
  page_size: number;
}

interface ApiResponse {
  data: BookmarkResponse;
  status: number;
}

export default function Bookmark() {
  const [data, setData] = useState<Ads[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const { state } = useAuth();

  const fetchBookmarks = async (page: number) => {
    try {
      setIsLoading(true);
      console.log("Fetching bookmarks for page:", page);
      const response = await getUserBookmarks(state.accessToken, page);
      console.log("Raw bookmarks response:", response);

      if (response.status === 200 && response.data) {
        console.log("Bookmarks data structure:", response.data);

        // The actual API response structure has 'results' array instead of 'data'
        if (response.data.results && Array.isArray(response.data.results)) {
          console.log("Data found in response.data.results");
          setData(response.data.results);
          setTotalItems(response.data.count || response.data.results.length);
          setCurrentPage(page);

          // Calculate total pages from count and default page size
          const pageSize = 10; // Assuming default page size is 10
          setPageSize(pageSize);
          setTotalPages(
            response.data.count ? Math.ceil(response.data.count / pageSize) : 1
          );
          console.log(
            `Found ${response.data.results.length} items, total count: ${response.data.count}`
          );
        }
        // Keep the other checks as fallbacks
        else if (Array.isArray(response.data)) {
          console.log("Data is an array directly");
          setData(response.data);
          setTotalItems(response.data.length);
          setTotalPages(1);
          setPageSize(response.data.length);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          console.log("Data is in response.data.data");
          setData(response.data.data);
          setTotalItems(response.data.total_count || response.data.data.length);
          setCurrentPage(response.data.page || 1);
          setPageSize(response.data.page_size || 10);
          setTotalPages(
            response.data.total_count && response.data.page_size
              ? Math.ceil(response.data.total_count / response.data.page_size)
              : 1
          );
        } else {
          console.log("Unexpected data structure, setting empty array");
          setData([]);
          setTotalItems(0);
          setTotalPages(1);
        }

        setError(null);
      } else {
        console.error("Response error:", response);
        throw new Error("Failed to fetch bookmarks");
      }
    } catch (err: any) {
      console.error("Error fetching bookmarks:", err);
      setData([]);
      setTotalPages(1);
      setTotalItems(0);
      setError(err?.message || "Failed to fetch bookmarks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (state.accessToken) {
      fetchBookmarks(currentPage);
    }
  }, [currentPage, state.accessToken]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="col-span-12 lg:col-span-9">
        <div className="rounded-md bg-white p-4 shadow-base">
          <div className="flex w-full h-64 items-center justify-center">
            <Spinner size="lg" color="primary" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-12 lg:col-span-9">
        <div className="rounded-md bg-white p-4 shadow-base">
          <div className="flex w-full h-64 items-center justify-center text-red-500">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-12 lg:col-span-9">
      <div className="rounded-md bg-white p-4 shadow-base">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">آگهی‌های نشان شده</h2>
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
                <Advertisements ads={data} />
                {totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <Pagination
                      total={totalPages}
                      initialPage={currentPage}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      showControls
                      dir="ltr"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                شما هنوز هیچ آگهی را نشان نکرده‌اید
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
