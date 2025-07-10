"use client";

import React, { useState } from "react";
import {
  FaFilter,
  FaSearch,
  FaTrash,
  FaCheck,
  FaTimes,
  FaChevronDown,
} from "react-icons/fa";
import Button from "@/components/admin/ui/Button";
import Input from "@/components/admin/ui/Input";
import Card, { CardBody } from "@/components/admin/ui/Card";
import {
  Checkbox,
  Divider,
  addToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { motion } from "framer-motion";

interface CategoryFiltersProps {
  onApplyFilters: (filters: CategoryFilterOptions) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  showDeletedItems: boolean;
  setShowDeletedItems: (value: boolean) => void;
}

export interface CategoryFilterOptions {
  searchTerm?: string;
  showDeleted?: boolean;
  isActive?: boolean;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({
  onApplyFilters,
  onResetFilters,
  isLoading = false,
  searchTerm,
  setSearchTerm,
  showDeletedItems,
  setShowDeletedItems,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);

  // Handle filter application
  const applyFilters = () => {
    const filters: CategoryFilterOptions = {};

    if (isActive !== undefined) {
      filters.isActive = isActive;
    }

    if (searchTerm.trim()) {
      filters.searchTerm = searchTerm.trim();
    }

    filters.showDeleted = showDeletedItems;
    

    // Close the filter panel when applying filters
    setIsOpen(false);
    
    // Apply the filters
    onApplyFilters(filters);

    addToast({
      title: "فیلترها اعمال شدند",
      description: "لیست دسته‌بندی‌ها بر اساس فیلترهای انتخابی به‌روزرسانی شد.",
      color: "success",
      icon: <FaCheck />,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setIsActive(undefined);
    setSearchTerm("");
    setShowDeletedItems(false);
    onResetFilters();

    addToast({
      title: "فیلترها پاک شدند",
      description: "تمام فیلترها حذف شدند و لیست دسته‌بندی‌ها به حالت اولیه بازگشت.",
      color: "primary",
      icon: <FaTrash />,
    });
  };

  // Toggle filter panel
  const toggleFilterPanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-6">
      <Card shadow="sm">
        <CardBody>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Input
                placeholder="جستجو بر اساس نام دسته‌بندی..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                startContent={
                  <FaSearch className="text-gray-400 text-sm" />
                }
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter") {
                    applyFilters();
                  }
                }}
              />
            </div>

            {/* Filter Button and Panel */}
            <div className="flex items-center gap-2">
              <Popover placement="bottom-end" isOpen={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger>
                  <Button
                    size="sm"
                    variant="bordered"
                    color="secondary"
                    className="flex items-center gap-1"
                    onClick={toggleFilterPanel}
                  >
                    <FaFilter className="text-sm" />
                    <span>فیلترها</span>
                    <FaChevronDown
                      className={`text-xs transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <Card className="w-72 shadow-lg border-0">
                    <CardBody>
                      <div className="p-1">
                        <h3 className="text-md font-bold mb-3">فیلترهای پیشرفته</h3>

                        {/* Active Status Filter */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">
                            وضعیت فعال بودن
                          </label>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              color={isActive === true ? "success" : "primary"}
                              variant={isActive === true ? "solid" : "bordered"}
                              onPress={() =>
                                setIsActive(isActive === true ? undefined : true)
                              }
                              className="min-w-[70px]"
                            >
                              فعال
                            </Button>
                            <Button
                              size="sm"
                              color={isActive === false ? "danger" : "primary"}
                              variant={isActive === false ? "solid" : "bordered"}
                              onPress={() =>
                                setIsActive(isActive === false ? undefined : false)
                              }
                              className="min-w-[70px]"
                            >
                              غیرفعال
                            </Button>
                          </div>
                        </div>

                        {/* Show Deleted Categories Filter */}
                        <div className="mt-4">
                          <div className="flex items-center">
                            <Checkbox
                              isSelected={showDeletedItems}
                              onValueChange={setShowDeletedItems}
                              color="secondary"
                            />
                            <span className="mr-2 text-sm">
                              نمایش دسته‌بندی‌های حذف شده
                            </span>
                          </div>
                        </div>

                        <Divider className="my-2" />

                        <div className="flex justify-between">
                          <Button
                            size="sm"
                            variant="light"
                            color="secondary"
                            onPress={resetFilters}
                            isDisabled={isLoading}
                          >
                            پاک کردن
                          </Button>
                          <Button
                            size="sm"
                            variant="solid"
                            color="primary"
                            onPress={applyFilters}
                            startContent={<FaCheck className="ml-1" />}
                            isLoading={isLoading}
                            isDisabled={isLoading}
                          >
                            اعمال فیلترها
                          </Button>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </PopoverContent>
              </Popover>

              <Button
                size="sm"
                color="primary"
                variant="solid"
                onPress={applyFilters}
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                جستجو
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CategoryFilters;
