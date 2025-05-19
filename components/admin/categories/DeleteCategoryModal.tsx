import React from "react";
import {
  Modal,
  Button,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Category } from "./CategoryTable";
import { FaExclamationTriangle } from "react-icons/fa";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  category: Category | null;
  isSubmitting: boolean;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  category,
  isSubmitting,
}) => {
  if (!category) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="md">
      <ModalContent>
        <ModalHeader className="border-b border-gray-100">
          حذف دسته‌بندی
        </ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center text-center p-4">
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <FaExclamationTriangle className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-lg font-medium mb-2">آیا مطمئن هستید؟</h3>
            <p className="text-gray-500 mb-1">
              دسته‌بندی <span className="font-bold">{category.name}</span> حذف
              خواهد شد.
            </p>
            <p className="text-gray-500 text-sm">
              این عملیات قابل بازگشت است، اما پس از حذف، دسته‌بندی در لیست‌ها
              نمایش داده نخواهد شد.
            </p>
          </div>
        </ModalBody>
        <ModalFooter className="border-t border-gray-100">
          <Button
            variant="flat"
            onClick={onClose}
            disabled={isSubmitting}
            className="ml-2"
          >
            انصراف
          </Button>
          <Button color="danger" onClick={onConfirm} isLoading={isSubmitting}>
            حذف
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteCategoryModal;
