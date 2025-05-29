"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { AdminFilter } from "@/types/interfaces";
import { FaTrash, FaExclamationTriangle } from "react-icons/fa";

interface DeleteFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  filter: AdminFilter | null;
  isSubmitting: boolean;
}

const DeleteFilterModal: React.FC<DeleteFilterModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  filter,
  isSubmitting,
}) => {
  if (!filter) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2 text-danger">
          <FaExclamationTriangle />
          تأیید حذف فیلتر
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-gray-700">
              آیا از حذف فیلتر زیر اطمینان دارید؟
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div>
                  <span className="font-medium">نام فیلتر:</span>
                  <span className="mr-2">{filter.name}</span>
                </div>
                <div>
                  <span className="font-medium">نام انگلیسی:</span>
                  <span className="mr-2 font-mono">{filter.enName}</span>
                </div>
                {filter.isMain && (
                  <div className="text-warning">
                    <FaExclamationTriangle className="inline mr-1" />
                    این فیلتر اصلی است و حذف آن ممکن است بر سایر بخش‌ها تأثیر بگذارد.
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600">
              این عملیات قابل بازگشت است و می‌توانید فیلتر را از بخش "فیلترهای حذف شده" بازیابی کنید.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} isDisabled={isSubmitting}>
            انصراف
          </Button>
          <Button
            color="danger"
            onPress={onConfirm}
            isLoading={isSubmitting}
            startContent={<FaTrash />}
          >
            حذف فیلتر
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteFilterModal; 