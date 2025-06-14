"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAgencyDetails, getAgencyMembers } from "@/controllers/makeRequest";
import AgencyDetailsCard from "@/components/admin/agencies/details/AgencyDetailsCard";
import AddAreaAdminModal from "@/components/admin/agencies/details/AddAreaAdminModal";
import AreaAdminManager from "@/components/admin/agencies/details/AreaAdminManager";
import ConsultantManager from "@/components/admin/agencies/details/ConsultantManager";
import AddConsultantModal from "@/components/admin/agencies/details/AddConsultantModal";
import EditAgencyModal from "@/components/admin/agencies/EditAgencyModal";

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
  address: AgencyAddress;
  email?: string;
  website?: string;
  socialMedia?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
  isPhoneShow?: boolean;
  isAddressShow?: boolean;
}

export default function AgencyDetailsPage() {
  const { id } = useParams();
  const [agency, setAgency] = useState<AgencyDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAgencyOwner, setIsAgencyOwner] = useState<boolean>(true);
  const [isAreaAdminModalOpen, setIsAreaAdminModalOpen] =
    useState<boolean>(false);
  const [isConsultantModalOpen, setIsConsultantModalOpen] =
    useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAgencyDetails = async () => {
      try {
        setLoading(true);
        console.log(`🔍 Fetching agency details for ID: ${id}`);

        // Get agency details (which already includes consultants and areaAdmins)
        const agencyResponse = await getAgencyDetails(id as string);
        console.log("Agency details API response:", agencyResponse);

        if (agencyResponse.success && agencyResponse.data) {
          // Extract the agency data from the response
          const agencyData = agencyResponse.data.data || agencyResponse.data;

          console.log("Extracted agency data:", agencyData);
          console.log("Consultants from agency data:", agencyData.consultants);
          console.log("Area admins from agency data:", agencyData.areaAdmins);

          // The agency details response already includes consultants and areaAdmins
          const fullAgencyData: AgencyDetails = {
            _id: agencyData._id,
            name: agencyData.name,
            phone: agencyData.phone,
            owner: agencyData.owner,
            consultants: agencyData.consultants || [],
            areaAdmins: agencyData.areaAdmins || [],
            adQuota: agencyData.adQuota || 0,
            isActive: agencyData.isActive || false,
            isVerified: agencyData.isVerified || false,
            description: agencyData.description || "",
            createdAt: agencyData.createdAt,
            updatedAt: agencyData.updatedAt,
            activeAdCount: agencyData.activeAdCount || 0,
            logo: agencyData.logo,
            address: agencyData.address || {},
            email: agencyData.email,
            website: agencyData.website,
            socialMedia: agencyData.socialMedia,
            isPhoneShow: agencyData.isPhoneShow,
            isAddressShow: agencyData.isAddressShow,
          };

          console.log(
            "Final agency data with consultants and area admins:",
            fullAgencyData
          );
          setAgency(fullAgencyData);
          setError(null);
        } else {
          setError(agencyResponse.message || "خطا در دریافت اطلاعات آژانس");
          setAgency(null);
        }
      } catch (err: any) {
        console.error("Error fetching agency details:", err);
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
      console.log(`🔄 Refreshing agency details for ID: ${id}`);

      // Get updated agency details (which already includes consultants and areaAdmins)
      const agencyResponse = await getAgencyDetails(id as string);

      if (agencyResponse.success && agencyResponse.data) {
        const agencyData = agencyResponse.data.data || agencyResponse.data;

        console.log("Refreshed agency data:", agencyData);
        console.log("Refreshed consultants:", agencyData.consultants);
        console.log("Refreshed area admins:", agencyData.areaAdmins);

        // The agency details response already includes consultants and areaAdmins
        const fullAgencyData: AgencyDetails = {
          _id: agencyData._id,
          name: agencyData.name,
          phone: agencyData.phone,
          owner: agencyData.owner,
          consultants: agencyData.consultants || [],
          areaAdmins: agencyData.areaAdmins || [],
          adQuota: agencyData.adQuota || 0,
          isActive: agencyData.isActive || false,
          isVerified: agencyData.isVerified || false,
          description: agencyData.description || "",
          createdAt: agencyData.createdAt,
          updatedAt: agencyData.updatedAt,
          activeAdCount: agencyData.activeAdCount || 0,
          logo: agencyData.logo,
          address: agencyData.address || {},
          email: agencyData.email,
          website: agencyData.website,
          socialMedia: agencyData.socialMedia,
          isPhoneShow: agencyData.isPhoneShow,
          isAddressShow: agencyData.isAddressShow,
        };

        setAgency(fullAgencyData);
        setError(null);
      }
    } catch (err: any) {
      console.error("Error refreshing agency details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAgency = () => {
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    // Refresh the agency details after successful edit
    refreshAgencyDetails();
  };

  const handleDeleteAgency = () => {
    // Redirect to agencies list after successful delete
    window.location.href = "/admin/agencies";
  };

  // Agency interface for EditAgencyModal
  interface Agency {
    _id: string;
    name: string;
    phone: string;
    description: string;
    address?: {
      country?: string;
      province?: string;
      city?: string;
      area?: string;
      location?: {
        coordinates: [number, number];
      };
      fullAddress?: string;
    };
  }

  // Convert AgencyDetails to Agency format for EditAgencyModal
  const convertToAgencyFormat = (agencyDetails: AgencyDetails): Agency => {
    const getStringValue = (
      value: string | { _id: string; name: string } | undefined
    ): string => {
      if (!value) return "";
      if (typeof value === "string") return value;
      return value._id; // Use the ID for the form
    };

    return {
      _id: agencyDetails._id,
      name: agencyDetails.name,
      phone: agencyDetails.phone,
      description: agencyDetails.description,
      address: {
        country: getStringValue(agencyDetails.address?.country),
        province: getStringValue(agencyDetails.address?.province),
        city: getStringValue(agencyDetails.address?.city),
        area: getStringValue(agencyDetails.address?.area),
        location: agencyDetails.address?.location,
        fullAddress: agencyDetails.address?.fullAddress,
      },
    };
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-gray-800">جزئیات آژانس</h1>
        <div className="flex items-center text-sm text-gray-500">
          <a href="/admin" className="transition-colors hover:text-purple-600">
            داشبورد
          </a>
          <span className="mx-2">/</span>
          <a
            href="/admin/agencies"
            className="transition-colors hover:text-purple-600"
          >
            آژانس‌ها
          </a>
          <span className="mx-2">/</span>
          <span className="text-purple-600">جزئیات</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-purple-500 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-red-800 border border-red-200 rounded-lg bg-red-50">
          <p className="text-lg font-medium">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 mt-4 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
          >
            بازگشت
          </button>
        </div>
      ) : agency ? (
        <div className="space-y-8">
          <AgencyDetailsCard
            agency={agency}
            onEdit={handleEditAgency}
            onDelete={handleDeleteAgency}
          />

          {/* Area Admin Section */}
          <div className="p-6 overflow-hidden bg-white border border-gray-100 shadow-lg rounded-xl">
            <h2 className="flex items-center mb-4 text-xl font-bold text-gray-800">
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
                className="ml-2 text-purple-600"
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
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setIsAreaAdminModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 text-white transition-colors bg-purple-600 rounded-lg shadow-md hover:bg-purple-700"
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
          <div className="p-6 overflow-hidden bg-white border border-gray-100 shadow-lg rounded-xl">
            <h2 className="flex items-center mb-4 text-xl font-bold text-gray-800">
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
                className="ml-2 text-purple-600"
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
        <div className="p-4 text-center text-yellow-800 border border-yellow-200 rounded-lg bg-yellow-50">
          <p className="text-lg font-medium">اطلاعات آژانس یافت نشد</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 mt-4 text-white transition-colors bg-yellow-600 rounded-lg hover:bg-yellow-700"
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
          {/* Edit Agency Modal */}
          <EditAgencyModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSuccess={handleEditSuccess}
            agency={convertToAgencyFormat(agency)}
          />
        </>
      )}
    </div>
  );
}
