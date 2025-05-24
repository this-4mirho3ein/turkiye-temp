"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import { toast, Select, Button, Card, Badge, Spinner, Table, Pagination } from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaChevronRight, FaChevronLeft, FaEye } from "react-icons/fa";

interface Agency {
  _id: string;
  name: string;
  ownerName: string;
  ownerPhone: string;
  isVerified: boolean;
  status: string;
  submittedAt: string;
  daysSinceSubmission: number;
}

interface VerificationListProps {
  agencies: Agency[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onStatusChange: (status: string) => void;
  currentStatus: string;
  loading: boolean;
}

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

const VerificationList: React.FC<VerificationListProps> = ({
  agencies,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onStatusChange,
  currentStatus,
  loading
}) => {
  
  // Format date to standard format
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "yyyy/MM/dd - HH:mm");
    } catch (error) {
      return dateString;
    }
  };

  // Format time since submission
  const formatTimeSince = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return "";
    }
  };

  // Generate an array of page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate start and end of pages to show
      let start = Math.max(2, page - Math.floor(maxPagesToShow / 2));
      let end = Math.min(totalPages - 1, start + maxPagesToShow - 3);
      
      // Adjust start if end is too close to totalPages
      start = Math.max(2, end - (maxPagesToShow - 3));
      
      // Add ellipsis if needed
      if (start > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <Card 
      className="overflow-hidden" 
      variants={itemVariants}
      as={motion.div}
      initial="initial"
      animate="animate"
    >
      <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">لیست تأییدیه‌های آژانس‌ها</h2>
            <p className="text-gray-600 mt-1">مدیریت درخواست‌های تأیید آژانس‌ها</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-3">
              <label htmlFor="status-filter" className="text-sm font-medium text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                فیلتر وضعیت:
              </label>
              <div className="relative min-w-[180px]">
                <select
                  id="status-filter"
                  value={currentStatus}
                  onChange={(e) => onStatusChange(e.target.value)}
                  className="w-full appearance-none bg-white/90 backdrop-blur-sm border border-indigo-300 rounded-lg py-2.5 px-4 pr-10 text-sm text-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                >
                  <option value="pending" className="py-2">
                    در انتظار
                  </option>
                  <option value="approved" className="py-2">
                    تأیید شده
                  </option>
                  <option value="rejected" className="py-2">
                    رد شده
                  </option>
                  <option value="all" className="py-2">
                    همه
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-indigo-600">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <Spinner size="lg" color="primary" className="mb-4" />
            <p className="text-indigo-600 font-medium">در حال بارگذاری اطلاعات...</p>
          </div>
        ) : agencies.length === 0 ? (
          <div className="text-center py-16">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4 text-gray-400"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3 className="text-lg font-medium text-gray-700 mb-1">هیچ موردی یافت نشد</h3>
            <p className="text-gray-500">
              در حال حاضر هیچ درخواست تأییدی با وضعیت انتخاب شده وجود ندارد.
            </p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="w-1/6 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">نام آژانس</th>
                <th scope="col" className="w-1/6 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">مالک</th>
                <th scope="col" className="w-1/6 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تلفن</th>
                <th scope="col" className="w-1/6 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">وضعیت</th>
                <th scope="col" className="w-1/6 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">تاریخ ثبت</th>
                <th scope="col" className="w-1/6 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">عملیات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agencies.map((agency) => (
                <tr key={agency._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 truncate">
                    {agency.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 truncate">
                    {agency.ownerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500  truncate">
                    {agency.ownerPhone}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full
                        ${agency.status === 'pending' ? 'bg-yellow-400' : 
                          agency.status === 'approved' ? 'bg-green-400' : 
                          'bg-red-400'}`}></span>
                      <Badge
                        color={agency.status === 'pending' ? 'warning' : 
                               agency.status === 'approved' ? 'success' : 
                               'danger'}
                        variant="flat"
                        size="md"
                        className="font-medium"
                      >
                        {agency.status === 'pending' ? 'در انتظار' : 
                         agency.status === 'approved' ? 'تأیید شده' : 'رد شده'}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="truncate">{formatDate(agency.submittedAt)}</div>
                    <div className="text-xs text-gray-400 truncate">{formatTimeSince(agency.submittedAt)}</div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium">
                    <Button
                      as={Link}
                      href={`/admin/verifications/${agency._id}`}
                      color="primary"
                      variant="flat"
                      size="sm"
                      startContent={<FaEye className="w-4 h-4" />}
                    >
                      مشاهده جزئیات
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination */}
      {!loading && agencies.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-700">
            نمایش <span className="font-medium">{Math.min((page - 1) * limit + 1, total)}</span> تا{" "}
            <span className="font-medium">{Math.min(page * limit, total)}</span> از{" "}
            <span className="font-medium">{total}</span> مورد
          </div>
          
          <Pagination
            total={totalPages}
            initialPage={page}
            page={page}
            onChange={onPageChange}
            color="primary"
            size="md"
            showControls
            className="rtl-pagination"
          />
        </div>
      )}
    </Card>
  );
};

export default VerificationList;
