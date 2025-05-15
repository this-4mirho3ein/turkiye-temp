import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Divider } from "@heroui/react";
import Button from "@/components/admin/ui/Button";
import { FaExclamationTriangle } from "react-icons/fa";
import { Region } from "@/components/admin/data/regions";

type DeleteRegionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  regionToDelete: Region | null;
  isLoading?: boolean;
};

const DeleteRegionModal: React.FC<DeleteRegionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  regionToDelete,
  isLoading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} size="sm">
    <ModalContent>
      <ModalHeader className="text-danger flex items-center gap-2">
        <FaExclamationTriangle />
        <span>تأیید حذف</span>
      </ModalHeader>
      <Divider />
      <ModalBody>
        <div className="py-4 text-center">
          <p className="mb-4">
            {regionToDelete
              ? `آیا از حذف ${regionToDelete.name} اطمینان دارید؟`
              : "آیا از حذف این مورد اطمینان دارید؟"}
          </p>
          <p className="text-sm text-gray-500">این عملیات قابل بازگشت نیست.</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          variant="light"
          onPress={onClose}
          aria-label="انصراف"
          tabIndex={0}
          disabled={isLoading}
        >
          انصراف
        </Button>
        <Button
          color="danger"
          onPress={onConfirm}
          aria-label="تأیید حذف"
          tabIndex={0}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? "در حال حذف..." : "تأیید حذف"}
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default DeleteRegionModal;
