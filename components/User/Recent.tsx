"use client";
import { Card, CardBody, Spinner, Pagination } from "@heroui/react";
import React, { useState, useEffect } from "react";
import { Advertisements } from "@/components/Advertisement/AdvertisementsComponent";
import { Ads } from "@/types/interfaces";
import { getLastViewed } from "@/controllers/makeRequest";
import { useAuth } from "@/context/AuthContext";

interface RecentResponse {
  data: Ads[];
  total_count: number;
  page: number;
  page_size: number;
}

interface ApiResponse {
  data: RecentResponse;
  status: number;
}

export default function Recent() {
  const [data, setData] = useState<Ads[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  const { state } = useAuth();

  const fetchRecentlyViewed = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getLastViewed(state.accessToken, page);

      if (response.status === 200 && response.data) {
        setData(response.data.data);
        setTotalItems(response.data.total_count);
        setCurrentPage(response.data.page);
        setPageSize(response.data.page_size);
        setTotalPages(
          Math.ceil(response.data.total_count / response.data.page_size)
        );
        setError(null);
      } else {
        throw new Error("Failed to fetch recently viewed items");
      }
    } catch (err: any) {
      setData([]);
      setTotalPages(1);
      setTotalItems(0);
      setError(err?.message || "Failed to fetch recently viewed items");
      console.error("Error fetching recently viewed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (state.accessToken) {
      fetchRecentlyViewed(currentPage);
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
          <h2 className="text-xl font-semibold">آگهی‌های دیده شده اخیر</h2>
          {totalItems > 0 && (
            <span className="text-sm text-gray-500">
              {totalItems} آگهی یافت شد
            </span>
          )}
        </div>
        <Card>
          <CardBody>
            {data?.length > 0 ? (
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
                شما هنوز هیچ آگهی را مشاهده نکرده‌اید
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
