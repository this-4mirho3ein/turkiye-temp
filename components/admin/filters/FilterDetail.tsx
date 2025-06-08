"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Filter,
  Settings,
  Tag,
  List,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import Card, { CardBody, CardHeader } from "@/components/admin/ui/Card";
import Button from "@/components/admin/ui/Button";
import { AdminFilter, FilterOption } from "@/types/interfaces";
import { FilterTypeEnum } from "@/types/enums";
import { getAdminFilterById } from "@/controllers/makeRequest";
import { useToast } from "@/components/admin/ui/ToastProvider";
import { motion } from "framer-motion";

interface FilterDetailProps {
  filterId: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

const FilterDetail: React.FC<FilterDetailProps> = ({ filterId }) => {
  const router = useRouter();
  const { showToast } = useToast();

  const [filter, setFilter] = useState<AdminFilter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load filter data
  useEffect(() => {
    const loadFilter = async () => {
      try {
        setIsLoading(true);
        const filterData = await getAdminFilterById(filterId);
        setFilter(filterData.data);
        showToast({
          message: "جزئیات فیلتر با موفقیت بارگذاری شد",
          type: "success",
        });
      } catch (error) {
        console.error("Error loading filter:", error);
        showToast({
          message: "خطا در بارگذاری اطلاعات فیلتر",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (filterId) {
      loadFilter();
    }
  }, [filterId, showToast]);

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
      [FilterTypeEnum.STRING]: "bg-blue-100 text-blue-800 border-blue-200",
      [FilterTypeEnum.NUMBER]: "bg-green-100 text-green-800 border-green-200",
      [FilterTypeEnum.ENUM]: "bg-yellow-100 text-yellow-800 border-yellow-200",
      [FilterTypeEnum.BOOLEAN]:
        "bg-purple-100 text-purple-800 border-purple-200",
      [FilterTypeEnum.RANGE]: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">در حال بارگذاری...</p>
        </motion.div>
      </div>
    );
  }

  if (!filter) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-sm w-full bg-red-50 border border-red-100 rounded-lg p-6 text-center"
        >
          <div className="bg-red-100 text-red-600 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
            <XCircle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-bold mb-2 text-red-800">
            فیلتر یافت نشد
          </h2>
          <p className="text-red-700 mb-4 text-sm">
            متأسفانه فیلتر مورد نظر یافت نشد
          </p>
          <Button
            color="primary"
            variant="solid"
            onPress={() => router.push("/admin/filters")}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm"
          >
            <ArrowRight className="h-4 w-4 ml-1" />
            بازگشت به لیست
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4 p-4 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <CardHeader className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => router.push("/admin/filters")}
                  className="text-gray-600 hover:text-gray-800 hover:bg-white/50 p-2"
                >
                  <ArrowRight className="h-4 w-4 ml-1" />
                  <span className="hidden sm:inline">بازگشت</span>
                </Button>

                <div className="flex items-center gap-2">
                  <div className="bg-blue-100 text-blue-600 rounded-lg p-1.5">
                    <Filter className="h-4 w-4" />
                  </div>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                      جزئیات فیلتر
                    </h1>
                    <p className="text-xs text-gray-600 hidden sm:block">
                      مشاهده اطلاعات فیلتر
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    filter.isDeleted
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-green-100 text-green-800 border border-green-200"
                  }`}
                >
                  {filter.isDeleted ? (
                    <XCircle className="h-3 w-3 ml-1" />
                  ) : (
                    <CheckCircle className="h-3 w-3 ml-1" />
                  )}
                  {filter.isDeleted ? "حذف شده" : "فعال"}
                </span>

                {filter.isMain && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    <Settings className="h-3 w-3 ml-1" />
                    اصلی
                  </span>
                )}

                {filter.isRequired && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                    اجباری
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Filter Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Basic Information */}
        <motion.div variants={itemVariants}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 p-3">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 text-white rounded-lg p-1.5">
                  <Tag className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    اطلاعات پایه
                  </h3>
                  <p className="text-xs text-gray-600">اطلاعات اصلی فیلتر</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-4 space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  نام فیلتر
                </label>
                <p className="text-sm font-semibold text-gray-900">
                  {filter.name}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  نام انگلیسی
                </label>
                <p className="text-sm font-mono bg-white border border-gray-200 rounded px-2 py-1 text-left">
                  {filter.enName}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  ردیف نمایش
                </label>
                <div className="flex items-center justify-center bg-blue-100 text-blue-800 rounded-full w-8 h-8 font-bold text-sm mx-auto">
                  {filter.row}
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Filter Types */}
        <motion.div variants={itemVariants}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 p-3">
              <div className="flex items-center gap-2">
                <div className="bg-green-500 text-white rounded-lg p-1.5">
                  <Settings className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    انواع فیلتر
                  </h3>
                  <p className="text-xs text-gray-600">تنظیمات نوع</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-4 space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <label className="text-xs font-medium text-gray-600 block mb-2">
                  نوع ورودی آگهی
                </label>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getFilterTypeColor(
                    filter.adInputType
                  )}`}
                >
                  {getFilterTypeLabel(filter.adInputType)}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <label className="text-xs font-medium text-gray-600 block mb-2">
                  نوع فیلتر جستجو
                </label>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getFilterTypeColor(
                    filter.userFilterType
                  )}`}
                >
                  {getFilterTypeLabel(filter.userFilterType)}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <label className="text-xs font-medium text-gray-600 block mb-2">
                  نوع آگهی
                </label>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                    filter.adSellType === "both"
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : filter.adSellType === "sale"
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-orange-100 text-orange-800 border-orange-200"
                  }`}
                >
                  {filter.adSellType === "both"
                    ? "هر دو (فروش و اجاره)"
                    : filter.adSellType === "sale"
                    ? "فروش"
                    : "اجاره"}
                </span>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Settings & Properties */}
        <motion.div variants={itemVariants}>
          <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b border-purple-200 p-3">
              <div className="flex items-center gap-2">
                <div className="bg-purple-500 text-white rounded-lg p-1.5">
                  <Settings className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">
                    تنظیمات
                  </h3>
                  <p className="text-xs text-gray-600">خصوصیات فیلتر</p>
                </div>
              </div>
            </CardHeader>
            <CardBody className="p-4 space-y-3">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <label className="text-xs font-medium text-gray-600">
                  فیلتر اصلی
                </label>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    filter.isMain
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {filter.isMain ? "بله" : "خیر"}
                </span>
              </div>

              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <label className="text-xs font-medium text-gray-600">
                  اجباری بودن
                </label>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    filter.isRequired
                      ? "bg-orange-100 text-orange-800 border border-orange-200"
                      : "bg-gray-100 text-gray-600 border border-gray-200"
                  }`}
                >
                  {filter.isRequired ? "اجباری" : "اختیاری"}
                </span>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Options (if available) */}
        {filter.options && filter.options.length > 0 && (
          <motion.div variants={itemVariants}>
            <Card className="h-full shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200 p-3">
                <div className="flex items-center gap-2">
                  <div className="bg-orange-500 text-white rounded-lg p-1.5">
                    <List className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      گزینه‌های فیلتر
                    </h3>
                    <p className="text-xs text-gray-600">
                      {filter.options.length} گزینه
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="p-4">
                <div className="space-y-2">
                  {filter.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        <div className="text-right">
                          <span className="text-xs text-gray-500 block mb-1">
                            برچسب:
                          </span>
                          <span className="text-sm font-medium text-gray-800">
                            {typeof option === "string" ? option : option.label}
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="text-xs text-gray-500 block mb-1">
                            مقدار:
                          </span>
                          <span className="text-sm font-mono text-gray-800 bg-white px-2 py-1 rounded border">
                            {typeof option === "string" ? option : option.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FilterDetail;
