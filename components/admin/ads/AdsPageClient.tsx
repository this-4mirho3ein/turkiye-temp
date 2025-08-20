"use client";

import React, { useState, useEffect } from "react";
import {
  getAdminAds,
  getAdminCategories,
  getAdminPropertyTypes,
} from "@/controllers/makeRequest";
import AdCard from "./AdCard";
import AdFilters from "./AdFilters";
import AdsPagination from "./AdsPagination";
import { HiRefresh, HiViewGrid, HiViewList } from "react-icons/hi";

interface AdMedia {
  _id: string;
  fileName: string;
  size: number;
  fileType: string;
}

interface AdUser {
  _id: string;
  phone: string;
  firstName: string;
  lastName: string;
}

interface AdCategory {
  _id: string;
  name: string;
}

interface AdPropertyType {
  _id: string;
  type?: string;
  name?: string;
  enName?: string;
  slug?: string;
  row?: number;
  isActive?: boolean;
  adCount?: number;
}

interface Ad {
  _id: string;
  title: string;
  user: AdUser;
  status: string;
  media: AdMedia[];
  isActive: boolean;
  isDeleted: boolean;
  description: string;
  propertyType: AdPropertyType;
  category: AdCategory;
  createdAt: string;
  updatedAt: string;
  price?: number;
  saleOrRent: "sale" | "rent";
  address: {
    province: {
      _id: string;
      name: string;
    };
    city: {
      _id: string;
      name: string;
    };
    area: {
      _id: string;
      name: string;
    };
    fullAddress: string;
    location: {
      coordinates: [number, number];
    };
  };
  filters: Record<string, any>;
  flags: string[];
}

interface ApiFilters {
  propertyType?: string;
  category?: string;
  status?: string;
  isActive?: boolean;
  page: number;
  limit: number;
  sortField: "updatedAt" | "price" | "mortgage" | "rent" | "viewCount";
  sortOrder: 1 | -1;
}

const AdsPageClient: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categories, setCategories] = useState<AdCategory[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<AdPropertyType[]>([]);

  const [filters, setFilters] = useState<ApiFilters>({
    page: 1,
    limit: 12,
    sortField: "updatedAt",
    sortOrder: -1,
  });

  // Fetch ads data
  const fetchAds = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);


      const response = await getAdminAds(filters);

      if (response.success && response.data) {
        const adsData = response.data.ads || response.data.data || [];


        if (adsData.data && Array.isArray(adsData.data)) {
          setAds(adsData.data);
          setTotalCount(adsData.count || 0);
          setTotalPages(adsData.totalPages || 1);
        } else if (Array.isArray(adsData)) {
          setAds(adsData);
          setTotalCount(adsData.length);
          setTotalPages(1);
        } else {
          console.warn("⚠️ Unexpected ads response structure:", adsData);
          setAds([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      } else {
        setError(response.message || "خطا در دریافت آگهی‌ها");
        setAds([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (err: any) {
      console.error("❌ Error fetching ads:", err);
      setError(err.message || "خطا در دریافت آگهی‌ها");
      setAds([]);
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Fetch categories and property types for filters
  const fetchFilterData = async () => {
    try {
      const [categoriesResponse, propertyTypesResponse] = await Promise.all([
        getAdminCategories({ limit: 100 }),
        getAdminPropertyTypes({ limit: 100 }),
      ]);

      if (categoriesResponse && Array.isArray(categoriesResponse)) {
        setCategories(categoriesResponse);
      }


      // Handle the property types response with the confirmed structure
      if (propertyTypesResponse) {
        if (Array.isArray(propertyTypesResponse)) {
        
          setPropertyTypes(propertyTypesResponse);
        } else {
         

          // Use type assertion to help TypeScript understand the structure
          const typedResponse = propertyTypesResponse as {
            data?: {
              data?: AdPropertyType[];
            };
          };

          // Check if it has the nested data structure
          if (
            typedResponse.data &&
            typedResponse.data.data &&
            Array.isArray(typedResponse.data.data)
          ) {
            setPropertyTypes(typedResponse.data.data);
          } else {
            console.warn(
              "Unexpected property types structure:",
              propertyTypesResponse
            );
          }
        }
      }
    } catch (err) {
      console.error("❌ Error fetching filter data:", err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAds();
    fetchFilterData();
  }, []);

  // Fetch ads when filters change
  useEffect(() => {
    fetchAds();
  }, [filters]);

  const handleFilterChange = (key: keyof ApiFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset to page 1 when changing filters except page
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleRefresh = () => {
    fetchAds(true);
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sortField: "updatedAt",
      sortOrder: -1,
    });
  };

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    filters.propertyType ||
      filters.category ||
      filters.status ||
      filters.isActive !== undefined
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="mb-2 text-2xl font-bold text-gray-800">
                مدیریت آگهی‌ها
              </h1>
              <div className="flex items-center text-sm text-gray-500">
                <a
                  href="/admin"
                  className="transition-colors hover:text-purple-600"
                >
                  داشبورد
                </a>
                <span className="mx-2">/</span>
                <span className="text-purple-600">آگهی‌ها</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-l-lg transition-colors ${
                    viewMode === "grid"
                      ? "bg-purple-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <HiViewGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-r-lg transition-colors ${
                    viewMode === "list"
                      ? "bg-purple-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <HiViewList className="w-5 h-5" />
                </button>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiRefresh
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">بروزرسانی</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <AdFilters
          filters={filters}
          categories={categories}
          propertyTypes={propertyTypes}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600">
            {totalCount} آگهی {hasActiveFilters && "(فیلتر شده)"}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">تعداد در صفحه:</span>
            <select
              value={filters.limit}
              onChange={(e) =>
                handleFilterChange("limit", Number(e.target.value))
              }
              className="relative z-10 px-2 py-1 text-sm border border-gray-200 rounded"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-800 border border-red-200 rounded-lg bg-red-50">
            <p className="text-lg font-medium">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 mt-4 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              تلاش مجدد
            </button>
          </div>
        ) : ads.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              آگهی‌ای یافت نشد
            </h3>
            <p className="mb-4 text-gray-600">
              {hasActiveFilters
                ? "فیلترهای خود را تغییر دهید"
                : "هنوز آگهی‌ای ثبت نشده است"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-purple-600 hover:text-purple-700"
              >
                پاک کردن فیلترها
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Ads Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {ads.map((ad) => (
                <AdCard
                  key={ad._id}
                  ad={ad}
                  viewMode={viewMode}
                  onAdUpdated={fetchAds}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <AdsPagination
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdsPageClient;
