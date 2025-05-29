"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Spinner,
  Divider,
} from "@heroui/react";
import { FaArrowLeft, FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import { AdminFilter } from "@/types/interfaces";
import { FilterTypeEnum } from "@/types/enums";
import {
  getAdminFilterById,
} from "@/controllers/makeRequest";
import { useToast } from "@/components/admin/ui/ToastProvider";

interface FilterDetailProps {
  filterId: string;
}

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
      [FilterTypeEnum.STRING]: "default",
      [FilterTypeEnum.NUMBER]: "primary",
      [FilterTypeEnum.ENUM]: "secondary",
      [FilterTypeEnum.BOOLEAN]: "success",
      [FilterTypeEnum.RANGE]: "warning",
    };
    return colors[type] || "default";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!filter) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">فیلتر یافت نشد</p>
        <Button
          color="primary"
          variant="light"
          startContent={<FaArrowLeft />}
          onPress={() => router.push("/admin/filters")}
          className="mt-4"
        >
          بازگشت به لیست فیلترها
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="light"
            startContent={<FaArrowLeft />}
            onPress={() => router.push("/admin/filters")}
          >
            بازگشت
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">جزئیات فیلتر</h1>
          <Chip
            size="sm"
            color={filter.isDeleted ? "danger" : "success"}
            variant="flat"
          >
            {filter.isDeleted ? "حذف شده" : "فعال"}
          </Chip>
        </div>
      </div>

      {/* Filter Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">اطلاعات پایه</h3>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">نام فیلتر</label>
              <p className="text-lg">{filter.name}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">نام انگلیسی</label>
              <p className="text-lg font-mono">{filter.enName}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">ردیف نمایش</label>
              <p className="text-lg">{filter.row}</p>
            </div>
          </CardBody>
        </Card>

        {/* Filter Types */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">انواع فیلتر</h3>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">نوع ورودی آگهی</label>
              <div className="mt-1">
                <Chip
                  size="md"
                  color={getFilterTypeColor(filter.adInputType) as any}
                  variant="flat"
                >
                  {getFilterTypeLabel(filter.adInputType)}
                </Chip>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-600">نوع فیلتر کاربر</label>
              <div className="mt-1">
                <Chip
                  size="md"
                  color={getFilterTypeColor(filter.userFilterType) as any}
                  variant="flat"
                >
                  {getFilterTypeLabel(filter.userFilterType)}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">تنظیمات</h3>
          </CardHeader>
          <Divider />
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-600">فیلتر اصلی</label>
              <Chip
                size="sm"
                color={filter.isMain ? "success" : "default"}
                variant="flat"
              >
                {filter.isMain ? "بله" : "خیر"}
              </Chip>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-600">اجباری</label>
              <Chip
                size="sm"
                color={filter.isRequired ? "warning" : "default"}
                variant="flat"
              >
                {filter.isRequired ? "اجباری" : "اختیاری"}
              </Chip>
            </div>
          </CardBody>
        </Card>

        {/* Options */}
        {filter.options && filter.options.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">گزینه‌ها</h3>
            </CardHeader>
            <Divider />
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {filter.options.map((option, index) => (
                  <Chip key={index} size="sm" variant="flat" color="primary">
                    {option}
                  </Chip>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FilterDetail; 