"use client";

import React from "react";
import { Input } from "@heroui/react";
import { FaSearch } from "react-icons/fa";

interface FilterSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const FilterSearch: React.FC<FilterSearchProps> = ({
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="جستجو در نام فیلتر یا نام انگلیسی..."
          value={searchTerm}
          onValueChange={onSearchChange}
          startContent={<FaSearch className="text-gray-400" />}
          className="flex-1"
          isClearable
        />
      </div>
    </div>
  );
};

export default FilterSearch;
