"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAgencyDetails } from "@/controllers/makeRequest";
import AgencyDetailsCard from "@/components/admin/agencies/details/AgencyDetailsCard";

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

  useEffect(() => {
    const fetchAgencyDetails = async () => {
      try {
        setLoading(true);
        const response = await getAgencyDetails(id as string);
        console.log("Agency API response:", response);

        if (response.success && response.data && response.data.data) {
          setAgency(response.data.data);
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
    </div>
  );
}
