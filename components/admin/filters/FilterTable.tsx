"use client";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Spinner,
  Tooltip,
} from "@heroui/react";
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
      [FilterTypeEnum.STRING]: "default",
      [FilterTypeEnum.NUMBER]: "primary",
      [FilterTypeEnum.ENUM]: "secondary",
      [FilterTypeEnum.BOOLEAN]: "success",
      [FilterTypeEnum.RANGE]: "warning",
    };
    return colors[type] || "default";
  };

  const columns = [
    { key: "name", label: "نام فیلتر" },
    { key: "enName", label: "نام انگلیسی" },
    { key: "adInputType", label: "نوع ورودی آگهی" },
    { key: "userFilterType", label: "نوع فیلتر کاربر" },
    { key: "isMain", label: "فیلتر اصلی" },
    { key: "isRequired", label: "اجباری" },
    { key: "row", label: "ردیف" },
    { key: "options", label: "گزینه‌ها" },
    { key: "status", label: "وضعیت" },
    { key: "actions", label: "عملیات" },
  ];

  const renderCell = (filter: AdminFilter, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <span className="font-medium">{filter.name}</span>
          </div>
        );
      case "enName":
        return (
          <span className="text-sm text-gray-600 font-mono">
            {filter.enName}
          </span>
        );
      case "adInputType":
        return (
          <Chip
            size="sm"
            color={getFilterTypeColor(filter.adInputType) as any}
            variant="flat"
          >
            {getFilterTypeLabel(filter.adInputType)}
          </Chip>
        );
      case "userFilterType":
        return (
          <Chip
            size="sm"
            color={getFilterTypeColor(filter.userFilterType) as any}
            variant="flat"
          >
            {getFilterTypeLabel(filter.userFilterType)}
          </Chip>
        );
      case "isMain":
        return (
          <Chip
            size="sm"
            color={filter.isMain ? "success" : "default"}
            variant="flat"
          >
            {filter.isMain ? "بله" : "خیر"}
          </Chip>
        );
      case "isRequired":
        return (
          <Chip
            size="sm"
            color={filter.isRequired ? "warning" : "default"}
            variant="flat"
          >
            {filter.isRequired ? "اجباری" : "اختیاری"}
          </Chip>
        );
      case "row":
        return <span className="text-sm">{filter.row}</span>;
      case "options":
        return (
          <div className="flex flex-col gap-1">
            {filter.options && filter.options.length > 0 ? (
              <Tooltip
                content={
                  <div className="max-w-xs">
                    {filter.options.map((option, index) => (
                      <div key={index} className="text-xs">
                        {option}
                      </div>
                    ))}
                  </div>
                }
              >
                <Chip size="sm" variant="flat">
                  {filter.options.length} گزینه
                </Chip>
              </Tooltip>
            ) : (
              <span className="text-xs text-gray-400">بدون گزینه</span>
            )}
          </div>
        );
      case "status":
        return (
          <Chip
            size="sm"
            color={filter.isDeleted ? "danger" : "success"}
            variant="flat"
          >
            {filter.isDeleted ? "حذف شده" : "فعال"}
          </Chip>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content="مشاهده جزئیات">
              <Button
                as={Link}
                href={`/admin/filters/${filter._id}`}
                isIconOnly
                size="sm"
                variant="light"
                color="primary"
              >
                <FaEye />
              </Button>
            </Tooltip>

            {!filter.isDeleted ? (
              <>
                <Tooltip content="ویرایش">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="primary"
                    onPress={() => onEdit(filter)}
                    isDisabled={isSubmitting}
                  >
                    <FaEdit />
                  </Button>
                </Tooltip>
                <Tooltip content="حذف">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => onDelete(filter)}
                    isDisabled={isSubmitting}
                  >
                    <FaTrash />
                  </Button>
                </Tooltip>
              </>
            ) : (
              <Tooltip content="بازیابی">
                <Button
                  isIconOnly
                  size="sm"
                  variant="light"
                  color="success"
                  onPress={() => onRestore(filter)}
                  isDisabled={isSubmitting}
                >
                  <FaUndo />
                </Button>
              </Tooltip>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <Table aria-label="جدول فیلترها" className="min-h-[400px]">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.key} className="text-right">
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={filters}
        emptyContent={
          <div className="text-center py-8">
            <p className="text-gray-500">هیچ فیلتری یافت نشد</p>
          </div>
        }
      >
        {(filter) => (
          <TableRow key={filter._id}>
            {(columnKey) => (
              <TableCell className="text-right">
                {renderCell(filter, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default FilterTable;
