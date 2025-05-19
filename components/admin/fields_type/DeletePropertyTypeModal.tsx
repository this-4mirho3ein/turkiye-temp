"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Divider,
} from "@heroui/react";
import { FaExclamationTriangle, FaTrash, FaTimes } from "react-icons/fa";
import { PropertyType } from "./PropertyTypeTable";
import { motion } from "framer-motion";

interface DeletePropertyTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  propertyType: PropertyType | null;
  isSubmitting: boolean;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const DeletePropertyTypeModal: React.FC<DeletePropertyTypeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  propertyType,
  isSubmitting,
}) => {
  if (!propertyType) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="md">
      <ModalContent>
        <ModalHeader className="text-danger flex items-center gap-2">
          <FaExclamationTriangle />
          <span>تأیید حذف</span>
        </ModalHeader>
        <Divider />
        <ModalBody className="p-0">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={modalVariants}
            className="py-8 px-4"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 flex items-center justify-center bg-red-100 rounded-full mb-4">
                <FaExclamationTriangle className="text-red-500 text-3xl" />
              </div>
              
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                آیا از حذف این مورد اطمینان دارید؟
              </h3>
              
              <p className="text-gray-600 mb-3">
                شما در حال حذف نوع کاربری{" "}
                <span className="font-bold text-red-600">
                  {propertyType.type}
                </span>{" "}
                هستید.
              </p>
              
              <p className="text-sm text-gray-500">
                این عملیات قابل بازگشت نیست.
              </p>
              
              {propertyType.adCount > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-red-600 mt-4 p-4 bg-red-50 rounded-lg border border-red-200 w-full"
                >
                  <p className="font-bold flex items-center">
                    <FaExclamationTriangle className="ml-2" />
                    هشدار!
                  </p>
                  <p>
                    این نوع کاربری دارای {propertyType.adCount} آگهی فعال است. حذف
                    آن ممکن است باعث ایجاد مشکلاتی در سیستم شود.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </ModalBody>
        
        <ModalFooter>
          <div className="flex flex-col md:flex-row gap-2 w-full rtl">
            <Button
              color="danger"
              variant="solid"
              onClick={onConfirm}
              isLoading={isSubmitting}
              className="flex-1 order-2 md:order-1 py-2"
            >
              <FaTrash className="ml-2" />
              <span>تأیید حذف</span>
            </Button>

            <Button
              color="primary"
              variant="light"
              onPress={onClose}
              className="order-1 md:order-2 py-2"
              disabled={isSubmitting}
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

export default DeletePropertyTypeModal;
