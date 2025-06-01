"use client";

import React from "react";
import Button from "@/components/admin/ui/Button";
import { FaEdit, FaTrash, FaUndo, FaEye } from "react-icons/fa";
import { AdminFilter } from "@/types/interfaces";
import { FilterTypeEnum } from "@/types/enums";
import Link from "next/link";

export type { AdminFilter };

interface FilterTableProps {
  filters: AdminFilter[];
  isLoading: boolean;
  onEdit: (filter: AdminFilter) => void;
  onDelete: (filter: AdminFilter) => void;
  onRestore: (filter: AdminFilter) => void;
  isSubmitting: boolean;
}

const FilterTable: React.FC<FilterTableProps> = ({
  filters,
  isLoading,
  onEdit,
  onDelete,
  onRestore,
  isSubmitting,
}) => {
  const getFilterTypeLabel = (type: FilterTypeEnum) => {
    const labels = {
      [FilterTypeEnum.STRING]: "متن",
      [FilterTypeEnum.NUMBER]: "عدد",
      [FilterTypeEnum.ENUM]: "انتخابی",
      [FilterTypeEnum.BOOLEAN]: "بولین",
      [FilterTypeEnum.RANGE]: "محدوده",
    };
    return labels[type] || type;
  };

  const getFilterTypeColor = (type: FilterTypeEnum) => {
    const colors = {
      [FilterTypeEnum.STRING]: "bg-blue-100 text-blue-800",
      [FilterTypeEnum.NUMBER]: "bg-green-100 text-green-800",
      [FilterTypeEnum.ENUM]: "bg-yellow-100 text-yellow-800",
      [FilterTypeEnum.BOOLEAN]: "bg-purple-100 text-purple-800",
      [FilterTypeEnum.RANGE]: "bg-red-100 text-red-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm text-right">
        <thead className="text-xs text-black uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3.5 text-center font-semibold">#</th>
            <th className="px-6 py-3.5 font-semibold">نام فیلتر</th>
            <th className="px-6 py-3.5 font-semibold">نام انگلیسی</th>
            <th className="px-6 py-3.5 font-semibold">نوع ورودی آگهی</th>
            <th className="px-6 py-3.5 font-semibold">نوع فیلتر کاربر</th>
            <th className="px-6 py-3.5 font-semibold">ویژگی‌ها</th>
            <th className="px-6 py-3.5 text-center font-semibold">ردیف</th>
            <th className="px-6 py-3.5 font-semibold">گزینه‌ها</th>
            <th className="px-6 py-3.5 text-center font-semibold">وضعیت</th>
            <th className="px-6 py-3.5 text-center w-48 font-semibold">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="bg-white border-b">
              <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="mr-2">در حال بارگذاری...</span>
                </div>
              </td>
            </tr>
          ) : filters.length > 0 ? (
            filters.map((filter, index) => (
              <tr
                key={filter._id}
                className={`border-b hover:bg-gray-50 transition-colors ${
                  filter.isDeleted ? "bg-red-50" : "bg-white"
                }`}
              >
                <td className="px-6 py-4 font-medium text-center">
                  {index + 1}
                </td>
                <td className="px-6 py-4 font-medium">
                  {filter.name}
                  {filter.isDeleted && (
                    <span className="inline-flex items-center mr-2 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      حذف شده
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {filter.enName}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getFilterTypeColor(
                      filter.adInputType
                    )}`}
                  >
                    {getFilterTypeLabel(filter.adInputType)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getFilterTypeColor(
                      filter.userFilterType
                    )}`}
                  >
                    {getFilterTypeLabel(filter.userFilterType)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {filter.isMain && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        اصلی
                      </span>
                    )}
                    {filter.isRequired && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        اجباری
                      </span>
                    )}
                    {!filter.isMain && !filter.isRequired && (
                      <span className="text-xs text-gray-400">معمولی</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {filter.row}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {filter.options && filter.options.length > 0 ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {filter.options.length} گزینه
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">بدون گزینه</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      filter.isDeleted
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {filter.isDeleted ? "حذف شده" : "فعال"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center gap-3">
                    <Button
                      as={Link}
                      href={`/admin/filters/${filter._id}`}
                      variant="solid"
                      size="sm"
                      color="primary"
                      aria-label="مشاهده"
                      tabIndex={0}
                      className="gap-1.5 bg-gray-500 hover:bg-gray-600 text-white"
                    >
                      <FaEye /> مشاهده
                    </Button>

                    {!filter.isDeleted ? (
                      <>
                        <Button
                          variant="solid"
                          size="sm"
                          color="primary"
                          onPress={() => onEdit(filter)}
                          aria-label="ویرایش"
                          tabIndex={0}
                          className="gap-1.5 bg-blue-500 hover:bg-blue-600 text-white"
                          isDisabled={isSubmitting}
                        >
                          <FaEdit /> ویرایش
                        </Button>
                        <Button
                          variant="solid"
                          size="sm"
                          color="danger"
                          onPress={() => onDelete(filter)}
                          aria-label="حذف"
                          tabIndex={0}
                          className="gap-1.5 bg-red-500 hover:bg-red-600 text-white"
                          isDisabled={isSubmitting}
                        >
                          <FaTrash /> حذف
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="solid"
                        size="sm"
                        color="success"
                        onPress={() => onRestore(filter)}
                        aria-label="بازیابی"
                        tabIndex={0}
                        className="gap-1.5 bg-green-500 hover:bg-green-600 text-white"
                        isDisabled={isSubmitting}
                      >
                        <FaUndo /> بازیابی
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-white border-b">
              <td colSpan={10} className="px-6 py-4 text-center text-gray-500">
                هیچ فیلتری یافت نشد
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FilterTable;
