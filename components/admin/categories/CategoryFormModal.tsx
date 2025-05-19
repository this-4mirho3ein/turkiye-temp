import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
  Divider,
} from "@heroui/react";
import { Category } from "./CategoryTable";
import { getAdminPropertyTypes } from "@/controllers/makeRequest";
import { FaSave, FaLayerGroup, FaGlobe, FaSort, FaCheck, FaTimes, FaBuilding } from "react-icons/fa";
import { motion } from "framer-motion";

interface PropertyType {
  _id: string;
  type: string;
  enName?: string;
  isDeleted?: boolean;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Category>) => void;
  category: Category | null;
  isSubmitting: boolean;
}

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    }
  }
};

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  isSubmitting,
}) => {
  const [name, setName] = useState("");
  const [enName, setEnName] = useState("");
  const [row, setRow] = useState("1");
  const [propertyTypeId, setPropertyTypeId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [isLoadingPropertyTypes, setIsLoadingPropertyTypes] = useState(false);

  // Load property types when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPropertyTypes();
    }
  }, [isOpen]);

  // Populate form fields when editing a category
  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setEnName(category.enName || "");
      setRow(String(category.row || 1));

      // Handle different propertyType formats
      if (typeof category.propertyType === "string") {
        setPropertyTypeId(category.propertyType);
      } else if (
        category.propertyType &&
        typeof category.propertyType === "object"
      ) {
        setPropertyTypeId(category.propertyType._id || "");
      }

      setIsActive(category.isActive !== false);
    } else {
      // Reset form for new category
      setName("");
      setEnName("");
      setRow("1");
      setPropertyTypeId("");
      setIsActive(true);
    }

    setErrors({});
  }, [category, isOpen]);

  const fetchPropertyTypes = async () => {
    setIsLoadingPropertyTypes(true);
    try {
      const data = await getAdminPropertyTypes();
      setPropertyTypes(data);
    } catch (error) {
      console.error("Error fetching property types:", error);
    } finally {
      setIsLoadingPropertyTypes(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "نام دسته‌بندی الزامی است";
    }

    if (!propertyTypeId) {
      newErrors.propertyTypeId = "انتخاب نوع کاربری الزامی است";
    }

    const rowNum = Number(row);
    if (isNaN(rowNum) || rowNum < 1) {
      newErrors.row = "ردیف باید عدد بزرگتر از صفر باشد";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSave({
      name,
      enName,
      row: Number(row),
      propertyType: propertyTypeId,
      isActive,
    });
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl" className="rtl">
      <ModalContent className="max-w-3xl p-0">
        <ModalHeader className="bg-gradient-to-r from-primary-50 to-indigo-50 text-xl border-b border-indigo-100">
          {category ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی جدید"}
        </ModalHeader>
        
        <Divider />

        <ModalBody className="p-0">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={formVariants}
            className="p-6"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center">
                  <FaLayerGroup className="text-primary w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {category ? `ویرایش دسته‌بندی: ${category.name}` : "افزودن دسته‌بندی جدید"}
                </h2>
                <p className="text-gray-500 text-sm">
                  اطلاعات دسته‌بندی را در فرم زیر وارد کنید
                </p>
              </div>
            </motion.div>
            
            <form onSubmit={handleSubmit}>
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                <motion.h3 
                  variants={itemVariants}
                  className="text-lg font-bold text-gray-700 mb-4 border-r-4 border-primary pr-2"
                >
                  اطلاعات پایه
                </motion.h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      نام دسته‌بندی
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: آپارتمان"
                      startContent={<FaLayerGroup className="text-gray-400" />}
                      className={`focus:border-primary focus:ring-primary ${
                        errors.name ? "border-red-500" : ""
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      نام انگلیسی
                    </label>
                    <Input
                      value={enName}
                      onChange={(e) => setEnName(e.target.value)}
                      placeholder="مثال: apartment"
                      dir="ltr"
                      startContent={<FaGlobe className="text-gray-400" />}
                      className="focus:border-primary focus:ring-primary"
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      ردیف نمایش
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={row}
                      onChange={(e) => setRow(e.target.value)}
                      startContent={<FaSort className="text-gray-400" />}
                      className={`focus:border-primary focus:ring-primary ${
                        errors.row ? "border-red-500" : ""
                      }`}
                    />
                    {errors.row && (
                      <p className="mt-1 text-xs text-red-600">{errors.row}</p>
                    )}
                  </motion.div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                <motion.h3
                  variants={itemVariants}
                  className="text-lg font-bold text-gray-700 mb-4 border-r-4 border-primary pr-2"
                >
                  اطلاعات بیشتر
                </motion.h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      نوع کاربری
                    </label>
                    <div className={`relative ${isLoadingPropertyTypes ? 'opacity-70' : ''}`}>
                      <select
                        value={propertyTypeId}
                        onChange={(e) => setPropertyTypeId(e.target.value)}
                        className={`w-full rounded-md border p-2 pr-10 focus:outline-none focus:border-primary focus:ring-primary ${
                          errors.propertyTypeId ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={isLoadingPropertyTypes}
                      >
                        <option value="">انتخاب نوع کاربری</option>
                        {propertyTypes
                          .filter((pt) => !pt.isDeleted)
                          .map((pt) => (
                            <option key={pt._id} value={pt._id}>
                              {pt.type}
                            </option>
                          ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FaBuilding className="text-gray-400" />
                      </div>
                    </div>
                    {errors.propertyTypeId && (
                      <p className="mt-1 text-xs text-red-600">{errors.propertyTypeId}</p>
                    )}
                    {isLoadingPropertyTypes && (
                      <p className="mt-1 text-xs text-blue-600">در حال بارگذاری انواع کاربری...</p>
                    )}
                  </motion.div>

                  <motion.div variants={itemVariants} className="space-y-2 flex items-center">
                    <div className="p-4 bg-white rounded-lg border border-gray-200 w-full">
                      <label className="flex items-center cursor-pointer">
                        <Checkbox
                          checked={isActive}
                          onChange={(e) => setIsActive(e.target.checked)}
                          className="ml-2"
                        />
                        <div>
                          <div className="font-medium text-gray-700">وضعیت فعال</div>
                          <p className="text-gray-500 text-xs">
                            دسته‌بندی‌های فعال در سایت نمایش داده می‌شوند
                          </p>
                        </div>
                        <div className="mr-auto">
                          {isActive ? (
                            <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                              <FaCheck className="ml-1" size={10} />
                              فعال
                            </div>
                          ) : (
                            <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                              <FaTimes className="ml-1" size={10} />
                              غیرفعال
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </motion.div>
                </div>
              </div>
            </form>
          </motion.div>
        </ModalBody>

        <ModalFooter>
          <div className="flex flex-col md:flex-row gap-2 w-full rtl">
            <Button
              color="primary"
              type="submit"
              variant="solid"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="flex-1 order-2 md:order-1 py-2"
            >
              <FaSave className="ml-2" />
              <span>{category ? "بروزرسانی دسته‌بندی" : "ایجاد دسته‌بندی"}</span>
            </Button>
            
            <Button
              color="danger"
              variant="light"
              onPress={onClose}
              className="order-1 md:order-2 py-2"
            >
              <FaTimes className="ml-2" />
              <span>انصراف</span>
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CategoryFormModal;
