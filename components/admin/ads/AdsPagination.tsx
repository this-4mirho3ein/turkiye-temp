"use client";

import React from "react";
import {
  HiChevronLeft,
  HiChevronRight,
  HiDotsHorizontal,
} from "react-icons/hi";

interface AdsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const AdsPagination: React.FC<AdsPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show first page
    if (currentPage > 3) {
      pageNumbers.push(1);
    }

    // Show ellipsis if needed
    if (currentPage > 4) {
      pageNumbers.push("ellipsis1");
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pageNumbers.push(i);
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 3) {
      pageNumbers.push("ellipsis2");
    }

    // Always show last page
    if (currentPage < totalPages - 2 && totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === "number") {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center mt-8">
      <nav className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 text-gray-600 transition-colors bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          aria-label="صفحه قبلی"
        >
          <HiChevronRight className="w-5 h-5" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "ellipsis1" || page === "ellipsis2") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex items-center justify-center w-10 h-10 text-gray-600"
                >
                  ...
                </span>
              );
            }

            return (
              <button
                key={`page-${page}`}
                onClick={() => handlePageClick(page)}
                className={`flex items-center justify-center w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-purple-600 text-white border border-purple-600"
                    : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 text-gray-600 transition-colors bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          aria-label="صفحه بعدی"
        >
          <HiChevronLeft className="w-5 h-5" />
        </button>
      </nav>

      {/* Page Info */}
      <div className="mr-4 text-sm text-gray-500">
        صفحه {currentPage} از {totalPages}
      </div>
    </div>
  );
};

export default AdsPagination;
