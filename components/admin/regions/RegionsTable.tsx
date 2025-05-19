import React from "react";
import Button from "@/components/admin/ui/Button";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Region } from "@/components/admin/data/regions";

type RegionsTableProps = {
  regions: Region[];
  type: "countries" | "provinces" | "cities" | "areas";
  isLoading: boolean;
  handleEdit: (region: Region) => void;
  handleDelete: (region: Region) => void;
  showDeletedItems?: boolean;
};

const RegionsTable: React.FC<RegionsTableProps> = ({
  regions,
  type,
  isLoading,
  handleEdit,
  handleDelete,
  showDeletedItems = false,
}) => {
  // Filter out deleted items unless showDeletedItems is true
  const filteredRegions = showDeletedItems
    ? regions
    : regions.filter((region) => !region.isDeleted);

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm text-right">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3.5 text-center">#</th>
            <th className="px-6 py-3.5">نام</th>
            <th className="px-6 py-3.5">نام انگلیسی</th>
            {type !== "countries" && <th className="px-6 py-3.5">والد</th>}
            <th className="px-6 py-3.5 text-center w-48">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr className="bg-white border-b">
              <td
                colSpan={type !== "countries" ? 5 : 4}
                className="px-6 py-4 text-center text-gray-500"
              >
                <div className="flex justify-center items-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="mr-2">در حال بارگذاری...</span>
                </div>
              </td>
            </tr>
          ) : filteredRegions.length > 0 ? (
            filteredRegions.map((region, index) => (
              <tr
                key={`${region.id}-${region.originalId || index}`}
                className={`border-b hover:bg-gray-50 transition-colors ${
                  region.isDeleted ? "bg-red-50" : "bg-white"
                }`}
              >
                <td className="px-6 py-4 font-medium text-center">
                  {index + 1}
                </td>
                <td className="px-6 py-4 font-medium">
                  {region.name}
                  {region.isDeleted && (
                    <span className="inline-flex items-center mr-2 px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      حذف شده
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">{region.enName || "-"}</td>
                {type !== "countries" && (
                  <td className="px-6 py-4">{region.parent?.name || "-"}</td>
                )}
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center gap-3">
                    {!region.isDeleted ? (
                      <>
                        <Button
                          variant="solid"
                          size="sm"
                          color="primary"
                          onPress={() => handleEdit(region)}
                          aria-label="ویرایش"
                          tabIndex={0}
                          className="gap-1.5 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                          <FaEdit /> ویرایش
                        </Button>
                        <Button
                          variant="solid"
                          size="sm"
                          color="danger"
                          onPress={() => handleDelete(region)}
                          aria-label="حذف"
                          tabIndex={0}
                          className="gap-1.5 bg-red-500 hover:bg-red-600 text-white"
                        >
                          <FaTrash /> حذف
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="flat"
                        size="sm"
                        color="primary"
                        disabled
                        aria-label="مشاهده"
                        tabIndex={0}
                        className="gap-1.5 opacity-70 bg-gray-100 text-gray-600"
                      >
                        <FaEye /> مشاهده
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-white border-b">
              <td
                colSpan={type !== "countries" ? 5 : 4}
                className="px-6 py-4 text-center text-gray-500"
              >
                هیچ موردی یافت نشد
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RegionsTable;
