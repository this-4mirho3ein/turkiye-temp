"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  HiPlus,
  HiSearch,
  HiFilter,
  HiRefresh,
  HiChevronDown,
  HiX,
} from "react-icons/hi";
import AgencyCard from "./AgencyCard";
import CreateAgencyModal from "./CreateAgencyModal";
import EditAgencyModal from "./EditAgencyModal";
import {
  getAdminAgencies,
  getAdminProvinces,
  getAdminCities,
  getAdminAreas,
} from "@/controllers/makeRequest";

interface Agency {
  _id: string;
  name: string;
  phone: string;
  owner: {
    _id: string;
    phone: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  consultants: any[];
  areaAdmins: any[];
  adQuota: number;
  isActive: boolean;
  isVerified: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
  activeAdCount?: number;
  logo?: {
    _id: string;
    fileName: string;
  };
  address?: {
    country?: string;
    province?: string;
    city?: string;
    area?: string;
    fullAddress?: string;
  };
}

interface ApiFilters {
  name?: string;
  province?: string;
  city?: string;
  area?: string;
  isVerified?: boolean;
  page: number;
  limit: number;
  sortField: "createdAt" | "updatedAt" | "name" | "adQuota";
  sortOrder: 1 | -1;
}

const AgenciesPageClient: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Location data for dropdowns
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  // API Filter states
  const [filters, setFilters] = useState<ApiFilters>({
    name: "",
    province: "",
    city: "",
    area: "",
    isVerified: undefined,
    page: 1,
    limit: 10,
    sortField: "createdAt",
    sortOrder: -1,
  });

  // Pagination
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Helper functions to get display names for filters
  const getProvinceName = (provinceId: string) => {
    const province = provinces.find((p) => p._id === provinceId);
    return province ? province.name : provinceId;
  };

  const getCityName = (cityId: string) => {
    const city = cities.find((c) => c._id === cityId);
    return city ? city.name : cityId;
  };

  const getAreaName = (areaId: string) => {
    const area = areas.find((a) => a._id === areaId);
    return area ? area.name : areaId;
  };

  // Fetch location data for dropdowns
  const fetchLocationData = useCallback(async () => {
    try {
      setLoadingLocations(true);
      console.log("🌍 Fetching location data...");

      const [provincesRes, citiesRes, areasRes] = await Promise.all([
        getAdminProvinces({ limit: 100 }),
        getAdminCities({ limit: 100 }),
        getAdminAreas({ limit: 100 }),
      ]);

      console.log("🌍 Provinces:", provincesRes);
      console.log("🌍 Cities:", citiesRes);
      console.log("🌍 Areas:", areasRes);

      setProvinces(Array.isArray(provincesRes) ? provincesRes : []);
      setCities(Array.isArray(citiesRes) ? citiesRes : []);
      setAreas(Array.isArray(areasRes) ? areasRes : []);
    } catch (error) {
      console.error("❌ Error fetching location data:", error);
    } finally {
      setLoadingLocations(false);
    }
  }, []);

