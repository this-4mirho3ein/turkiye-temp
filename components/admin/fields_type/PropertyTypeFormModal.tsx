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
  Checkbox,
  Divider,
  addToast,
  RadioGroup,
  Radio,
} from "@heroui/react";
import { PropertyType } from "./PropertyTypeTable";
import {
  FaSave,
  FaTimes,
  FaListAlt,
  FaGlobe,
  FaSort,
  FaCheck,
  FaBan,
} from "react-icons/fa";
import { motion } from "framer-motion";
import mainConfig from "@/configs/mainConfig";
import axios from "axios";

interface PropertyTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<PropertyType>) => Promise<any>;
  propertyType: PropertyType | null;
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
      staggerChildren: 0.1,
    },
  },
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
    },
  },
};

const PropertyTypeFormModal: React.FC<PropertyTypeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  propertyType,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState({
    type: "",
    enName: "",
    row: 1,
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch property type data from API when editing
  useEffect(() => {
    const fetchPropertyTypeData = async () => {
      if (propertyType && isOpen) {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${mainConfig.apiServer}/admin/property-type/get-property-type/${propertyType._id}`
          );

          if (response.data) {
            // Parse the response data properly
            let data;
            try {
              data =
                typeof response.data === "string"
                  ? JSON.parse(response.data)
                  : response.data;
            } catch (parseError) {
              console.error("Error parsing response data:", parseError);
              data = response.data; // Use as is if can't parse
            }

            console.log("Fetched property type data:", data);

            // Update form with fetched data
            setFormData({
              type: data.type || propertyType.type || "",
              enName: data.enName || propertyType.enName || "",
              row: data.row || propertyType.row || 1,
              isActive:
                data.isActive !== undefined
                  ? data.isActive
                  : propertyType.isActive,
            });
          } else {
            // Fallback to existing data if API call fails
            setFormData({
              type: propertyType.type,
              enName: propertyType.enName,
              row: propertyType.row,
              isActive: propertyType.isActive,
            });
            console.error(
              "Error fetching property type data - no data:",
              response
            );
          }
        } catch (error) {
          console.error("Error fetching property type data:", error);
          // Fallback to existing data if API call fails
          setFormData({
            type: propertyType.type,
            enName: propertyType.enName,
            row: propertyType.row,
            isActive: propertyType.isActive,
          });

          addToast({
            title: "خطا",
            description: "دریافت اطلاعات نوع کاربری با خطا مواجه شد",
          });
        } finally {
          setIsLoading(false);
        }
      } else if (!propertyType) {
        // Reset form for new property type
        setFormData({
          type: "",
          enName: "",
          row: 1,
          isActive: true,
        });
      }
    };

    fetchPropertyTypeData();
  }, [propertyType, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle radio button change for active/inactive
  const handleActiveChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      isActive: value === "active",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Wait for the save operation and get the response
      const response = await onSave({
        ...formData,
      });

      // If there's a response with message, show it in the toast
      if (response && response.success) {
        addToast({
          title: "عملیات موفق",
          description: response.message || "عملیات با موفقیت انجام شد",
        });
      }
    } catch (error) {
      console.error("Error during save:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="2xl" className="rtl">
      <ModalContent className="max-w-3xl p-0">
        <ModalHeader className="bg-gradient-to-r from-primary-50 to-indigo-50 text-xl">
          {propertyType ? "ویرایش نوع کاربری" : "افزودن نوع کاربری جدید"}
        </ModalHeader>

        <Divider />

        <ModalBody className="max-h-[80vh] overflow-y-auto p-0 rtl">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
              <p className="mr-3 text-gray-600">در حال بارگذاری اطلاعات...</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={formVariants}
              className="p-6"
            >
              <motion.div variants={itemVariants} className="mb-8">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center">
                    <FaListAlt className="text-primary w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {propertyType
                      ? `ویرایش نوع کاربری: ${propertyType.type}`
                      : "افزودن نوع کاربری جدید"}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    اطلاعات نوع کاربری را در فرم زیر وارد کنید
                  </p>
                </div>
              </motion.div>

              <motion.form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
                  <motion.h3
                    variants={itemVariants}
                    className="text-lg font-bold text-gray-700 mb-4 border-r-4 border-primary pr-2"
                  >
                    اطلاعات پایه
                  </motion.h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div variants={itemVariants} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        عنوان نوع کاربری
                      </label>
                      <Input
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        placeholder="مثال: مسکونی"
                        required
                        startContent={<FaListAlt className="text-gray-400" />}
                        className="focus:border-primary focus:ring-primary"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        نام انگلیسی
                      </label>
                      <Input
                        name="enName"
                        value={formData.enName}
                        onChange={handleInputChange}
                        placeholder="مثال: housing"
                        required
                        dir="ltr"
                        startContent={<FaGlobe className="text-gray-400" />}
                        className="focus:border-primary focus:ring-primary"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        حروف انگلیسی و اعداد مجاز است.
                      </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ترتیب نمایش
                      </label>
                      <Input
                        name="row"
                        type="number"
                        min="1"
                        value={formData.row.toString()}
                        onChange={handleInputChange}
                        required
                        startContent={<FaSort className="text-gray-400" />}
                        className="focus:border-primary focus:ring-primary"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        وضعیت
                      </label>
                      <RadioGroup
                        value={formData.isActive ? "active" : "inactive"}
                        onValueChange={handleActiveChange}
                        orientation="horizontal"
                        className="flex gap-4"
                      >
                        <Radio value="active" className="text-primary">
                          <div className="flex items-center gap-2">
                            <FaCheck className="text-green-500" />
                            <span className="text-sm text-gray-700">فعال</span>
                          </div>
                        </Radio>
                        <Radio value="inactive" className="text-primary">
                          <div className="flex items-center gap-2">
                            <FaBan className="text-red-500" />
                            <span className="text-sm text-gray-700">
                              غیرفعال
                            </span>
                          </div>
                        </Radio>
                      </RadioGroup>
                    </motion.div>
                  </div>
                </div>
              </motion.form>
            </motion.div>
          )}
        </ModalBody>

        <ModalFooter>
          <div className="flex flex-col md:flex-row gap-2 w-full rtl">
            <Button
              color="primary"
              variant="solid"
              onClick={handleSubmit}
              isLoading={isSubmitting || isLoading}
              disabled={isLoading}
              className="flex-1 order-2 md:order-1 py-2"
            >
              <FaSave className="ml-2" />
              <span>
                {propertyType ? "بروزرسانی اطلاعات" : "ثبت نوع کاربری"}
              </span>
            </Button>

            <Button
              color="danger"
              variant="light"
              onPress={onClose}
              className="order-1 md:order-2 py-2"
              disabled={isSubmitting || isLoading}
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

export default PropertyTypeFormModal;
