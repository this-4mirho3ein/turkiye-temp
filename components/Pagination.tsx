import { PaginationProps } from "@/types/interfaces";
import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const toPersianDigits = (num: number) => {
    return num.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d, 10)]);
  };
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return pages;
  };

  return (
    <nav className="flex items-center justify-center mt-4 space-x-2 rtl:space-x-reverse">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm ${
          currentPage === 1
            ? "text-gray-300 border-gray-200 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100 border-gray-300"
        }`}
      >
        <span className="text-lg">
          <IoIosArrowForward />
        </span>
      </button>

      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl text-sm font-medium border flex items-center justify-center ${
              currentPage === page
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
            }`}
          >
            {toPersianDigits(page)}
          </button>
        ) : (
          <span
            key={index}
            className="w-10 h-10 flex items-center justify-center text-sm text-gray-500"
          >
            {page}
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 flex items-center justify-center rounded-xl border text-sm ${
          currentPage === totalPages
            ? "text-gray-300 border-gray-200 cursor-not-allowed"
            : "text-gray-600 hover:bg-gray-100 border-gray-300"
        }`}
      >
        <span className="text-lg">
          <IoIosArrowBack />{" "}
        </span>
      </button>
    </nav>
  );
};

export default Pagination;
