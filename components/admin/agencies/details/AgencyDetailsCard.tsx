"use client";

import React from "react";
import Image from "next/image";
import mainConfig from "@/configs/mainConfig";

interface AgencyOwner {
  _id: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AgencyConsultant {
  _id: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AgencyAreaAdmin {
  _id: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  area: string;
}

interface AgencyLogo {
  _id: string;
  fileName: string;
}

interface AgencyAddress {
  _id: string;
  province: string;
  city: string;
  area: string;
  fullAddress: string;
}

interface AgencyDetails {
  _id: string;
  name: string;
  phone: string;
  owner: AgencyOwner;
  consultants: AgencyConsultant[];
  areaAdmins: AgencyAreaAdmin[];
  adQuota: number;
  isActive: boolean;
  isVerified: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
  activeAdCount: number;
  logo?: AgencyLogo;
  address?: string | AgencyAddress;
  email?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  location?: {
    country?: string;
    province?: string;
    city?: string;
    area?: string;
  };
}

interface AgencyDetailsCardProps {
  agency: AgencyDetails;
}

const AgencyDetailsCard: React.FC<AgencyDetailsCardProps> = ({ agency }) => {
  const createdDate = new Date(agency.createdAt).toLocaleDateString("fa-IR");
  const updatedDate = new Date(agency.updatedAt).toLocaleDateString("fa-IR");

  const logoUrl = agency.logo
    ? `${mainConfig.fileServer}/${agency.logo.fileName}`
    : "/placeholder-logo.png";

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header Section with Logo and Status */}
      <div className="relative p-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex-1 text-center md:text-right">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
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

            <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
              {agency.name}
            </h1>
            <p className="text-gray-600 text-lg mb-4 leading-relaxed">
              {agency.description || "بدون توضیحات"}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-purple-500 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span>تاریخ ثبت: {createdDate}</span>
              </div>

              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-purple-500 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                <span>آخرین بروزرسانی: {updatedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg
              className="w-5 h-5 text-purple-600 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            اطلاعات تماس
          </h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-purple-600 ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                ></path>
              </svg>
              <span className="text-gray-800 font-semibold">
                شماره تماس: {agency.phone}
              </span>
            </div>

            {agency.email && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-purple-600 ml-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <span className="text-gray-800 font-semibold">
                  ایمیل: {agency.email}
                </span>
              </div>
            )}

            {agency.website && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-purple-600 ml-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  ></path>
                </svg>
                <span className="text-gray-800 font-semibold">
                  وب‌سایت: {agency.website}
                </span>
              </div>
            )}

            {agency.address && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-purple-600 ml-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  ></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  ></path>
                </svg>
                <span className="text-gray-800 font-semibold">
                  آدرس:{" "}
                  {typeof agency.address === "object" && agency.address !== null
                    ? agency.address.fullAddress
                    : agency.address}
                </span>
              </div>
            )}

            {agency.location &&
              Object.values(agency.location).some((value) => value) && (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-purple-600 ml-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span className="text-gray-800 font-semibold">
                    موقعیت:{" "}
                    {[
                      agency.location.country,
                      agency.location.province,
                      agency.location.city,
                      agency.location.area,
                    ]
                      .filter(Boolean)
                      .join(" - ")}
                  </span>
                </div>
              )}
          </div>
        </div>

        {/* Owner Information */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg
              className="w-5 h-5 text-purple-600 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            اطلاعات مدیر
          </h2>

          <div className="space-y-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-purple-600 ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              <span className="text-gray-800 font-semibold">
                نام و نام خانوادگی: {agency.owner?.firstName || "—"}{" "}
                {agency.owner?.lastName || ""}
              </span>
            </div>

            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-purple-600 ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                ></path>
              </svg>
              <span className="text-gray-800 font-semibold">
                شماره تماس: {agency.owner?.phone || "—"}
              </span>
            </div>

            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-purple-600 ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                ></path>
              </svg>
              <span className="text-gray-800 font-semibold">
                ایمیل: {agency.owner?.email || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <svg
              className="w-5 h-5 text-purple-600 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
            آمار و اطلاعات
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="text-purple-800 text-sm font-medium mb-1">
                تعداد مشاوران
              </div>
              <div className="text-3xl font-bold text-purple-900">
                {agency.consultants?.length ?? 0}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="text-blue-800 text-sm font-medium mb-1">
                مدیران منطقه
              </div>
              <div className="text-3xl font-bold text-blue-900">
                {agency.areaAdmins?.length ?? 0}
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="text-green-800 text-sm font-medium mb-1">
                آگهی‌های فعال
              </div>
              <div className="text-3xl font-bold text-green-900">
                {agency.activeAdCount}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="text-yellow-800 text-sm font-medium mb-1">
                سهمیه آگهی
              </div>
              <div className="text-3xl font-bold text-yellow-900">
                {agency.adQuota}
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        {agency.socialMedia &&
          Object.values(agency.socialMedia || {}).some((value) => value) && (
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 text-purple-600 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  ></path>
                </svg>
                شبکه‌های اجتماعی
              </h2>

              <div className="flex flex-wrap gap-3">
                {agency.socialMedia.instagram && (
                  <a
                    href={agency.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                  >
                    <span className="font-medium">اینستاگرام</span>
                  </a>
                )}

                {agency.socialMedia.twitter && (
                  <a
                    href={agency.socialMedia.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
                  >
                    <span className="font-medium">توییتر</span>
                  </a>
                )}

                {agency.socialMedia.facebook && (
                  <a
                    href={agency.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all duration-300"
                  >
                    <span className="font-medium">فیسبوک</span>
                  </a>
                )}

                {agency.socialMedia.linkedin && (
                  <a
                    href={agency.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
                  >
                    <span className="font-medium">لینکدین</span>
                  </a>
                )}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AgencyDetailsCard;
