"use client";

import React, { useState } from "react";
import { removeAgencyAreaAdmin } from "@/controllers/makeRequest";
import { addToast } from "@heroui/react";

interface AreaAdmin {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  area?: {
    _id: string;
    name: string;
  };
}

interface AreaAdminManagerProps {
  agencyId: string;
  areaAdmins: AreaAdmin[];
  isAgencyOwner: boolean;
  onAdminRemoved: () => void;
}

const AreaAdminManager: React.FC<AreaAdminManagerProps> = ({
  agencyId,
  areaAdmins,
  isAgencyOwner,
  onAdminRemoved
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [deletingAdminId, setDeletingAdminId] = useState<string | null>(null);

  // Handle delete area admin
  const handleDeleteAreaAdmin = async (adminId: string) => {
    if (!isAgencyOwner) {
      addToast({
        title: 'خطا',
        description: 'فقط صاحب آژانس می‌تواند مدیر منطقه را حذف کند',
        color: 'danger',
        radius: 'md',
        variant: 'solid',
        timeout: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      setDeletingAdminId(adminId);
      
      const response = await removeAgencyAreaAdmin(agencyId, adminId);
      
      if (response.success) {
        addToast({
          title: 'موفق',
          description: response.message || 'مدیر منطقه با موفقیت حذف شد',
          color: 'success',
          radius: 'md',
          variant: 'solid',
          timeout: 3000,
        });
        
        // Refresh the agency details
        onAdminRemoved();
      } else {
        addToast({
          title: 'خطا',
          description: response.message || 'خطا در حذف مدیر منطقه',
          color: 'danger',
          radius: 'md',
          variant: 'solid',
          timeout: 3000,
        });
      }
    } catch (error: any) {
      console.error("Error removing area admin:", error);
      addToast({
        title: 'خطا',
        description: error.message || 'خطا در حذف مدیر منطقه',
        color: 'danger',
        radius: 'md',
        variant: 'solid',
        timeout: 3000,
      });
    } finally {
      setLoading(false);
      setDeletingAdminId(null);
    }
  };

  return (
    <div>
      {areaAdmins.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4 text-gray-400"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          <p className="text-lg font-medium">هیچ مدیر منطقه‌ای برای این آژانس ثبت نشده است</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تلفن</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ایمیل</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">منطقه</th>
                {isAgencyOwner && (
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {areaAdmins.map((admin) => (
                <tr key={admin._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {admin.firstName || ''} {admin.lastName || ''}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dir-ltr">
                    {admin.phone || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dir-ltr">
                    {admin.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.area?.name || '-'}
                  </td>
                  {isAgencyOwner && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDeleteAreaAdmin(admin._id)}
                        disabled={loading && deletingAdminId === admin._id}
                        className={`px-3 py-1.5 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-1 ${
                          loading && deletingAdminId === admin._id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading && deletingAdminId === admin._id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            در حال حذف...
                          </>
                        ) : (
                          <>
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
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                              <line x1="10" y1="11" x2="10" y2="17"></line>
                              <line x1="14" y1="11" x2="14" y2="17"></line>
                            </svg>
                            حذف
                          </>
                        )}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AreaAdminManager;
