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
  Chip,
  Divider,
} from "@heroui/react";
import { AdminFilter } from "@/types/interfaces";
import { FilterTypeEnum } from "@/types/enums";
import { FaPlus, FaTimes, FaFilter, FaTag, FaCog } from "react-icons/fa";
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

  const handleCategoryChange = (value: string) => {
    const selectedKeys = new Set([value]);
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
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[95vh]",
        header:
          "border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50",
        body: "py-6 px-6",
        footer: "border-t border-gray-200 bg-gray-50",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FaFilter className="text-blue-600 text-lg" />
            <span className="text-lg font-bold">
              {filter ? "ویرایش فیلتر" : "افزودن فیلتر جدید"}
            </span>
          </div>
        </ModalHeader>

        <ModalBody>
          <div className="space-y-6">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
                <FaTag className="text-blue-500" />
                اطلاعات پایه
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="نام فیلتر"
                  placeholder="نام فیلتر را وارد کنید"
                  value={formData.name || ""}
                  onValueChange={(value) => handleInputChange("name", value)}
                  isRequired
                  variant="bordered"
                  classNames={{
                    input: "text-right",
                    label: "text-right",
                  }}
                />
                <Input
                  label="نام انگلیسی"
                  placeholder="English filter name"
                  value={formData.enName || ""}
                  onValueChange={(value) => handleInputChange("enName", value)}
                  isRequired
                  variant="bordered"
                  classNames={{
                    input: "text-left font-mono",
                    label: "text-right",
                  }}
                />
              </div>
            </div>

            <Divider />

            {/* Filter Types Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
                <FaCog className="text-green-500" />
                انواع فیلتر
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="نوع ورودی در ایجاد آگهی"
                  placeholder="انتخاب کنید"
                  selectedKeys={
                    formData.adInputType ? [formData.adInputType] : []
                  }
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as FilterTypeEnum;
                    handleInputChange("adInputType", value);
                  }}
                  variant="bordered"
                  classNames={{
                    label: "text-right",
                    trigger: "text-right",
                  }}
                >
                  {filterTypeOptions.map((option) => (
                    <SelectItem key={option.key}>{option.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  label="نوع فیلتر در صفحه جستجو"
                  placeholder="انتخاب کنید"
                  selectedKeys={
                    formData.userFilterType ? [formData.userFilterType] : []
                  }
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as FilterTypeEnum;
                    handleInputChange("userFilterType", value);
                  }}
                  variant="bordered"
                  classNames={{
                    label: "text-right",
                    trigger: "text-right",
                  }}
                >
                  {filterTypeOptions.map((option) => (
                    <SelectItem key={option.key}>{option.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>

            <Divider />

            {/* Settings Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
                <FaCog className="text-purple-500" />
                تنظیمات
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Input
                    type="number"
                    label="ردیف نمایش"
                    placeholder="0"
                    value={formData.row?.toString() || "0"}
                    onValueChange={(value) =>
                      handleInputChange("row", parseInt(value) || 0)
                    }
                    variant="bordered"
                    classNames={{
                      input: "text-center",
                      label: "text-right",
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col gap-3">
                    <Checkbox
                      isSelected={formData.isRequired || false}
                      onValueChange={(checked) =>
                        handleInputChange("isRequired", checked)
                      }
                      color="warning"
                      className="text-right"
                    >
                      <span className="text-sm font-medium">فیلتر اجباری</span>
                    </Checkbox>

                    <Checkbox
                      isSelected={formData.isMain || false}
                      onValueChange={(checked) =>
                        handleInputChange("isMain", checked)
                      }
                      color="success"
                      className="text-right"
                    >
                      <span className="text-sm font-medium">
                        فیلتر اصلی (برای همه دسته‌ها)
                      </span>
                    </Checkbox>
                  </div>
                </div>
              </div>
            </div>

            {/* Categories Selection (only if not main filter) */}
            {!formData.isMain && (
              <>
                <Divider />
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
                    <FaTag className="text-orange-500" />
                    دسته‌بندی
                  </div>

                  <Select
                    label="انتخاب دسته‌بندی"
                    placeholder="دسته‌بندی مورد نظر را انتخاب کنید"
                    selectedKeys={formData.categories || []}
                    onSelectionChange={(keys) => {
                      setFormData((prev) => ({
                        ...prev,
                        categories: Array.from(keys) as string[],
                      }));
                    }}
                    variant="bordered"
                    isLoading={loadingCategories}
                    selectionMode="multiple"
                    classNames={{
                      label: "text-right",
                      trigger: "text-right",
                    }}
                  >
                    {categories.map((category) => (
                      <SelectItem key={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </>
            )}

            {/* Options (for ENUM type) */}
            {(formData.adInputType === FilterTypeEnum.ENUM ||
              formData.userFilterType === FilterTypeEnum.ENUM) && (
              <>
                <Divider />
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
                    <FaPlus className="text-green-500" />
                    گزینه‌های فیلتر
                  </div>

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
                      variant="bordered"
                      className="flex-1"
                      classNames={{
                        input: "text-right",
                      }}
                    />
                    <Button
                      color="primary"
                      onPress={handleAddOption}
                      isDisabled={!newOption.trim()}
                      startContent={<FaPlus />}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      افزودن
                    </Button>
                  </div>

                  {/* Display existing options */}
                  {formData.options && formData.options.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm text-gray-600">
                        گزینه‌های موجود:
                      </span>
                      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                        {formData.options.map((option, index) => (
                          <Chip
                            key={index}
                            onClose={() => handleRemoveOption(option)}
                            variant="flat"
                            color="primary"
                            className="text-right"
                          >
                            {option}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3">
          <Button
            variant="bordered"
            onPress={onClose}
            isDisabled={isSubmitting}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            انصراف
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!isFormValid}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {filter ? "به‌روزرسانی فیلتر" : "ایجاد فیلتر"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FilterFormModal;
