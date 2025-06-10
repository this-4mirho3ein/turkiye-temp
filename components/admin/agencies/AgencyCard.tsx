"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiPhone,
  HiUser,
  HiMail,
  HiUsers,
  HiCalendar,
  HiClipboardList,
  HiPencil,
  HiTrash,
  HiCheckCircle,
  HiXCircle,
  HiLocationMarker,
} from "react-icons/hi";
import { deleteAgency } from "@/controllers/makeRequest";
import mainConfig from "@/configs/mainConfig";

interface Agency {
  _id: string;
  name: string;
  phone: string;
  owner: {
    _id: string;
    phone: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  consultants: any[];
  areaAdmins: any[];
  adQuota: number;
  isActive: boolean;
  isVerified: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
  activeAdCount?: number;
  logo?: {
    _id: string;
    fileName: string;
  };
  address?: {
    country?: string;
    province?: string;
    city?: string;
    area?: string;
    fullAddress?: string;
  };
}

interface AgencyCardProps {
  agency: Agency;
  onEdit: (agency: Agency) => void;
  onDelete: (agencyId: string) => void;
}

const AgencyCard: React.FC<AgencyCardProps> = ({
  agency,
  onEdit,
  onDelete,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      const response = await deleteAgency(agency._id);

      if (response.success) {
        onDelete(agency._id);
        setShowDeleteModal(false);
      } else {
        console.error("Delete failed:", response.message);
      }
    } catch (error) {
      console.error("Error deleting agency:", error);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR");
  };

  // Location display has been removed

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden">
        <Link href={`/admin/agencies/${agency._id}`} className="block">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Logo */}
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {agency.logo?.fileName ? (
                    <Image
                      src={`${mainConfig.fileServer}/${agency.logo.fileName}`}
                      alt={agency.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <HiUser className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                {/* Basic Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {agency.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        agency.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {agency.isVerified ? "تایید شده" : "در انتظار تایید"}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        agency.isActive
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {agency.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions moved to bottom */}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Owner */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiUser className="w-4 h-4" />
              <span>
                {agency.owner.firstName} {agency.owner.lastName}
              </span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <HiPhone className="w-4 h-4" />
              <span>{agency.phone}</span>
            </div>

            {/* Location has been removed */}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {agency.consultants?.length || 0}
                </div>
                <div className="text-xs text-gray-500">مشاور</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {agency.activeAdCount || 0}
                </div>
                <div className="text-xs text-gray-500">آگهی فعال</div>
              </div>
              {/* Ad quota has been removed */}
            </div>
          </div>
        </Link>

        {/* Bottom action buttons in one row */}
        <div className="flex justify-center items-center gap-2 p-3 border-t border-gray-100">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEdit(agency);
            }}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <HiPencil className="w-4 h-4" />
            <span>ویرایش</span>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
          >
            <HiTrash className="w-4 h-4" />
            <span>حذف</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              حذف آژانس
            </h3>
            <p className="text-gray-600 mb-4">
              آیا از حذف آژانس <strong>{agency.name}</strong> اطمینان دارید؟
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={deleting}
              >
                انصراف
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {deleting ? "در حال حذف..." : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AgencyCard;
