"use client";

import React, { useState, useEffect } from "react";
import { getAdminAgencies } from "@/controllers/makeRequest";
import AgencyCard from "./AgencyCard";
import AgencyListHeader from "./AgencyListHeader";
import Pagination from "@/components/admin/ui/Pagination";
import { Spinner } from "@/components/admin/ui/Spinner";
import Input from "@/components/admin/ui/Input";
import Button from "@/components/admin/ui/Button";
import Link from "next/link";
import {
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
  activeAdCount: number;
  logo?: {
    _id: string;
    fileName: string;
  };
}

interface AgenciesResponse {
  success: boolean;
  data: {
    data: Agency[];
    count: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  status: number;
  message?: string;
}

interface AgenciesPageClientProps {
  initialData?: AgenciesResponse;
}

// Filter interface to match the API endpoint parameters
interface AgencyFilters {
  name?: string;
  province?: string;
  city?: string;
  area?: string;
  isVerified?: boolean;
  isActive?: boolean;
  sortField?: string;
  sortOrder?: number;
}

const AgenciesPageClient: React.FC<AgenciesPageClientProps> = ({
  initialData,
}) => {
  const [agencies, setAgencies] = useState<Agency[]>(
    initialData?.data?.data || []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(
    initialData?.data?.page || 1
  );
  const [totalPages, setTotalPages] = useState<number>(
    initialData?.data?.totalPages || 1
  );
  const [totalCount, setTotalCount] = useState<number>(
    initialData?.data?.count || 0
  );
  const [limit, setLimit] = useState<number>(initialData?.data?.limit || 10);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Filter states
  const [filters, setFilters] = useState<AgencyFilters>({
    name: "",
    province: "",
    city: "",
    area: "",
    isVerified: undefined,
    isActive: undefined,
    sortField: "createdAt",
    sortOrder: -1,
  });

  // Add state for autocomplete options
  const [agencyNameQuery, setAgencyNameQuery] = useState("");
  const [provinceOptions, setProvinceOptions] = useState<any[]>([]);
  const [cityOptions, setCityOptions] = useState<any[]>([]);
  const [areaOptions, setAreaOptions] = useState<any[]>([]);
  const [provinceLoading, setProvinceLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);
  const [areaLoading, setAreaLoading] = useState(false);
  
  // Create a separate state for input values to implement debounce
  const [inputValues, setInputValues] = useState<AgencyFilters>({
    name: "",
    province: "",
    city: "",
    area: "",
    isVerified: undefined,
    isActive: undefined,
    sortField: "createdAt",
    sortOrder: -1,
  });
  
  // Debounce the name input value
// Custom hook for debouncing values
const useDebounce = (value: string | undefined, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value || "");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value || "");
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const debouncedNameValue = useDebounce(inputValues.name, 1000);

  const fetchAgencies = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Create params object with all filters
      const params: any = {
        page,
        limit,
        ...filters,
      };

      // Remove undefined or empty string values
      Object.keys(params).forEach((key) => {
        if (params[key] === undefined || params[key] === "") {
          delete params[key];
        }
      });

      const response = await getAdminAgencies(params);

      if (response.success && response.data) {
        setAgencies(response.data.data.data || []);
        setTotalPages(response.data.data.totalPages || 1);
        setTotalCount(response.data.data.count || 0);
      } else {
        setError(response.message || "Failed to fetch agencies");
        setAgencies([]);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching agencies");
      setAgencies([]);
    } finally {
      setLoading(false);
    }
  };

