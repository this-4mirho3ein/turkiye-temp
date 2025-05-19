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
import { FaExclamationTriangle, FaTrash, FaTimes } from "react-icons/fa";
import { Region } from "@/components/admin/data/regions";
import { motion } from "framer-motion";

type DeleteRegionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  regionToDelete: Region | null;
  isLoading?: boolean;
};

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
              {regionToDelete
                ? `آیا از حذف ${regionToDelete.name} اطمینان دارید؟`
                : "آیا از حذف این مورد اطمینان دارید؟"}
            </p>
            
            <p className="text-sm text-gray-500">
              این عملیات قابل بازگشت نیست.
            </p>
          </div>
        </motion.div>
      </ModalBody>
      
      <ModalFooter>
        <div className="flex flex-col md:flex-row gap-2 w-full rtl">
          <Button
            color="danger"
            variant="solid"
            onClick={onConfirm}
            isLoading={isLoading}
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

export default DeleteRegionModal;
