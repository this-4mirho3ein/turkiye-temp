"use client";

import React from "react";
import {
  HiPhone,
  HiUser,
  HiMail,
  HiUsers,
  HiCalendar,
  HiClipboardList,
} from "react-icons/hi";

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
  activeAdCount: number;
  logo?: {
    _id: string;
    fileName: string;
  };
}

interface AgencyCardProps {
  agency: Agency;
}

const AgencyCard: React.FC<AgencyCardProps> = ({ agency }) => {
  const createdDate = new Date(agency.createdAt).toLocaleDateString("fa-IR");

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
      <div className="relative p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
        <div className="absolute top-4 left-4 flex gap-2">
          <span
            className={`px-3 py-1.5 text-xs font-bold rounded-full ${
              agency.isActive
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {agency.isActive ? "فعال" : "غیرفعال"}
          </span>
          <span
            className={`px-3 py-1.5 text-xs font-bold rounded-full ${
              agency.isVerified
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
            }`}
          >
            {agency.isVerified ? "تایید شده" : "تایید نشده"}
          </span>
        </div>

        <h3 className="text-2xl font-extrabold text-gray-800 mb-2 mt-4">
          {agency.name}
        </h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2 leading-relaxed">
          {agency.description || "بدون توضیحات"}
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <HiPhone className="w-5 h-5 text-purple-600 ml-3" />
            <span className="text-gray-800 font-semibold">
              شماره تماس: {agency.phone}
            </span>
          </div>

          <div className="flex items-center">
            <HiUser className="w-5 h-5 text-purple-600 ml-3" />
            <span className="text-gray-800 font-semibold">
              مدیر: {agency.owner?.firstName || 'نامشخص'} {agency.owner?.lastName || ''}
            </span>
          </div>

          <div className="flex items-center">
            <HiMail className="w-5 h-5 text-purple-600 ml-3" />
            <span className="text-gray-800 font-semibold truncate">
              ایمیل: {agency.owner?.email || 'نامشخص'}
            </span>
          </div>

          <div className="flex items-center">
            <HiUsers className="w-5 h-5 text-purple-600 ml-3" />
            <span className="text-gray-800 font-semibold">
              تعداد مشاوران: {agency.consultants.length} نفر
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 p-5 bg-gray-50">
        <div className="flex justify-between text-sm">
          <div className="flex items-center">
            <HiCalendar className="w-4 h-4 text-purple-500 ml-2" />
            <span className="text-gray-700 font-medium">
              تاریخ ثبت: {createdDate}
            </span>
          </div>
          <div className="flex items-center">
            <HiClipboardList className="w-4 h-4 text-purple-500 ml-2" />
            <span className="text-gray-700 font-medium">
              آگهی‌های فعال: {agency.activeAdCount} از {agency.adQuota}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgencyCard;
