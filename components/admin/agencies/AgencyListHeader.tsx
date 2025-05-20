'use client';

import React from 'react';
import Button from '@/components/admin/ui/Button';

interface AgencyListHeaderProps {
  totalCount: number;
  onRefresh: () => void;
  onToggleFilter: () => void;
  isFilterActive: boolean;
}

const AgencyListHeader: React.FC<AgencyListHeaderProps> = ({ 
  totalCount, 
  onRefresh, 
  onToggleFilter, 
  isFilterActive 
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">آژانس‌ها</h1>
        <p className="text-gray-600 mt-1">
          مدیریت تمام آژانس‌های املاک ثبت شده ({totalCount} مورد)
        </p>
      </div>
      
      <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
        <Button
          color="primary"
          variant={isFilterActive ? "solid" : "bordered"}
          onPress={onToggleFilter}
          startContent={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              ></path>
            </svg>
          }
        >
          فیلتر
        </Button>
        
        <Button
          color="secondary"
          variant="bordered"
          onPress={onRefresh}
          startContent={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
          }
        >
          بروزرسانی
        </Button>
        
        <Button
          color="success"
          startContent={
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          }
        >
          افزودن آژانس
        </Button>
      </div>
    </div>
  );
};

export default AgencyListHeader;