  // Apply debounced text input values to filters
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      name: debouncedNameValue
    }));
  }, [debouncedNameValue]);
  
  useEffect(() => {
    // Always fetch fresh data when component mounts
    fetchAgencies(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // Fetch provinces on mount
    setProvinceLoading(true);
    getAdminProvinces().then((data) => {
      setProvinceOptions(data);
      setProvinceLoading(false);
    });
  }, []);

  useEffect(() => {
    // Fetch cities when province changes
    if (filters.province) {
      setCityLoading(true);
      getAdminCities().then((data) => {
        // Filter cities by selected province
        setCityOptions(
          data.filter((city) => city.province === filters.province)
        );
        setCityLoading(false);
      });
    } else {
      setCityOptions([]);
      setFilters((prev) => ({ ...prev, city: "", area: "" }));
    }
  }, [filters.province]);

  useEffect(() => {
    // Fetch areas when city changes
    if (filters.city) {
      setAreaLoading(true);
      getAdminAreas().then((data) => {
        // Filter areas by selected city
        setAreaOptions(data.filter((area) => area.city === filters.city));
        setAreaLoading(false);
      });
    } else {
      setAreaOptions([]);
      setFilters((prev) => ({ ...prev, area: "" }));
    }
  }, [filters.city]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchAgencies(page);
  };

  const handleRefresh = () => {
    fetchAgencies(currentPage);
  };

  // Handle input changes (for debounce)
  const handleInputChange = (name: string, value: any) => {
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle filter changes for non-text inputs (no debounce needed)
  const handleFilterChange = (name: string, value: any) => {
    // Update both input values and filters for consistency
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setCurrentPage(1); // Reset to first page when applying filters
    fetchAgencies(1);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    // Reset both input values and filters
    const resetValues = {
      name: "",
      province: "",
      city: "",
      area: "",
      isVerified: undefined,
      isActive: undefined,
      sortField: "createdAt",
      sortOrder: -1,
    };
    
    setInputValues(resetValues);
    setFilters(resetValues);
  };

  // Filter section component
  const FilterSection = () => {
    if (!isFilterOpen) return null;

    return (
      <div
        className="bg-gray-50 p-4 mb-6 rounded-lg border border-gray-200"
        dir="rtl"
      >
        <h3 className="text-lg font-semibold mb-4">فیلتر آژانس‌ها</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {/* Agency Name Autocomplete */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              نام آژانس
            </label>
            <input
              list="agency-names"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="جستجو بر اساس نام"
              value={inputValues.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              dir="rtl"
            />
            <datalist id="agency-names">
              {agencies.map((agency) => (
                <option key={agency._id} value={agency.name} />
              ))}
            </datalist>
          </div>
          {/* Province Autocomplete */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              استان
            </label>
            <input
              list="province-list"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="نام استان"
              value={
                provinceOptions.find((p) => p._id === filters.province)?.name ||
                ""
              }
              onChange={(e) => {
                const selected = provinceOptions.find(
                  (p) => p.name === e.target.value
                );
                handleFilterChange("province", selected ? selected._id : "");
              }}
              dir="rtl"
            />
            <datalist id="province-list">
              {provinceOptions.map((province) => (
                <option key={province._id} value={province.name} />
              ))}
            </datalist>
          </div>
          {/* City Autocomplete */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              شهر
            </label>
            <input
              list="city-list"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="نام شهر"
              value={
                cityOptions.find((c) => c._id === filters.city)?.name || ""
              }
              onChange={(e) => {
                const selected = cityOptions.find(
                  (c) => c.name === e.target.value
                );
                handleFilterChange("city", selected ? selected._id : "");
              }}
              dir="rtl"
            />
            <datalist id="city-list">
              {cityOptions.map((city) => (
                <option key={city._id} value={city.name} />
              ))}
            </datalist>
          </div>
          {/* Area Autocomplete */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              منطقه
            </label>
            <input
              list="area-list"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="نام منطقه"
              value={
                areaOptions.find((a) => a._id === filters.area)?.name || ""
              }
              onChange={(e) => {
                const selected = areaOptions.find(
                  (a) => a.name === e.target.value
                );
                handleFilterChange("area", selected ? selected._id : "");
              }}
              dir="rtl"
            />
            <datalist id="area-list">
              {areaOptions.map((area) => (
                <option key={area._id} value={area.name} />
              ))}
            </datalist>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              وضعیت تأیید
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
            >
              <option value="">همه</option>
              <option value="true">تأیید شده</option>
              <option value="false">تأیید نشده</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              وضعیت فعالیت
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={
                filters.isActive === undefined ? "" : String(filters.isActive)
              }
              onChange={(e) => {
                const value = e.target.value;
                handleFilterChange(
                  "isActive",
                  value === "" ? undefined : value === "true"
                );
              }}
            >
              <option value="">همه</option>
              <option value="true">فعال</option>
              <option value="false">غیرفعال</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-0 space-x-reverse space-x-2">
          <Button
            size="sm"
            variant="bordered"
            color="danger"
            onPress={resetFilters}
            className="mx-1"
            startContent={<span className="ml-1">🗑️</span>}
          >
            پاک کردن فیلترها
          </Button>
          <Button
            size="sm"
            variant="solid"
            color="primary"
            onPress={applyFilters}
            className="mx-1"
            startContent={<span className="ml-1">✓</span>}
          >
            اعمال فیلترها
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <AgencyListHeader
        totalCount={totalCount}
        onRefresh={handleRefresh}
        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        isFilterActive={isFilterOpen}
      />

      <FilterSection />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center p-8 text-red-500">
          <p className="text-lg font-semibold">خطا</p>
          <p>{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      ) : agencies.length === 0 ? (
        <div className="text-center p-8 text-gray-500">
          <p className="text-lg font-semibold">آژانسی یافت نشد</p>
          <p>هیچ آژانسی در سیستم ثبت نشده است.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {agencies.map((agency) => (
            <Link
              key={agency._id}
              href={`/admin/agencies/${agency._id}`}
              tabIndex={0}
              aria-label={`مشاهده جزئیات آژانس ${agency.name}`}
              className="focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-xl cursor-pointer"
            >
              <AgencyCard agency={agency} />
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AgenciesPageClient;
