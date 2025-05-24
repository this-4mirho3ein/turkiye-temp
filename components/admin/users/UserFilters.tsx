"use client";

import React, { useState, useEffect } from "react";
import {
  FaFilter,
  FaSearch,
  FaTrash,
  FaCheck,
  FaTimes,
  FaUserCheck,
  FaUserSlash,
  FaUserCog,
  FaUserAlt,
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

interface UserFiltersProps {
  onApplyFilters: (filters: UserFilterOptions) => void;
  onResetFilters: () => void;
  isLoading?: boolean;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export interface UserFilterOptions {
  roles?: string[];
  isActive?: boolean;
  isBanned?: boolean;
  isProfileComplete?: boolean;
  searchTerm?: string;
  showDeleted?: boolean;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  onApplyFilters,
  onResetFilters,
  isLoading = false,
  searchTerm,
  setSearchTerm,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter states
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isActive, setIsActive] = useState<boolean | undefined>(undefined);
  const [isBanned, setIsBanned] = useState<boolean | undefined>(undefined);
  const [isProfileComplete, setIsProfileComplete] = useState<
    boolean | undefined
  >(undefined);
  const [showDeleted, setShowDeleted] = useState<boolean>(false);

  // Available roles
  const availableRoles = [
    { id: "admin", label: "مدیر" },
    { id: "customer", label: "مشتری" },
    { id: "agency", label: "آژانس" },
    { id: "consultant", label: "مشاور" },
  ];

  // Toggle role selection
  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId]
    );
  };

  // Handle filter application
  const applyFilters = () => {
    const filters: UserFilterOptions = {};

    if (selectedRoles.length > 0) {
      filters.roles = selectedRoles;
    }

    if (isActive !== undefined) {
      filters.isActive = isActive;
    }

    if (isBanned !== undefined) {
      filters.isBanned = isBanned;
    }

    if (isProfileComplete !== undefined) {
      filters.isProfileComplete = isProfileComplete;
    }

    if (searchTerm.trim()) {
      filters.searchTerm = searchTerm.trim();
    }

    filters.showDeleted = showDeleted;

    // Log the filters being applied
    console.log("Applying filters to API request:", {
      roles: filters.roles ? filters.roles.join(",") : undefined,
      isActive: filters.isActive,
      isBanned: filters.isBanned,
      isProfileComplete: filters.isProfileComplete,
      searchTerm: filters.searchTerm,
      showDeleted: filters.showDeleted,
    });

    // Close the filter panel when applying filters
    setIsOpen(false);

    // Apply the filters
    onApplyFilters(filters);

    addToast({
      title: "فیلترها اعمال شدند",
      description: "لیست کاربران بر اساس فیلترهای انتخابی به‌روزرسانی شد.",
      color: "success",
      icon: <FaCheck />,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedRoles([]);
    setIsActive(undefined);
    setIsBanned(undefined);
    setIsProfileComplete(undefined);
    setSearchTerm("");
    setShowDeleted(false);
    onResetFilters();

    addToast({
      title: "فیلترها پاک شدند",
      description: "تمام فیلترها حذف شدند و لیست کاربران به حالت اولیه بازگشت.",
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
      <Card className="bg-white border border-gray-200 shadow-sm">
        <CardBody>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {/* Search Input */}
            <div className="flex-grow w-full md:w-auto">
              <Input
                type="text"
                placeholder="جستجو بر اساس نام، ایمیل یا شماره تلفن"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                startContent={<FaSearch className="text-gray-400" />}
                className="w-full"
              />
            </div>

            {/* Filter Popover */}
            <div className="flex items-center gap-2">
              <Popover placement="bottom-end">
                <PopoverTrigger>
                  <Button
                    size="sm"
                    color="secondary"
                    variant="bordered"
                    className="flex items-center gap-1"
                  >
                    <FaFilter className="text-primary" />
                    <span>فیلترها</span>
                    <FaChevronDown className="text-xs" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Card className="border-0 shadow-none">
                    <CardBody>
                      <div className="space-y-4">
                        {/* Roles Filter */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            نقش‌ها
                          </label>
                          <div className="bg-white p-3 border border-gray-200 rounded-md">
                            <div className="grid grid-cols-2 gap-2">
                              {availableRoles.map((role) => (
                                <div
                                  key={role.id}
                                  className="flex items-center"
                                >
                                  <Checkbox
                                    isSelected={selectedRoles.includes(role.id)}
                                    onValueChange={() => toggleRole(role.id)}
                                    color="primary"
                                  />
                                  <span className="mr-2 text-sm">
                                    {role.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Status Filters */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            وضعیت
                          </label>
                          <div className="bg-white p-3 border border-gray-200 rounded-md space-y-3">
                            {/* Active Status */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FaUserCheck className="text-green-500 ml-2" />
                                <span className="text-sm">فعال</span>
                              </div>
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <Button
                                  size="sm"
                                  color={
                                    isActive === true ? "success" : "default"
                                  }
                                  variant={
                                    isActive === true ? "solid" : "bordered"
                                  }
                                  onPress={() =>
                                    setIsActive(
                                      isActive === true ? undefined : true
                                    )
                                  }
                                  className="min-w-[70px]"
                                >
                                  بله
                                </Button>
                                <Button
                                  size="sm"
                                  color={
                                    isActive === false ? "danger" : "default"
                                  }
                                  variant={
                                    isActive === false ? "solid" : "bordered"
                                  }
                                  onPress={() =>
                                    setIsActive(
                                      isActive === false ? undefined : false
                                    )
                                  }
                                  className="min-w-[70px]"
                                >
                                  خیر
                                </Button>
                              </div>
                            </div>

                            {/* Banned Status */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FaUserSlash className="text-red-500 ml-2" />
                                <span className="text-sm">مسدود شده</span>
                              </div>
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <Button
                                  size="sm"
                                  color={
                                    isBanned === true ? "danger" : "default"
                                  }
                                  variant={
                                    isBanned === true ? "solid" : "bordered"
                                  }
                                  onPress={() =>
                                    setIsBanned(
                                      isBanned === true ? undefined : true
                                    )
                                  }
                                  className="min-w-[70px]"
                                >
                                  بله
                                </Button>
                                <Button
                                  size="sm"
                                  color={
                                    isBanned === false ? "success" : "default"
                                  }
                                  variant={
                                    isBanned === false ? "solid" : "bordered"
                                  }
                                  onPress={() =>
                                    setIsBanned(
                                      isBanned === false ? undefined : false
                                    )
                                  }
                                  className="min-w-[70px]"
                                >
                                  خیر
                                </Button>
                              </div>
                            </div>

                            {/* Profile Completion Status */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <FaUserCog className="text-blue-500 ml-2" />
                                <span className="text-sm">تکمیل پروفایل</span>
                              </div>
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <Button
                                  size="sm"
                                  color={
                                    isProfileComplete === true
                                      ? "success"
                                      : "default"
                                  }
                                  variant={
                                    isProfileComplete === true
                                      ? "solid"
                                      : "bordered"
                                  }
                                  onPress={() =>
                                    setIsProfileComplete(
                                      isProfileComplete === true
                                        ? undefined
                                        : true
                                    )
                                  }
                                  className="min-w-[70px]"
                                >
                                  بله
                                </Button>
                                <Button
                                  size="sm"
                                  color={
                                    isProfileComplete === false
                                      ? "warning"
                                      : "default"
                                  }
                                  variant={
                                    isProfileComplete === false
                                      ? "solid"
                                      : "bordered"
                                  }
                                  onPress={() =>
                                    setIsProfileComplete(
                                      isProfileComplete === false
                                        ? undefined
                                        : false
                                    )
                                  }
                                  className="min-w-[70px]"
                                >
                                  خیر
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Show Deleted Users Filter */}
                        <div className="mt-4">
                          <div className="flex items-center">
                            <Checkbox
                              isSelected={showDeleted}
                              onValueChange={setShowDeleted}
                              color="secondary"
                            />
                            <span className="mr-2 text-sm">
                              نمایش کاربران حذف شده
                            </span>
                          </div>
                        </div>

                        <Divider className="my-2" />

                        <div className="flex justify-between">
                          <Button
                            size="sm"
                            variant="light"
                            color="default"
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

export default UserFilters;
