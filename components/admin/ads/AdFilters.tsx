"use client";

import React, { useState } from "react";
import { HiFilter, HiX, HiChevronDown } from "react-icons/hi";

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

interface ApiFilters {
  propertyType?: string;
  category?: string;
  status?: string;
  isActive?: boolean;
  page: number;
  limit: number;
  sortField: "createdAt" | "updatedAt" | "title" | "price";
  sortOrder: 1 | -1;
}

interface AdFiltersProps {
  filters: ApiFilters;
  categories: AdCategory[];
  propertyTypes: AdPropertyType[];
  onFilterChange: (key: keyof ApiFilters, value: any) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

const AdFilters: React.FC<AdFiltersProps> = ({
  filters,
  categories,
  propertyTypes,
  onFilterChange,
  onClearFilters,
  hasActiveFilters,
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Status options
  const statusOptions = [
    { value: "confirmed", label: "تایید شده" },
    { value: "pending", label: "در انتظار تایید" },
    { value: "rejected", label: "تایید نشده" },
    { value: "draft", label: "پیش‌نویس" },
  ];

  // Active status options
  const activeOptions = [
    { value: true, label: "فعال" },
    { value: false, label: "غیرفعال" },
  ];

  // Sort options
  const sortOptions = [
    { field: "createdAt", order: -1, label: "جدیدترین" },
    { field: "createdAt", order: 1, label: "قدیمی‌ترین" },
    { field: "price", order: -1, label: "گران‌ترین" },
    { field: "price", order: 1, label: "ارزان‌ترین" },
    { field: "title", order: 1, label: "عنوان (الفبا)" },
  ];

  // Helper to get current sort option label
  const getCurrentSortLabel = () => {
    const currentSort = sortOptions.find(
      (option) =>
        option.field === filters.sortField && option.order === filters.sortOrder
    );
    return currentSort ? currentSort.label : "جدیدترین";
  };

  return (
    <div className="mb-6">
      {/* Filters toggle button (mobile) */}
      <div className="flex items-center justify-between mb-4 md:hidden">
        <button
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          <HiFilter className="w-4 h-4" />
          فیلترها {hasActiveFilters && "(فعال)"}
        </button>

        {/* Sort dropdown (mobile) */}
        <div className="relative inline-block">
          <select
            value={`${filters.sortField}_${filters.sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("_");
              onFilterChange(
                "sortField",
                field as "createdAt" | "updatedAt" | "title" | "price"
              );
              onFilterChange("sortOrder", parseInt(order) as 1 | -1);
            }}
            className="relative z-10 py-2 pl-8 pr-3 text-sm bg-white border border-gray-200 rounded-lg appearance-none"
          >
            {sortOptions.map((option) => (
              <option
                key={`${option.field}_${option.order}`}
                value={`${option.field}_${option.order}`}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <HiChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Filters panel */}
      <div
        className={`bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 ${
          isFiltersOpen || !hasActiveFilters
            ? "max-h-[2000px]"
            : "max-h-0 border-0 md:max-h-[2000px] md:border"
        }`}
      >
        <div className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-medium text-gray-900">فیلترها</h3>

            {/* Desktop sorting */}
            <div className="items-center hidden gap-3 md:flex">
              <span className="text-sm text-gray-600">مرتب‌سازی:</span>
              <div className="relative inline-block">
                <select
                  value={`${filters.sortField}_${filters.sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split("_");
                    onFilterChange(
                      "sortField",
                      field as "createdAt" | "updatedAt" | "title" | "price"
                    );
                    onFilterChange("sortOrder", parseInt(order) as 1 | -1);
                  }}
                  className="relative z-10 py-2 pl-8 pr-3 text-sm bg-white border border-gray-200 rounded-lg appearance-none"
                >
                  {sortOptions.map((option) => (
                    <option
                      key={`${option.field}_${option.order}`}
                      value={`${option.field}_${option.order}`}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <HiChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={onClearFilters}
                  className="flex items-center gap-1 px-3 py-1 text-xs text-red-600 transition-colors rounded-lg bg-red-50 hover:bg-red-100"
                >
                  <HiX className="w-4 h-4" />
                  پاک کردن فیلترها
                </button>
              )}
            </div>
          </div>

          {/* Filter form */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Property Type Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                نوع کاربری
              </label>
              <select
                value={filters.propertyType || ""}
                onChange={(e) =>
                  onFilterChange(
                    "propertyType",
                    e.target.value ? e.target.value : undefined
                  )
                }
                className="relative z-10 w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">همه</option>
                {propertyTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.type || type.name || "نامشخص"}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                دسته‌بندی
              </label>
              <select
                value={filters.category || ""}
                onChange={(e) =>
                  onFilterChange(
                    "category",
                    e.target.value ? e.target.value : undefined
                  )
                }
                className="relative z-10 w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">همه</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                وضعیت
              </label>
              <select
                value={filters.status || ""}
                onChange={(e) =>
                  onFilterChange(
                    "status",
                    e.target.value ? e.target.value : undefined
                  )
                }
                className="relative z-10 w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">همه</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Filter */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                وضعیت فعال بودن
              </label>
              <select
                value={
                  filters.isActive !== undefined
                    ? filters.isActive.toString()
                    : ""
                }
                onChange={(e) =>
                  onFilterChange(
                    "isActive",
                    e.target.value === ""
                      ? undefined
                      : e.target.value === "true"
                  )
                }
                className="relative z-10 w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">همه</option>
                {activeOptions.map((option) => (
                  <option
                    key={option.value.toString()}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mobile clear filters button */}
          {hasActiveFilters && (
            <div className="flex justify-center mt-4 md:hidden">
              <button
                onClick={onClearFilters}
                className="flex items-center justify-center w-full gap-2 px-4 py-2 text-red-600 transition-colors rounded-lg bg-red-50 hover:bg-red-100"
              >
                <HiX className="w-4 h-4" />
                پاک کردن فیلترها
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdFilters;
