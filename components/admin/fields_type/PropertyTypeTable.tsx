"use client";

import React from "react";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaEye,
  FaInfoCircle,
} from "react-icons/fa";
import { Button } from "@heroui/react";

export interface PropertyType {
  _id: string;
  type: string;
  enName: string;
  row: number;
  isActive: boolean;
  isDeleted: boolean;
  slug: string;
  adCount: number;
  createdAt: string;
  updatedAt: string;
}

interface PropertyTypeTableProps {
  propertyTypes: PropertyType[];
  onEdit: (propertyType: PropertyType) => void;
  onDelete: (propertyType: PropertyType) => void;
  isLoading?: boolean;
  showDeletedItems?: boolean;
}

const PropertyTypeTable: React.FC<PropertyTypeTableProps> = ({
  propertyTypes,
  onEdit,
  onDelete,
  isLoading = false,
  showDeletedItems = false,
}) => {
  const filteredPropertyTypes = showDeletedItems
    ? propertyTypes
    : propertyTypes.filter((item) => !item.isDeleted);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="w-full py-12 text-center">
        <div className="inline-block animate-spin rounded-full border-4 border-primary border-r-transparent h-10 w-10 mb-4"></div>
        <div className="text-gray-600 mt-2">در حال بارگذاری اطلاعات...</div>
      </div>
    );
  }

  if (!filteredPropertyTypes.length) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-gray-500 text-lg">هیچ نوع کاربری یافت نشد.</div>
        <div className="text-gray-400 text-sm mt-2">
          می‌توانید با کلیک روی دکمه "افزودن نوع کاربری" در بالای صفحه، کاربری
          جدید اضافه کنید.
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3.5 text-center text-xs font-semibold text-black uppercase tracking-wider w-16"
            >
              ردیف
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-right text-xs font-semibold text-black uppercase tracking-wider"
            >
              عنوان
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-right text-xs font-semibold text-black uppercase tracking-wider"
            >
              نام انگلیسی
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-center text-xs font-semibold text-black uppercase tracking-wider w-24"
            >
              وضعیت
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-right text-xs font-semibold text-black uppercase tracking-wider"
            >
              تاریخ ایجاد
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-center text-xs font-semibold text-black uppercase tracking-wider w-24"
            >
              تعداد
            </th>
            <th
              scope="col"
              className="px-6 py-3.5 text-center text-xs font-semibold text-black uppercase tracking-wider w-auto"
            >
              عملیات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPropertyTypes.map((propertyType, index) => (
            <tr
              key={propertyType._id}
              className={`hover:bg-gray-50 transition-colors ${
                propertyType.isDeleted ? "bg-red-50" : ""
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                {propertyType.type}
                {propertyType.isDeleted && (
                  <span className="inline-flex items-center mr-2 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    حذف شده
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono text-right">
                {propertyType.enName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-center">
                {propertyType.isActive ? (
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    <FaCheck className="ml-1.5 mt-0.5" /> فعال
                  </span>
                ) : (
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    <FaTimes className="ml-1.5 mt-0.5" /> غیرفعال
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                {formatDate(propertyType.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-medium">
                  {propertyType.adCount}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                <div className="flex justify-center items-center gap-2">
                  {!propertyType.isDeleted ? (
                    <>
                      <Button
                        size="sm"
                        variant="solid"
                        color="primary"
                        onClick={() => onEdit(propertyType)}
                        className="gap-1.5 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <FaEdit /> ویرایش
                      </Button>
                      <Button
                        size="sm"
                        variant="solid"
                        color="danger"
                        onClick={() => onDelete(propertyType)}
                        className="gap-1.5 bg-red-500 hover:bg-red-600 text-white"
                      >
                        <FaTrash /> حذف
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="flat"
                        color="default"
                        disabled
                        className="gap-1.5 opacity-70 bg-gray-100 text-gray-600"
                      >
                        <FaEye /> مشاهده
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PropertyTypeTable;
