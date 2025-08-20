import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Divider,
} from "@heroui/react";
import Button from "@/components/admin/ui/Button";
import Input from "@/components/admin/ui/Input";
import { Region } from "@/components/admin/data/regions";
import { FaCheck, FaTimes, FaGlobe, FaMapMarkedAlt, FaMapPin, FaCity } from "react-icons/fa";
import { motion } from "framer-motion";

type RegionFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: {
    name: string;
    slug: string;
    parentId: string;
    enName: string;
    code: string;
    phoneCode: string;
  };
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  type: "provinces" | "cities" | "areas";
  typeTitle: string;
  parentRegions: Region[];
  selectedRegion: Region | null;
  isLoading?: boolean;
};

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

// Function to get the appropriate icon based on region type
const getRegionTypeIcon = (type: string) => {
  switch (type) {
    case "provinces":
      return FaMapMarkedAlt;
    case "cities":
      return FaCity;
    case "areas":
      return FaMapPin;
    default:
      return FaGlobe;
  }
};

const RegionFormModal: React.FC<RegionFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  formData,
  onInputChange,
  type,
  typeTitle,
  parentRegions,
  selectedRegion,
  isLoading = false,
}) => {
  const RegionIcon = getRegionTypeIcon(type);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" className="rtl">
      <ModalContent className="max-w-3xl p-0">
        <ModalHeader className="bg-gradient-to-r from-primary-50 to-indigo-50 text-xl">
          {selectedRegion ? `ویرایش ${typeTitle}` : `افزودن ${typeTitle} جدید`}
        </ModalHeader>
        <Divider />
        <ModalBody className="max-h-[80vh] overflow-y-auto p-0 rtl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={formVariants}
            className="p-6"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center">
                  <RegionIcon className="text-primary w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedRegion 
                    ? `ویرایش ${typeTitle}: ${selectedRegion.name}` 
                    : `افزودن ${typeTitle} جدید`}
                </h2>
                <p className="text-gray-500 text-sm">
                  اطلاعات {typeTitle} را در فرم زیر وارد کنید
                </p>
              </div>
            </motion.div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-100">
              <motion.h3
                variants={itemVariants}
                className="text-lg font-bold text-gray-700 mb-4 border-r-4 border-primary pr-2"
              >
                اطلاعات پایه
              </motion.h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نام {typeTitle} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    placeholder={`نام ${typeTitle} را وارد کنید`}
                    value={formData.name}
                    onChange={onInputChange}
                    startContent={<RegionIcon className="text-gray-400" />}
                    disabled={isLoading}
                    required
                    className="w-full"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نام انگلیسی <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="enName"
                    placeholder={`نام انگلیسی ${typeTitle} را وارد کنید`}
                    value={formData.enName}
                    onChange={onInputChange}
                    startContent={<FaGlobe className="text-gray-400" />}
                    disabled={isLoading}
                    required
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    نام انگلیسی به حروف لاتین (مانند:{" "}
                    {type === "provinces"
                      ? "East Azerbaijan"
                      : type === "cities"
                      ? "Tehran"
                      : "Valiasr"}
                    )
                  </p>
                </motion.div>


          
                  <motion.div variants={itemVariants}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {
                        type === "cities"
                        ? "استان"
                        : "شهر"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="parentId"
                      value={formData.parentId}
                      onChange={onInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
                      disabled={isLoading}
                      required
                    >
                      <option value="">انتخاب کنید</option>
                      {parentRegions.map((parent) => (
                        <option
                          key={parent.id}
                          value={parent.originalId || parent.id}
                        >
                          {parent.name}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                

                <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
                  <div className="p-3 bg-gray-100 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">توجه:</span> کد {typeTitle} و اسلاگ به
                      صورت خودکار تولید می‌شوند و نیازی به وارد کردن آنها نیست.
                    </p>
                    {selectedRegion && selectedRegion.code && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">کد فعلی:</span>{" "}
                        {selectedRegion.code}
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </ModalBody>

        <ModalFooter>
          <div className="flex flex-col md:flex-row gap-2 w-full rtl">
            <Button
              color="primary"
              variant="solid"
              onClick={onSave}
              isLoading={isLoading}
              className="flex-1 order-2 md:order-1 py-2"
            >
              <FaCheck className="ml-2" />
              <span>{selectedRegion ? "بروزرسانی اطلاعات" : `ثبت ${typeTitle}`}</span>
            </Button>

            <Button
              color="danger"
              variant="light"
              onPress={onClose}
              className="order-1 md:order-2 py-2"
              disabled={isLoading}
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

export default RegionFormModal;
