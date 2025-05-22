"use client";

import React, { useState } from "react";
import Image from "next/image";
import mainConfig from "@/configs/mainConfig";
import { getAgencyMembers } from "@/controllers/makeRequest";

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
  city: string;
  street: string;
  postalCode: string;
  fullAddress: string;
}

interface AgencyDetails {
  _id: string;
  name: string;
  address: string | AgencyAddress;
  phone: string;
  owner: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  };
  consultants: any[];
  areaAdmins: any[];
  adQuota: number;
  activeAdCount: number;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  description: string;
  logo: {
    fileName: string;
  } | null;
  isPhoneShow: boolean;
  isAddressShow: boolean;
  createdAt: string;
  updatedAt: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
}

interface AgencyMember {
  _id: string;
  name: string;
  address: string;
  phone: string;
  owner: string;
  consultants: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    isActive: boolean;
  }[];
  areaAdmins: {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    isActive: boolean;
    area?: {
      _id: string;
      name: string;
    };
  }[];
  adQuota: number;
  isActive: boolean;
  isDeleted: boolean;
  isVerified: boolean;
  description: string;
  logo: string | null;
  isPhoneShow: boolean;
  isAddressShow: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AgencyDetailsCardProps {
  agency: AgencyDetails;
}

const AgencyDetailsCard: React.FC<AgencyDetailsCardProps> = ({ agency }) => {
  const createdDate = new Date(agency.createdAt).toLocaleDateString("fa-IR");
  const updatedDate = new Date(agency.updatedAt).toLocaleDateString("fa-IR");

  // State for managing agency members data
  const [members, setMembers] = useState<AgencyMember | null>(null);
  const [showMembers, setShowMembers] = useState<boolean>(false);
  const [membersLoading, setMembersLoading] = useState<boolean>(false);

  const logoUrl = agency.logo
    ? `${mainConfig.fileServer}/${agency.logo.fileName}`
    : "/placeholder-logo.png";

  // Function to fetch agency members data
  const fetchMembers = async () => {
    try {
      setMembersLoading(true);
      const response = await getAgencyMembers(agency._id);

      if (response.success) {
        setMembers(response.data as AgencyMember);
        console.log("اطلاعات اعضای آژانس با موفقیت دریافت شد");
      } else {
        console.error(response.message || "خطا در دریافت اطلاعات اعضای آژانس");
      }
    } catch (err) {
      console.error("Error fetching agency members:", err);
    } finally {
      setMembersLoading(false);
    }
  };

  // Handle toggle for showing/hiding members
  const handleToggleMembers = () => {
    if (!showMembers && !members) {
      fetchMembers();
    }
    setShowMembers(!showMembers);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header Section with Logo and Status */}
      <div className="relative p-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Logo */}
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-white flex items-center justify-center">
            <Image
              src={logoUrl}
              alt={agency.name}
              width={96}
              height={96}
              className="object-cover"
            />
          </div>

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

            {/* Agency Members Button */}
            <button
              onClick={handleToggleMembers}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                showMembers
                  ? "bg-gray-100 text-gray-700 border border-gray-300"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                {showMembers ? "پنهان کردن اعضای آژانس" : "نمایش اعضای آژانس"}
              </div>
            </button>

            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-600 mt-4">
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
      <div className="p-6">
        {/* Contact Information */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
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
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  ></path>
                </svg>
                <span className="text-gray-800 font-semibold">
                  وب‌سایت:{" "}
                  <a
                    href={agency.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:underline"
                  >
                    {agency.website}
                  </a>
                </span>
              </div>
            )}

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
                {typeof agency.address === "string"
                  ? agency.address
                  : agency.address?.fullAddress || "نامشخص"}
              </span>
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
