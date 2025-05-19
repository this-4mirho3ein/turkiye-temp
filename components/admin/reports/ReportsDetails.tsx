"use client";

import React from "react";
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaTag,
  FaMapMarkedAlt,
  FaBuilding,
} from "react-icons/fa";
import { ReportData } from "./ReportDataFetcher";

interface ReportsDetailsProps {
  data: ReportData;
}

export default function ReportsDetails({ data }: ReportsDetailsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Users Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-secondary-light/10">
            <FaUsers className="text-secondary text-xl" />
          </div>
          <h2 className="text-xl font-semibold">وضعیت کاربران</h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">کل کاربران</div>
            <div className="text-2xl font-bold mt-1">
              {data.users.total.toLocaleString("fa-IR")}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">کاربران فعال</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {data.users.active.toLocaleString("fa-IR")}
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">کاربران حذف شده</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {data.users.deleted.toLocaleString("fa-IR")}
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary-light/10">
            <FaTag className="text-primary text-xl" />
          </div>
          <h2 className="text-xl font-semibold">وضعیت دسته‌بندی‌ها</h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">کل دسته‌بندی‌ها</div>
            <div className="text-2xl font-bold mt-1">
              {data.categories.total.toLocaleString("fa-IR")}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">دسته‌بندی‌های فعال</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {data.categories.active.toLocaleString("fa-IR")}
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">دسته‌بندی‌های حذف شده</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {data.categories.deleted.toLocaleString("fa-IR")}
            </div>
          </div>
        </div>
      </div>

      {/* Regions Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-secondary-bronze/10">
            <FaMapMarkedAlt className="text-secondary-bronze text-xl" />
          </div>
          <h2 className="text-xl font-semibold">وضعیت مناطق</h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">کل مناطق</div>
            <div className="text-2xl font-bold mt-1">
              {data.regions.total.toLocaleString("fa-IR")}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">مناطق فعال</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {data.regions.active.toLocaleString("fa-IR")}
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">مناطق حذف شده</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {data.regions.deleted.toLocaleString("fa-IR")}
            </div>
          </div>
        </div>
      </div>

      {/* Property Types Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-full bg-primary-light/10">
            <FaBuilding className="text-primary text-xl" />
          </div>
          <h2 className="text-xl font-semibold">وضعیت انواع ملک</h2>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">کل انواع ملک</div>
            <div className="text-2xl font-bold mt-1">
              {data.propertyTypes.total.toLocaleString("fa-IR")}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">انواع ملک فعال</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {data.propertyTypes.active.toLocaleString("fa-IR")}
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">انواع ملک حذف شده</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {data.propertyTypes.deleted.toLocaleString("fa-IR")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
