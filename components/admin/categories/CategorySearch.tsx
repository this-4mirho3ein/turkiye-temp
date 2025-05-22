"use client";

import React from "react";
import { FaSearch } from "react-icons/fa";
import Input from "@/components/admin/ui/Input";
import Button from "@/components/admin/ui/Button";
import Card, { CardBody } from "@/components/admin/ui/Card";

interface CategorySearchProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

const CategorySearch: React.FC<CategorySearchProps> = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  isLoading = false,
}) => {
  return (
    <div className="mb-6">
      <Card shadow="sm">
        <CardBody>
          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Input
                placeholder="جستجو بر اساس نام دسته‌بندی..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                startContent={
                  <FaSearch className="text-gray-400 text-sm" />
                }
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === "Enter") {
                    onSearch();
                  }
                }}
              />
            </div>

            <Button
              size="sm"
              color="primary"
              variant="solid"
              onPress={onSearch}
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              جستجو
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default CategorySearch;
