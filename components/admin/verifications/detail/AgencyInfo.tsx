"use client";

import React from "react";
import { FaBuilding, FaUser, FaPhone, FaClock } from "react-icons/fa";
import { motion } from "framer-motion";
import { Badge } from "@heroui/react";

interface OwnerInfo {
  name: string;
  phone: string;
}

interface AgencyInfoProps {
  agencyName: string;
  ownerInfo: OwnerInfo;
  status: string;
  submittedAt: string;
}

const AgencyInfo: React.FC<AgencyInfoProps> = ({
  agencyName,
  ownerInfo,
  status,
  submittedAt,
}) => {
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

  // Get status badge
  const getStatusBadge = () => {
    switch (status) {
      case "approved":
        return (
          <Badge color="success" variant="solid">
            تأیید شده
          </Badge>
        );
      case "rejected":
        return (
          <Badge color="danger" variant="solid">
            رد شده
          </Badge>
        );
      case "request_more_info":
        return (
          <Badge color="warning" variant="solid">
            درخواست اطلاعات بیشتر
          </Badge>
        );
      default:
        return (
          <Badge color="warning" variant="solid">
            در انتظار بررسی
          </Badge>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center mb-6 pb-3 border-b">
        <h2 className="text-xl font-bold text-gray-900">اطلاعات آژانس</h2>
        {getStatusBadge()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center shadow-sm">
            <FaBuilding className="text-indigo-600 text-lg" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">نام آژانس</p>
            <p className="font-semibold text-gray-900">{agencyName}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
            <FaUser className="text-blue-600 text-lg" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">نام مالک</p>
            <p className="font-semibold text-gray-900">
              {ownerInfo?.name || ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
            <FaPhone className="text-green-600 text-lg" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">شماره تماس</p>
            <p className="font-semibold text-gray-900 dir-ltr">
              {ownerInfo?.phone || ""}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shadow-sm">
            <FaClock className="text-amber-600 text-lg" />
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">تاریخ ثبت درخواست</p>
            <p className="font-semibold text-gray-900">
              {formatDate(submittedAt)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AgencyInfo;
