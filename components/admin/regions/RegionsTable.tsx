import React from "react";
import Button from "@/components/admin/ui/Button";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Region } from "@/components/admin/data/regions";

type RegionsTableProps = {
  regions: Region[];
  type: "countries" | "provinces" | "cities" | "areas";
  isLoading: boolean;
  handleEdit: (region: Region) => void;
  handleDelete: (region: Region) => void;
};

const RegionsTable: React.FC<RegionsTableProps> = ({
  regions,
  type,
  isLoading,
  handleEdit,
  handleDelete,
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-right">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-center">#</th>
          <th className="px-6 py-3">نام</th>
          <th className="px-6 py-3">نام انگلیسی</th>
          {type !== "countries" && <th className="px-6 py-3">والد</th>}
          <th className="px-6 py-3 text-center">عملیات</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr className="bg-white border-b">
            <td
              colSpan={type !== "countries" ? 5 : 4}
              className="px-6 py-4 text-center text-gray-500"
            >
              در حال بارگذاری...
            </td>
          </tr>
        ) : regions.length > 0 ? (
          regions.map((region, index) => (
            <tr
              key={`${region.id}-${region.originalId || index}`}
              className="bg-white border-b hover:bg-gray-50"
            >
              <td className="px-6 py-4 font-medium text-center">{index + 1}</td>
              <td className="px-6 py-4 font-medium">{region.name}</td>
              <td className="px-6 py-4">{region.enName || "-"}</td>
              {type !== "countries" && (
                <td className="px-6 py-4">{region.parent?.name || "-"}</td>
              )}
              <td className="px-6 py-4 text-center">
                <div className="flex justify-center space-x-2 space-x-reverse">
                  <Button
                    variant="light"
                    size="sm"
                    color="primary"
                    isIconOnly
                    onPress={() => handleEdit(region)}
                    aria-label="ویرایش"
                    tabIndex={0}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="light"
                    size="sm"
                    color="danger"
                    isIconOnly
                    onPress={() => handleDelete(region)}
                    aria-label="حذف"
                    tabIndex={0}
                  >
                    <FaTrash />
                  </Button>
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

export default RegionsTable;
