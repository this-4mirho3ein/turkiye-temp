import { FaSearch, FaPlus } from "react-icons/fa";
import Button from "@/components/admin/ui/Button";
import Input from "@/components/admin/ui/Input";
import React from "react";

interface RegionSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAdd: () => void;
  typeTitle: string;
}

const RegionSearchBar: React.FC<RegionSearchBarProps> = ({
  search,
  onSearchChange,
  onAdd,
  typeTitle,
}) => (
  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
    <div className="relative w-full sm:w-64">
      <Input
        placeholder={`جستجو در ${typeTitle}ها...`}
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        startContent={<FaSearch className="text-gray-400" />}
        className="w-full"
        aria-label={`جستجو در ${typeTitle}ها`}
        tabIndex={0}
      />
    </div>
    <Button
      color="primary"
      startContent={<FaPlus />}
      onPress={onAdd}
      aria-label={`افزودن ${typeTitle} جدید`}
      tabIndex={0}
    >
      افزودن {typeTitle} جدید
    </Button>
  </div>
);

export default RegionSearchBar;