  const fetchAgencies = useCallback(
    async (newFilters?: Partial<ApiFilters>) => {
      try {
        setLoading(true);
        setError(null);

        const currentFilters = { ...filters, ...newFilters };

        // Clean up empty string values for API
        const apiParams: any = {
          page: currentFilters.page,
          limit: currentFilters.limit,
          sortField: currentFilters.sortField,
          sortOrder: currentFilters.sortOrder,
        };

        if (currentFilters.name && currentFilters.name.trim()) {
          apiParams.name = currentFilters.name.trim();
        }
        if (currentFilters.province && currentFilters.province.trim()) {
          apiParams.province = currentFilters.province.trim();
        }
        if (currentFilters.city && currentFilters.city.trim()) {
          apiParams.city = currentFilters.city.trim();
        }
        if (currentFilters.area && currentFilters.area.trim()) {
          apiParams.area = currentFilters.area.trim();
        }
        if (currentFilters.isVerified !== undefined) {
          apiParams.isVerified = currentFilters.isVerified;
        }

        console.log("🔍 API Request params:", apiParams);

        const response = await getAdminAgencies(apiParams);
        console.log("🏢 Full API Response:", JSON.stringify(response, null, 2));

        if (response.success && response.data) {
          let agenciesData: Agency[] = [];
          let pagination = { totalPages: 1, count: 0 };

          // Based on your API response structure: response.data.data.data
          if (
            response.data.data &&
            response.data.data.data &&
            Array.isArray(response.data.data.data)
          ) {
            console.log("📋 Found agencies in response.data.data.data");
            agenciesData = response.data.data.data;
            pagination = {
              totalPages: response.data.data.totalPages || 1,
              count: response.data.data.count || agenciesData.length,
            };
          }
          // Fallback: Check if response.data.data is directly an array
          else if (response.data.data && Array.isArray(response.data.data)) {
            console.log(
              "📋 Found agencies in response.data.data (direct array)"
            );
            agenciesData = response.data.data;
            pagination = {
              totalPages: response.data.totalPages || 1,
              count: response.data.count || agenciesData.length,
            };
          }
          // Another fallback: Check if response.data is directly an array
          else if (Array.isArray(response.data)) {
            console.log("📋 Found agencies in response.data (direct array)");
            agenciesData = response.data;
            pagination = { totalPages: 1, count: agenciesData.length };
          }

          console.log("📋 Final agencies data:", agenciesData);
          console.log("📋 Agencies count:", agenciesData.length);
          console.log("📋 Pagination:", pagination);

          // Set the data
          setAgencies(agenciesData);
          setTotalPages(pagination.totalPages);
          setTotalCount(pagination.count);

          // Update filters state
          setFilters(currentFilters);

          if (agenciesData.length === 0) {
            console.log("⚠️ No agencies found in response");
          } else {
            console.log(
              `✅ Successfully loaded ${agenciesData.length} agencies`
            );
          }
        } else {
          console.error("❌ API returned success: false or no data");
          setError(response.message || "خطا در دریافت لیست آژانس‌ها");
          setAgencies([]);
        }
      } catch (err: any) {
        console.error("❌ Error fetching agencies:", err);
        setError(err.message || "خطا در دریافت لیست آژانس‌ها");
        setAgencies([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    console.log("🚀 Component mounted, fetching agencies and location data...");
    fetchAgencies();
    fetchLocationData();
  }, []);

  const handleFilterChange = (key: keyof ApiFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    fetchAgencies(newFilters);
  };

  const handlePageChange = (page: number) => {
    fetchAgencies({ page });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAgencies();
  };

  const handleCreateAgency = () => {
    setShowCreateModal(true);
  };

  const handleEditAgency = (agency: Agency) => {
    setEditingAgency(agency);
    setShowEditModal(true);
  };

  const handleDeleteAgency = useCallback((agencyId: string) => {
    setAgencies((prev) => {
      const prevArray = Array.isArray(prev) ? prev : [];
      return prevArray.filter((agency) => agency._id !== agencyId);
    });
  }, []);

  const handleAgencyCreated = () => {
    setShowCreateModal(false);
    fetchAgencies();
  };

  const handleAgencyUpdated = () => {
    setShowEditModal(false);
    setEditingAgency(null);
    fetchAgencies();
  };

  const clearFilters = () => {
    const resetFilters = {
      name: "",
      province: "",
      city: "",
      area: "",
      isVerified: undefined,
      page: 1,
      limit: 10,
      sortField: "createdAt" as const,
      sortOrder: -1 as const,
    };
    fetchAgencies(resetFilters);
  };

  const hasActiveFilters =
    filters.name ||
    filters.province ||
    filters.city ||
    filters.area ||
    filters.isVerified !== undefined;

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-64"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            خطا در بارگذاری
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">آژانس‌ها</h1>
          <button
            onClick={handleCreateAgency}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <HiPlus className="w-4 h-4" />
            جدید
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <HiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                showFilters || hasActiveFilters
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <HiFilter className="w-4 h-4" />
              فیلتر
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
              <HiChevronDown
                className={`w-4 h-4 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
            >
              <HiRefresh
                className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              بروزرسانی
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    استان
                  </label>
                  <select
                    value={filters.province}
                    onChange={(e) =>
                      handleFilterChange("province", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loadingLocations}
                  >
                    <option value="">همه استان‌ها</option>
                    {provinces.map((province) => (
                      <option key={province._id} value={province._id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شهر
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange("city", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loadingLocations}
                  >
                    <option value="">همه شهرها</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    منطقه
                  </label>
                  <select
                    value={filters.area}
                    onChange={(e) => handleFilterChange("area", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={loadingLocations}
                  >
                    <option value="">همه مناطق</option>
                    {areas.map((area) => (
                      <option key={area._id} value={area._id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    وضعیت تایید
                  </label>
                  <select
                    value={
                      filters.isVerified === undefined
                        ? ""
                        : String(filters.isVerified)
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange(
                        "isVerified",
                        value === "" ? undefined : value === "true"
                      );
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">همه</option>
                    <option value="true">تایید شده</option>
                    <option value="false">تایید نشده</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      مرتب‌سازی
                    </label>
                    <select
                      value={filters.sortField}
                      onChange={(e) =>
                        handleFilterChange("sortField", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="createdAt">تاریخ ایجاد</option>
                      <option value="updatedAt">تاریخ بروزرسانی</option>
                      <option value="name">نام</option>
                      <option value="adQuota">سقف آگهی</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ترتیب
                    </label>
                    <select
                      value={filters.sortOrder}
                      onChange={(e) =>
                        handleFilterChange("sortOrder", Number(e.target.value))
                      }
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={-1}>نزولی</option>
                      <option value={1}>صعودی</option>
                    </select>
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    <HiX className="w-4 h-4" />
                    پاک کردن
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">{totalCount} آژانس</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">تعداد در صفحه:</span>
            <select
              value={filters.limit}
              onChange={(e) =>
                handleFilterChange("limit", Number(e.target.value))
              }
              className="px-2 py-1 border border-gray-200 rounded text-sm"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Agencies Grid */}
        {agencies.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              آژانسی یافت نشد
            </h3>
            <p className="text-gray-600 mb-4">
              {hasActiveFilters
                ? "فیلترهای خود را تغییر دهید"
                : "اولین آژانس را ایجاد کنید"}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700"
              >
                پاک کردن فیلترها
              </button>
            ) : (
              <button
                onClick={handleCreateAgency}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                ایجاد آژانس
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agencies.map((agency) => (
              <AgencyCard
                key={agency._id}
                agency={agency}
                onEdit={handleEditAgency}
                onDelete={handleDeleteAgency}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page <= 1}
              className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              قبلی
            </button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg ${
                      filters.page === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page >= totalPages}
              className="px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              بعدی
            </button>
          </div>
        )}

        {/* Modals */}
        {showCreateModal && (
          <CreateAgencyModal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onSuccess={handleAgencyCreated}
          />
        )}

        {showEditModal && editingAgency && (
          <EditAgencyModal
            isOpen={showEditModal}
            agency={editingAgency}
            onClose={() => {
              setShowEditModal(false);
              setEditingAgency(null);
            }}
            onSuccess={handleAgencyUpdated}
          />
        )}

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm text-gray-600">فیلترهای فعال:</span>
            {filters.name && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                نام: {filters.name}
                <button
                  onClick={() => handleFilterChange("name", "")}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <HiX className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.province && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                استان: {getProvinceName(filters.province)}
                <button
                  onClick={() => handleFilterChange("province", "")}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <HiX className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.city && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                شهر: {getCityName(filters.city)}
                <button
                  onClick={() => handleFilterChange("city", "")}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <HiX className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.area && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                منطقه: {getAreaName(filters.area)}
                <button
                  onClick={() => handleFilterChange("area", "")}
                  className="hover:bg-orange-200 rounded-full p-0.5"
                >
                  <HiX className="w-3 h-3" />
                </button>
              </span>
            )}
            {filters.isVerified !== undefined && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                وضعیت: {filters.isVerified ? "تایید شده" : "تایید نشده"}
                <button
                  onClick={() => handleFilterChange("isVerified", undefined)}
                  className="hover:bg-yellow-200 rounded-full p-0.5"
                >
                  <HiX className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgenciesPageClient;
