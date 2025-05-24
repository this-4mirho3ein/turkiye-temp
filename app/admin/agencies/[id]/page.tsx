"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAgencyMembers } from "@/controllers/makeRequest";
import AgencyDetailsCard from "@/components/admin/agencies/details/AgencyDetailsCard";
import AddAreaAdminModal from "@/components/admin/agencies/details/AddAreaAdminModal";
import AreaAdminManager from "@/components/admin/agencies/details/AreaAdminManager";
import ConsultantManager from "@/components/admin/agencies/details/ConsultantManager";
import AddConsultantModal from "@/components/admin/agencies/details/AddConsultantModal";

interface AgencyDetails {
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
  address?: string;
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

export default function AgencyDetailsPage() {
  const { id } = useParams();
  const [agency, setAgency] = useState<AgencyDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAgencyOwner, setIsAgencyOwner] = useState<boolean>(true);
  const [isAreaAdminModalOpen, setIsAreaAdminModalOpen] = useState<boolean>(false);
  const [isConsultantModalOpen, setIsConsultantModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAgencyDetails = async () => {
      try {
        setLoading(true);
        // Since we don't have getAgencyDetails API, we'll use getAgencyMembers to get some data
        // and create a mock agency object with the available information
        const response = await getAgencyMembers(id as string);
        console.log("Agency members API response:", response);

        if (response.success && response.data) {
          // Create a mock agency object with the available ID and some default values
          const mockAgency: AgencyDetails = {
            _id: id as string,
            name: "آژانس نمونه",
            phone: "",
            owner: {
              _id: "",
              phone: "",
              email: "",
              firstName: "",
              lastName: ""
            },
            consultants: response.data.consultants || [],
            areaAdmins: response.data.areaAdmins || [],
            adQuota: 10,
            isActive: true,
            isVerified: true,
            description: "",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            activeAdCount: 0
          };
          
          setAgency(mockAgency);
          setError(null);
        } else {
          setError(response.message || "خطا در دریافت اطلاعات آژانس");
          setAgency(null);
        }
      } catch (err: any) {
        setError(err.message || "خطا در دریافت اطلاعات آژانس");
        setAgency(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAgencyDetails();
    }
  }, [id]);

  const refreshAgencyDetails = async () => {
    try {
      setLoading(true);
      // Use getAgencyMembers instead since getAgencyDetails is not available
      const response = await getAgencyMembers(id as string);
      if (response.success && response.data) {
        // Update the mock agency with new members data
        setAgency(prevAgency => {
          if (!prevAgency) return null;
          return {
            ...prevAgency,
            consultants: response.data.consultants || [],
            areaAdmins: response.data.areaAdmins || [],
            updatedAt: new Date().toISOString()
          };
        });
        setError(null);
      }
    } catch (err: any) {
      console.error("Error refreshing agency details:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">جزئیات آژانس</h1>
        <div className="flex items-center text-sm text-gray-500">
          <a href="/admin" className="hover:text-purple-600 transition-colors">
            داشبورد
          </a>
          <span className="mx-2">/</span>
          <a
            href="/admin/agencies"
            className="hover:text-purple-600 transition-colors"
          >
            آژانس‌ها
          </a>
          <span className="mx-2">/</span>
          <span className="text-purple-600">جزئیات</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 text-center">
          <p className="text-lg font-medium">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            بازگشت
          </button>
        </div>
      ) : agency ? (
        <div className="space-y-8">
          <AgencyDetailsCard agency={agency} />
          
          {/* Area Admin Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600 ml-2"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              مدیر منطقه
            </h2>
            
            {/* Display area admins with delete option if they exist */}
            <AreaAdminManager
              agencyId={agency._id}
              areaAdmins={agency.areaAdmins}
              isAgencyOwner={isAgencyOwner}
              onAdminRemoved={refreshAgencyDetails}
            />
            
            {/* Button to add area admin only when there are no area admins */}
            {agency.areaAdmins.length === 0 && isAgencyOwner && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setIsAreaAdminModalOpen(true)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
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
                  افزودن مدیر منطقه
                </button>
              </div>
            )}
          </div>
          
          {/* Consultant Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-purple-600 ml-2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              مشاوران
            </h2>
            
            {/* Display consultants with add/delete options */}
            <ConsultantManager
              agencyId={agency._id}
              consultants={agency.consultants || []}
              isAgencyOwner={isAgencyOwner}
              onConsultantRemoved={refreshAgencyDetails}
              onAddConsultant={() => setIsConsultantModalOpen(true)}
            />
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 text-center">
          <p className="text-lg font-medium">اطلاعات آژانس یافت نشد</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            بازگشت
          </button>
        </div>
      )}
      {/* Add Area Admin Modal */}
      {agency && (
        <>
          <AddAreaAdminModal
            isOpen={isAreaAdminModalOpen}
            onClose={() => setIsAreaAdminModalOpen(false)}
            agencyId={agency._id}
            isAgencyOwner={isAgencyOwner}
            onSuccess={refreshAgencyDetails}
          />
          {/* Add Consultant Modal */}
          <AddConsultantModal
            isOpen={isConsultantModalOpen}
            onClose={() => setIsConsultantModalOpen(false)}
            agencyId={agency._id}
            isAgencyOwner={isAgencyOwner}
            onSuccess={refreshAgencyDetails}
          />
        </>
      )}
    </div>
  );
}
