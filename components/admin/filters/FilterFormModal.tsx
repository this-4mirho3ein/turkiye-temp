"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Checkbox,
  Textarea,
  Chip,
} from "@heroui/react";
import { AdminFilter } from "@/types/interfaces";
import { FilterTypeEnum } from "@/types/enums";
import { FaPlus, FaTimes } from "react-icons/fa";
import { getAdminCategories } from "@/controllers/makeRequest";

interface FilterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<AdminFilter>) => void;
  filter: AdminFilter | null;
  isSubmitting: boolean;
}

const FilterFormModal: React.FC<FilterFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  filter,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<Partial<AdminFilter>>({
    name: "",
    enName: "",
    adInputType: FilterTypeEnum.STRING,
    userFilterType: FilterTypeEnum.STRING,
    options: [],
    isRequired: false,
    isMain: false,
    row: 0,
    categories: [],
  });

  const [newOption, setNewOption] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const categoriesData = await getAdminCategories({ limit: 100 });
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (isOpen) {
      loadCategories();
    }
  }, [isOpen]);

  // Reset form when modal opens/closes or filter changes
  useEffect(() => {
    if (isOpen) {
      if (filter) {
        setFormData({
          name: filter.name || "",
          enName: filter.enName || "",
          adInputType: filter.adInputType || FilterTypeEnum.STRING,
          userFilterType: filter.userFilterType || FilterTypeEnum.STRING,
          options: filter.options || [],
          isRequired: filter.isRequired || false,
          isMain: filter.isMain || false,
          row: filter.row || 0,
          categories: filter.categories || [],
        });
      } else {
        setFormData({
          name: "",
          enName: "",
          adInputType: FilterTypeEnum.STRING,
          userFilterType: FilterTypeEnum.STRING,
          options: [],
          isRequired: false,
          isMain: false,
          row: 0,
          categories: [],
        });
      }
      setNewOption("");
    }
  }, [isOpen, filter]);

  const handleInputChange = (field: keyof AdminFilter, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddOption = () => {
    if (newOption.trim() && !formData.options?.includes(newOption.trim())) {
      setFormData((prev) => ({
        ...prev,
        options: [...(prev.options || []), newOption.trim()],
      }));
      setNewOption("");
    }
  };

  const handleRemoveOption = (optionToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      options:
        prev.options?.filter((option) => option !== optionToRemove) || [],
    }));
  };

  const handleCategoryChange = (selectedKeys: Set<string>) => {
    setFormData((prev) => ({
      ...prev,
      categories: Array.from(selectedKeys),
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const filterTypeOptions = [
    { key: FilterTypeEnum.STRING, label: "متن" },
    { key: FilterTypeEnum.NUMBER, label: "عدد" },
    { key: FilterTypeEnum.ENUM, label: "انتخابی" },
    { key: FilterTypeEnum.BOOLEAN, label: "بولین" },
    { key: FilterTypeEnum.RANGE, label: "محدوده" },
  ];

  const isFormValid =
    formData.name &&
    formData.enName &&
    (formData.isMain ||
      (formData.categories && formData.categories.length > 0));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {filter ? "ویرایش فیلتر" : "افزودن فیلتر جدید"}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="نام فیلتر"
                placeholder="نام فیلتر را وارد کنید"
                value={formData.name || ""}
                onValueChange={(value) => handleInputChange("name", value)}
                isRequired
              />
              <Input
                label="نام انگلیسی"
                placeholder="نام انگلیسی فیلتر را وارد کنید"
                value={formData.enName || ""}
                onValueChange={(value) => handleInputChange("enName", value)}
                isRequired
              />
            </div>

            {/* Filter Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={formData.adInputType}
                onChange={(e) =>
                  handleInputChange(
                    "adInputType",
                    e.target.value as FilterTypeEnum
                  )
                }
                className={`w-full rounded-md border p-2 pr-10 focus:outline-none focus:border-primary focus:ring-primary ${
                  formData.adInputType ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              >
                <option value="">انتخاب نوع فیلتر در ایجاد آگهی</option>
                {filterTypeOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
          
              <select
                value={formData.userFilterType}
                onChange={(e) =>
                  handleInputChange(
                    "userFilterType",
                    e.target.value as FilterTypeEnum
                  )
                }
                className={`w-full rounded-md border p-2 pr-10 focus:outline-none focus:border-primary focus:ring-primary ${
                  formData.userFilterType ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              >
                <option value="">انتخاب نوع فیلتر در صفحه جستجو</option>
                {filterTypeOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Row and Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                type="number"
                label="ردیف"
                placeholder="ردیف نمایش"
                value={formData.row?.toString() || "0"}
                onValueChange={(value) =>
                  handleInputChange("row", parseInt(value) || 0)
                }
              />
              <div className="flex flex-col gap-2">
                <Checkbox
                  isSelected={formData.isRequired || false}
                  onValueChange={(checked) =>
                    handleInputChange("isRequired", checked)
                  }
                >
                  فیلتر اجباری
                </Checkbox>
                <Checkbox
                  isSelected={formData.isMain || false}
                  onValueChange={(checked) =>
                    handleInputChange("isMain", checked)
                  }
                >
                  فیلتر اصلی
                </Checkbox>
              </div>
            </div>

            {/* Categories Selection (only if not main filter) */}
            {!formData.isMain && (
              <select
                value={formData.categories}
                onChange={(e) => handleCategoryChange(new Set(e.target.value))}
                className={`w-full rounded-md border p-2 pr-10 focus:outline-none focus:border-primary focus:ring-primary ${
                  formData.categories && formData.categories.length > 0
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                disabled={isSubmitting}
              >
                <option value="">انتخاب دسته‌بندی</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}

            {/* Options (for ENUM type) */}
            {(formData.adInputType === FilterTypeEnum.ENUM ||
              formData.userFilterType === FilterTypeEnum.ENUM) && (
              <div className="space-y-3">
                <label className="text-sm font-medium">گزینه‌های فیلتر</label>

                {/* Add new option */}
                <div className="flex gap-2">
                  <Input
                    placeholder="گزینه جدید را وارد کنید"
                    value={newOption}
                    onValueChange={setNewOption}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleAddOption();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    color="primary"
                    onPress={handleAddOption}
                    isDisabled={!newOption.trim()}
                    startContent={<FaPlus />}
                  >
                    افزودن
                  </Button>
                </div>

                {/* Display existing options */}
                {formData.options && formData.options.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.options.map((option, index) => (
                      <Chip
                        key={index}
                        onClose={() => handleRemoveOption(option)}
                        variant="flat"
                        color="primary"
                      >
                        {option}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isSubmitting}>
            انصراف
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!isFormValid}
          >
            {filter ? "به‌روزرسانی" : "ایجاد"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FilterFormModal;
