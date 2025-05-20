"use client";

import React, { useMemo } from "react";
import { Button, Spinner, Badge } from "@heroui/react";
import {
  FaEdit,
  FaTrash,
  FaUndo,
  FaCheck,
  FaTimesCircle,
  FaEye,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Animation variants
const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

export interface Category {
  _id: string;
  name: string;
  enName: string;
  row: number;
  propertyType: string | { _id: string; type: string };
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onRestore?: (category: Category) => void;
  isLoading: boolean;
  showDeletedItems: boolean;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  onEdit,
  onDelete,
  onRestore,
  isLoading,
  showDeletedItems,
}) => {
  const router = useRouter();

  // Function to navigate to category details page
  const viewCategoryDetails = (categoryId: string) => {
    router.push(`/admin/categories/${categoryId}`);
  };

  // Filter categories based on showDeletedItems using useMemo for performance
  const filteredCategories = useMemo(() => {
    // Log for debugging
    console.log("Filtering categories:", {
      total: categories.length,
      showDeleted: showDeletedItems,
      deletedCount: categories.filter((cat) => cat.isDeleted === true).length,
      hasIsDeletedProperty:
        categories.length > 0 ? "isDeleted" in categories[0] : false,
    });

    if (showDeletedItems) {
      // Show all categories when showDeletedItems is true
      return categories;
    } else {
      // Only show non-deleted categories
      // Using explicit comparison to ensure we properly handle undefined/null values
      return categories.filter((cat) => cat.isDeleted !== true);
    }
  }, [categories, showDeletedItems]);

  // Format date to Jalali
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  // Get property type name
  const getPropertyTypeName = (
    propertyType: string | { _id: string; type: string }
  ) => {
    if (typeof propertyType === "string") {
      return propertyType;
    }
    return propertyType?.type || "-";
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Spinner size="lg" />
          <p className="mt-2 text-gray-600">در حال بارگذاری دسته‌بندی‌ها...</p>
        </motion.div>
      </div>
    );
  }

  if (filteredCategories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 text-center border rounded-lg bg-gray-50"
      >
        <p className="text-gray-500">
          {showDeletedItems
            ? "هیچ دسته‌بندی‌ای یافت نشد."
            : "هیچ دسته‌بندی فعالی یافت نشد. برای دیدن دسته‌بندی‌های حذف شده، فیلتر «نمایش موارد حذف شده» را فعال کنید."}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={tableVariants}
      className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm"
    >
      <table className="w-full text-right min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-black uppercase tracking-wider">
              ردیف
            </th>
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-black uppercase tracking-wider">
              نام
            </th>
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-black uppercase tracking-wider">
              نام انگلیسی
            </th>
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-black uppercase tracking-wider">
              نوع کاربری
            </th>
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-black uppercase tracking-wider">
              وضعیت
            </th>
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-black uppercase tracking-wider">
              تاریخ ایجاد
            </th>
            <th className="px-6 py-3.5 text-center text-xs font-semibold text-black uppercase tracking-wider">
              عملیات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredCategories.map((category, index) => (
            <motion.tr
              key={category._id}
              variants={rowVariants}
              custom={index}
              className={
                category.isDeleted
                  ? "bg-red-50"
                  : "hover:bg-gray-50 transition-colors"
              }
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {category.row || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {category.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {category.enName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {getPropertyTypeName(category.propertyType)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {category.isDeleted ? (
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    حذف شده
                  </span>
                ) : category.isActive ? (
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    <FaCheck className="ml-1.5 mt-0.5" size={12} /> فعال
                  </span>
                ) : (
                  <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    <FaTimesCircle className="ml-1.5 mt-0.5" size={12} />{" "}
                    غیرفعال
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(category.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-center gap-3">
                  {category.isDeleted ? (
                    <Button
                      size="sm"
                      color="primary"
                      variant="solid"
                      onClick={() => onRestore?.(category)}
                      title="بازیابی"
                      className="gap-1.5 bg-green-500 hover:bg-green-600 text-white"
                      aria-label="بازیابی"
                      tabIndex={0}
                    >
                      <FaUndo /> بازیابی
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        color="default"
                        variant="solid"
                        onClick={() => viewCategoryDetails(category._id)}
                        title="مشاهده جزئیات"
                        className="gap-1.5 bg-gray-500 hover:bg-gray-600 text-white"
                        aria-label="مشاهده"
                        tabIndex={0}
                      >
                        <FaEye /> مشاهده
                      </Button>
                      <Button
                        size="sm"
                        color="primary"
                        variant="solid"
                        onClick={() => onEdit(category)}
                        title="ویرایش"
                        className="gap-1.5 bg-blue-500 hover:bg-blue-600 text-white"
                        aria-label="ویرایش"
                        tabIndex={0}
                      >
                        <FaEdit /> ویرایش
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="solid"
                        onClick={() => onDelete(category)}
                        title="حذف"
                        className="gap-1.5 bg-red-500 hover:bg-red-600 text-white"
                        aria-label="حذف"
                        tabIndex={0}
                      >
                        <FaTrash /> حذف
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default CategoryTable;
