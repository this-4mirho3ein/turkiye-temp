"use client";

import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";

import { ReactNode } from "react";

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  headerTitle: string;
  body: ReactNode;
};

const ShareModal = ({
  isOpen,
  onClose,
  headerTitle,
  body,
}: ShareModalProps) => {
  return (
    <Modal isOpen={isOpen} size="sm" onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-row gap-1">
              {headerTitle}
            </ModalHeader>
            <ModalBody className="flex flex-row justify-around p-4 flex-wrap gap-2">
              {body}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ShareModal;
