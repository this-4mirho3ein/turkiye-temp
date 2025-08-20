"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  HiPhone,
  HiMail,
  HiUser,
  HiUsers,
  HiCalendar,
  HiClipboardList,
  HiLocationMarker,
  HiOfficeBuilding,
  HiCheckCircle,
  HiXCircle,
  HiPencil,
  HiTrash,
  HiGlobe,
  HiIdentification,
  HiClock,
  HiBadgeCheck,
} from "react-icons/hi";
import { deleteAgency, confirmAgency } from "@/controllers/makeRequest";
import mainConfig from "@/configs/mainConfig";

interface AgencyAddress {
  province?: string | { _id: string; name: string };
  city?: string | { _id: string; name: string };
  area?: string | { _id: string; name: string };
  location?: {
    coordinates: [number, number];
  };
  fullAddress?: string;
}

interface AgencyDetails {
  _id: string;
  name: string;
  phone: string;
  description: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  adQuota: number;
  activeAdCount?: number;
  logo?: {
    _id: string;
    fileName: string;
  };
  owner: {
    _id: string;
    phone: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  address: AgencyAddress;
  consultants: Array<{
    _id: string;
    phone: string;
    firstName: string;
    lastName: string;
  }>;
  areaAdmins: Array<{
    _id: string;
    phone: string;
    firstName: string;
    lastName: string;
  }>;
}

interface AgencyDetailsCardProps {
  agency: AgencyDetails;
  onEdit?: () => void;
  onDelete?: () => void;
}

const AgencyDetailsCard: React.FC<AgencyDetailsCardProps> = ({
  agency,
  onEdit,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const logoUrl = agency.logo?.fileName
    ? `${mainConfig.fileServer}/${agency.logo.fileName}`
    : "/placeholder-logo.png";

  const createdDate = new Date(agency.createdAt).toLocaleDateString("fa-IR");
  const updatedDate = new Date(agency.updatedAt).toLocaleDateString("fa-IR");

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteAgency(agency._id);

      if (response.success) {
        if (onDelete) {
          onDelete();
        }
      } else {
        alert(response.message || "خطا در حذف آژانس");
      }
    } catch (error: any) {
      alert(error.message || "خطا در حذف آژانس");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleConfirmClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmAgency = async () => {
    try {
      setIsConfirming(true);
      const response = await confirmAgency(
        agency._id,
        true,
        "آژانس شما توسط ادمین تایید شد."
      );

      if (response.success) {
        // Reload the page to show updated status
        window.location.reload();
      } else {
        alert(response.message || "خطا در تایید آژانس");
      }
    } catch (error: any) {
      alert(error.message || "خطا در تایید آژانس");
    } finally {
      setIsConfirming(false);
      setShowConfirmModal(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
  };

  // Location display has been removed

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header - Redesigned */}
        <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6">
          {/* Status and Actions Container - New flex layout */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            {/* Status Badges - Now horizontal */}
            <div className="flex flex-wrap gap-3">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm ${
                  agency.isVerified
                    ? "bg-emerald-50 border border-emerald-200"
                    : "bg-amber-50 border border-amber-200"
                }`}
              >
                {agency.isVerified ? (
                  <HiCheckCircle className="w-5 h-5 text-emerald-500" />
                ) : (
                  <HiXCircle className="w-5 h-5 text-amber-500" />
                )}
                <span
                  className={`text-sm font-medium ${
                    agency.isVerified ? "text-emerald-700" : "text-amber-700"
                  }`}
                >
                  {agency.isVerified ? "آژانس تایید شده" : "در انتظار تایید"}
                </span>
              </div>

              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm ${
                  agency.isActive
                    ? "bg-emerald-50 border border-emerald-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    agency.isActive ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    agency.isActive ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {agency.isActive ? "آژانس فعال" : "آژانس غیرفعال"}
                </span>
              </div>
            </div>

            {/* Action Buttons - Now with text labels */}
            <div className="flex flex-wrap gap-3">
              {/* Confirm Button - Only show if agency is not already verified */}
              {!agency.isVerified && (
                <button
                  onClick={handleConfirmClick}
                  disabled={isConfirming}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiBadgeCheck className="w-5 h-5" />
                  <span className="font-medium">تایید آژانس</span>
                </button>
              )}

              {onEdit && (
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-all duration-200"
                >
                  <HiPencil className="w-5 h-5" />
                  <span className="font-medium">ویرایش</span>
                </button>
              )}

              {onDelete && (
                <button
                  onClick={handleDeleteClick}
                  disabled={isDeleting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiTrash className="w-5 h-5" />
                  <span className="font-medium">حذف</span>
                </button>
              )}
            </div>
          </div>

          {/* Logo and Title - Redesigned */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-md border border-gray-100">
                <Image
                  src={logoUrl}
                  alt={agency.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                  agency.isActive ? "bg-emerald-400" : "bg-gray-400"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">
                {agency.name}
              </h1>
              <p className="text-gray-500 mt-1">
                کد آژانس: {agency._id.substring(agency._id.length - 8)}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <HiClipboardList className="w-5 h-5 text-blue-600" />
              توضیحات
            </h3>
            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
              {agency.description || "بدون توضیحات"}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <HiClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {agency.activeAdCount}
              </p>
              <p className="text-sm text-gray-600">آگهی فعال</p>
            </div>

            {/* سقف آگهی removed */}

            <div className="bg-emerald-50 rounded-xl p-4 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <HiCalendar className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {createdDate}
              </p>
              <p className="text-sm text-gray-600">تاریخ ثبت</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <HiClock className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm font-semibold text-gray-900 mb-1">
                {updatedDate}
              </p>
              <p className="text-sm text-gray-600">آخرین بروزرسانی</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Agency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HiOfficeBuilding className="w-5 h-5 text-blue-600" />
                اطلاعات تماس آژانس
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <HiPhone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">شماره تماس</p>
                    <p
                      className="text-lg font-semibold text-gray-900"
                      dir="ltr"
                    >
                      {agency.phone}
                    </p>
                  </div>
                </div>

                {/* Location display has been removed */}
              </div>
            </div>

            {/* Owner Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HiUser className="w-5 h-5 text-purple-600" />
                اطلاعات مدیر آژانس
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <HiIdentification className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">نام و نام خانوادگی</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {agency.owner?.firstName || "نامشخص"}{" "}
                      {agency.owner?.lastName || ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <HiPhone className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">شماره تماس</p>
                    <p
                      className="text-lg font-semibold text-gray-900"
                      dir="ltr"
                    >
                      {agency.owner?.phone || "نامشخص"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <HiMail className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">ایمیل</p>
                    <p
                      className="text-base font-medium text-gray-900 truncate"
                      dir="ltr"
                    >
                      {agency.owner?.email || "نامشخص"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Coordinates have been removed */}
        </div>

        {/* Confirm Agency Modal */}
        {showConfirmModal && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCancelConfirm}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <HiBadgeCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    تایید آژانس
                  </h3>
                  <p className="text-sm text-gray-500">
                    تایید آژانس برای فعالیت در سیستم
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                آیا از تایید آژانس{" "}
                <span className="font-semibold text-gray-900">
                  "{agency.name}"
                </span>{" "}
                اطمینان دارید؟
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelConfirm}
                  className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                  disabled={isConfirming}
                >
                  انصراف
                </button>
                <button
                  onClick={handleConfirmAgency}
                  disabled={isConfirming}
                  className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isConfirming ? "در حال تایید..." : "تایید آژانس"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCancelDelete}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <HiTrash className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">حذف آژانس</h3>
                  <p className="text-sm text-gray-500">
                    این عمل قابل بازگشت نیست
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                آیا از حذف آژانس{" "}
                <span className="font-semibold text-gray-900">
                  "{agency.name}"
                </span>{" "}
                اطمینان دارید؟
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                  disabled={isDeleting}
                >
                  انصراف
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "در حال حذف..." : "حذف"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AgencyDetailsCard;
