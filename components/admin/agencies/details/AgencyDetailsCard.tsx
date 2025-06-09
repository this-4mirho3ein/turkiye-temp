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
} from "react-icons/hi";
import { deleteAgency } from "@/controllers/makeRequest";
import mainConfig from "@/configs/mainConfig";

interface AgencyAddress {
  country?: string | { _id: string; name: string };
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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

  const renderAddress = () => {
    if (!agency.address) return "نامشخص";

    // If fullAddress is available, use it first
    if (agency.address.fullAddress) {
      return agency.address.fullAddress;
    }

    // Build address from location names (not IDs)
    const parts = [];

    // Check if these are location objects with names or just strings
    if (agency.address.area) {
      if (typeof agency.address.area === "object" && agency.address.area.name) {
        parts.push(agency.address.area.name);
      } else if (
        typeof agency.address.area === "string" &&
        !agency.address.area.match(/^[0-9a-fA-F]{24}$/)
      ) {
        // Only add if it's not a MongoDB ObjectId (24 hex characters)
        parts.push(agency.address.area);
      }
    }

    if (agency.address.city) {
      if (typeof agency.address.city === "object" && agency.address.city.name) {
        parts.push(agency.address.city.name);
      } else if (
        typeof agency.address.city === "string" &&
        !agency.address.city.match(/^[0-9a-fA-F]{24}$/)
      ) {
        parts.push(agency.address.city);
      }
    }

    if (agency.address.province) {
      if (
        typeof agency.address.province === "object" &&
        agency.address.province.name
      ) {
        parts.push(agency.address.province.name);
      } else if (
        typeof agency.address.province === "string" &&
        !agency.address.province.match(/^[0-9a-fA-F]{24}$/)
      ) {
        parts.push(agency.address.province);
      }
    }

    if (agency.address.country) {
      if (
        typeof agency.address.country === "object" &&
        agency.address.country.name
      ) {
        parts.push(agency.address.country.name);
      } else if (
        typeof agency.address.country === "string" &&
        !agency.address.country.match(/^[0-9a-fA-F]{24}$/)
      ) {
        parts.push(agency.address.country);
      }
    }

    return parts.length > 0 ? parts.join(", ") : "نامشخص";
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
          {/* Status Badges */}
          <div className="absolute top-6 left-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
              {agency.isVerified ? (
                <HiCheckCircle className="w-4 h-4 text-emerald-500" />
              ) : (
                <HiXCircle className="w-4 h-4 text-amber-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  agency.isVerified ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {agency.isVerified ? "تایید شده" : "در انتظار تایید"}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
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
                {agency.isActive ? "فعال" : "غیرفعال"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-6 right-6 flex gap-3">
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-3 bg-white/90 backdrop-blur-sm hover:bg-white text-indigo-600 hover:text-indigo-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-indigo-100"
                title="ویرایش آژانس"
              >
                <HiPencil className="w-5 h-5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className="p-3 bg-white/90 backdrop-blur-sm hover:bg-white text-red-600 hover:text-red-700 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                title="حذف آژانس"
              >
                <HiTrash className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Logo and Title */}
          <div className="flex items-center gap-6 mt-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-3xl overflow-hidden bg-white shadow-md border border-gray-100">
                <Image
                  src={logoUrl}
                  alt={agency.name}
                  width={96}
                  height={96}
                  className="object-cover w-full h-full"
                />
              </div>
              <div
                className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-3 border-white ${
                  agency.isActive ? "bg-emerald-400" : "bg-gray-400"
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {agency.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <HiLocationMarker className="w-5 h-5" />
                <span className="text-lg">{renderAddress()}</span>
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <HiClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {agency.activeAdCount}
              </p>
              <p className="text-sm text-gray-600">آگهی فعال</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <HiOfficeBuilding className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {agency.adQuota}
              </p>
              <p className="text-sm text-gray-600">سقف آگهی</p>
            </div>

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

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <HiLocationMarker className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">آدرس</p>
                    <p className="text-base font-medium text-gray-900">
                      {agency.address?.fullAddress || renderAddress()}
                    </p>
                  </div>
                </div>
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

          {/* Location Coordinates */}
          {agency.address?.location?.coordinates && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <HiGlobe className="w-5 h-5 text-green-600" />
                مختصات جغرافیایی
              </h3>
              <div className="bg-green-50 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">
                      طول جغرافیایی:
                    </span>
                    <span
                      className="text-base font-semibold text-gray-900"
                      dir="ltr"
                    >
                      {agency.address.location.coordinates[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-600">
                      عرض جغرافیایی:
                    </span>
                    <span
                      className="text-base font-semibold text-gray-900"
                      dir="ltr"
                    >
                      {agency.address.location.coordinates[1]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

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
