import React from "react";
import { Region } from "@/components/admin/data/regions";
import { FaFilter, FaGlobe, FaMapMarkedAlt, FaCity } from "react-icons/fa";

interface RegionParentFilterProps {
  type: "countries" | "provinces" | "cities" | "areas";
  parentRegions: Region[];
  selectedParentId: string;
  onParentChange: (parentId: string) => void;
}

const RegionParentFilter: React.FC<RegionParentFilterProps> = ({
  type,
  parentRegions,
  selectedParentId,
  onParentChange,
}) => {
  // Skip for countries as they don't have parents
  if (type === "countries" || parentRegions.length === 0) {
    return null;
  }

  // Get the appropriate label based on region type
  const getParentLabel = () => {
    switch (type) {
      case "provinces":
        return "کشور";
      case "cities":
        return "استان";
      case "areas":
        return "شهر";
      default:
        return "والد";
    }
  };

  // Get the appropriate icon based on region type
  const getParentIcon = () => {
    switch (type) {
      case "provinces":
        return <FaGlobe className="text-blue-500" />;
      case "cities":
        return <FaMapMarkedAlt className="text-green-500" />;
      case "areas":
        return <FaCity className="text-purple-500" />;
      default:
        return <FaFilter className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-indigo-500 mb-4">
      <div className="font-bold text-gray-700 mb-3 flex items-center gap-2">
        <span className="text-indigo-500 flex-shrink-0">{getParentIcon()}</span>
        <span>فیلتر بر اساس {getParentLabel()}</span>
      </div>
      
      <div className="space-y-3">
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <select
                id="parent-filter"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 pr-10 border"
                value={selectedParentId}
                onChange={(e) => onParentChange(e.target.value)}
                aria-label={`فیلتر بر اساس ${getParentLabel()}`}
              >
                <option value="">همه {getParentLabel()}ها</option>
                {parentRegions.map((parent) => (
                  <option
                    key={parent.originalId || parent.id.toString()}
                    value={parent.originalId || parent.id.toString()}
                  >
                    {parent.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                {getParentIcon()}
              </div>
            </div>
            
            {selectedParentId && (
              <button
                onClick={() => onParentChange("")}
                className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors flex items-center gap-1 text-sm"
                aria-label="پاک کردن فیلتر"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>حذف فیلتر</span>
              </button>
            )}
          </div>
        </div>
        
        {selectedParentId && (
          <div className="text-sm bg-blue-50 p-2 rounded-md text-blue-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              نمایش {type === "provinces" ? "استان‌های" : type === "cities" ? "شهرهای" : "محله‌های"} {parentRegions.find(p => (p.originalId || p.id.toString()) === selectedParentId)?.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegionParentFilter;
