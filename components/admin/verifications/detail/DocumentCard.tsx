"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaFileAlt,
  FaInfoCircle,
  FaSpinner,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Card, Badge, Button, Spinner } from "@heroui/react";
import { reviewAgencyVerification } from "@/controllers/makeRequest";
import mainConfig from "@/configs/mainConfig";

interface DocumentFile {
  _id: string;
  url: string;
  fileName: string;
  size: number;
}

interface DocumentProps {
  _id: string;
  documentType: string;
  name: string;
  description: string;
  status: string;
  uploadedAt: string;
  verificationNotes: string;
  file: DocumentFile;
  agencyId: string;
  onReviewComplete?: () => void;
}

const DocumentCard: React.FC<DocumentProps> = ({
  _id,
  documentType,
  name,
  description,
  status,
  uploadedAt,
  verificationNotes,
  file,
  agencyId,
  onReviewComplete,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isMoreInfoModalOpen, setIsMoreInfoModalOpen] = useState(false);
  const [notes, setNotes] = useState(verificationNotes);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Format the file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get document type in Persian
  const getDocumentTypePersian = (type: string) => {
    switch (type) {
      case "business_license":
        return "جواز کسب";
      case "national_card":
        return "کارت ملی";
      case "identity_proof":
        return "مدرک هویتی";
      default:
        return type;
    }
  };

  // Handle document review
  const handleReview = async (
    action: "approved" | "rejected" | "request_more_info"
  ) => {
    setIsSubmitting(true);
    setReviewError(null);

    try {
      const response = await reviewAgencyVerification({
        agencyId,
        action,
        documentIds: _id,
        documentNotes: notes,
      });

      if (response.success) {
        // Close all modals
        setIsApproveModalOpen(false);
        setIsRejectModalOpen(false);
        setIsMoreInfoModalOpen(false);
        // Call the callback if provided
        if (onReviewComplete) {
          onReviewComplete();
        }
      } else {
        setReviewError(response.message || "خطا در بررسی مدرک");
      }
    } catch (error) {
      console.error("Error reviewing document:", error);
      setReviewError("خطا در بررسی مدرک");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status badge
  const getStatusBadge = () => {
    switch (status) {
      case "approved":
        return (
          <Badge color="success" variant="flat" size="sm">
            تأیید شده
          </Badge>
        );
      case "rejected":
        return (
          <Badge color="danger" variant="flat" size="sm">
            رد شده
          </Badge>
        );
      default:
        return (
          <Badge color="warning" variant="flat" size="sm">
            در انتظار بررسی
          </Badge>
        );
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FaFileAlt className="text-indigo-600" />
            {name}{" "}
            <span className="text-sm text-gray-500">
              ({getDocumentTypePersian(documentType)})
            </span>
          </h3>
          {getStatusBadge()}
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      <div className="p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-500">
            <span>اندازه فایل: {formatFileSize(file.size)}</span>
            <span className="mx-2">•</span>
            <span>تاریخ بارگذاری: {formatDate(uploadedAt)}</span>
          </div>
          <Button
            onClick={() => setIsPreviewOpen(true)}
            variant="light"
            color="primary"
            size="sm"
            className="flex items-center gap-1"
          >
            <FaEye />
            <span>مشاهده</span>
          </Button>
        </div>

        <div className="flex gap-2 mt-4">
          {status === "pending" && (
            <>
              <Button
                onClick={() => setIsApproveModalOpen(true)}
                color="success"
                className="flex-1 flex items-center justify-center gap-2"
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <FaCheck />
                )}
                <span>تأیید مدرک</span>
              </Button>
              <Button
                onClick={() => setIsRejectModalOpen(true)}
                color="danger"
                className="flex-1 flex items-center justify-center gap-2"
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <FaTimes />
                )}
                <span>رد مدرک</span>
              </Button>
              <Button
                onClick={() => setIsMoreInfoModalOpen(true)}
                color="primary"
                className="flex-1 flex items-center justify-center gap-2"
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <FaInfoCircle />
                )}
                <span>درخواست اطلاعات</span>
              </Button>
            </>
          )}
          {status !== "pending" && (
            <Badge
              color="default"
              variant="flat"
              className="flex-1 py-2 flex items-center justify-center gap-2"
            >
              <span>بررسی شده</span>
            </Badge>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">{name}</h3>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4 flex justify-center">
              <div className="relative w-full h-[500px]">
                <Image
                  src={`${mainConfig.apiServer}/api/upload/media/${file._id}`}
                  alt={name}
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
            </div>
            <div className="p-4 border-t">
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                placeholder="یادداشت‌های بررسی..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {isApproveModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-green-600">
                تأیید مدرک
              </h3>
              <button
                onClick={() => setIsApproveModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-4">
                آیا از تأیید مدرک <strong>{name}</strong> اطمینان دارید؟
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  یادداشت بررسی
                </label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="یادداشت بررسی مدرک..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isSubmitting}
                ></textarea>
              </div>

              {reviewError && (
                <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md">
                  {reviewError}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsApproveModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={isSubmitting}
                >
                  انصراف
                </button>
                <button
                  onClick={() => handleReview("approved")}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaCheck />
                  )}
                  تأیید مدرک
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-red-600">رد مدرک</h3>
              <Button
                onClick={() => setIsRejectModalOpen(false)}
                isIconOnly
                variant="light"
                size="sm"
                disabled={isSubmitting}
              >
                <FaTimes />
              </Button>
            </div>
            <div className="p-6">
             

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  یادداشت بررسی
                </label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="یادداشت بررسی مدرک..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isSubmitting}
                ></textarea>
              </div>

              {reviewError && (
                <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md">
                  {reviewError}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setIsRejectModalOpen(false)}
                  variant="flat"
                  color="default"
                  disabled={isSubmitting}
                >
                  انصراف
                </Button>
                <Button
                  onClick={() => handleReview("rejected")}
                  color="danger"
                  className="flex items-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spinner size="sm" color="current" />
                  ) : (
                    <FaTimes />
                  )}
                  رد مدرک
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Request More Info Modal */}
      {isMoreInfoModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-600">
                درخواست اطلاعات بیشتر
              </h3>
              <button
                onClick={() => setIsMoreInfoModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-6">
              <p className="mb-4">
                لطفاً اطلاعات بیشتری که برای مدرک <strong>{name}</strong> نیاز
                دارید را مشخص کنید:
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  درخواست اطلاعات <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  placeholder="اطلاعات مورد نیاز..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={isSubmitting}
                  required
                ></textarea>
              </div>

              {reviewError && (
                <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md">
                  {reviewError}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsMoreInfoModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={isSubmitting}
                >
                  انصراف
                </button>
                <button
                  onClick={() => handleReview("request_more_info")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  disabled={isSubmitting || !notes.trim()}
                >
                  {isSubmitting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaInfoCircle />
                  )}
                  ارسال درخواست
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DocumentCard;
