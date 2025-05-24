import React from "react";
import Button from "@/components/admin/ui/Button";
import { MoreHorizontal, Edit, Trash, Check, X } from "lucide-react";
import { Badge } from "@heroui/react";
import Link from "next/link";
import {
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
} from "@/components/admin/ui/Dropdown";

// Format date to Jalali
const formatJalaliDate = (dateString: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

interface Agency {
  _id: string;
  name: string;
  phone: string;
  owner: {
    _id: string;
    phone: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  consultants: any[];
  areaAdmins: any[];
  isActive: boolean;
  isVerified: boolean;
  description: string;
  logo?: {
    _id: string;
    fileName: string;
  };
  createdAt: string;
  updatedAt: string;
  activeAdCount: number;
}

interface AgenciesTableProps {
  agencies: Agency[];
  onEdit?: (agency: Agency) => void;
  onDelete?: (id: string) => void;
  onVerify?: (id: string, isVerified: boolean) => void;
  onToggleActive?: (id: string, isActive: boolean) => void;
  isLoading?: boolean;
}

const AgenciesTable: React.FC<AgenciesTableProps> = ({
  agencies,
  onEdit,
  onDelete,
  onVerify,
  onToggleActive,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (!agencies || agencies.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">هیچ آژانسی یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm text-right" dir="rtl">
        <thead className="text-xs text-black uppercase bg-gray-50">
          <tr>
            <th className="px-6 py-3.5 w-12 text-right font-semibold">ردیف</th>
            <th className="px-6 py-3.5 text-right font-semibold">نام آژانس</th>
            <th className="px-6 py-3.5 text-right font-semibold">تلفن</th>
            <th className="px-6 py-3.5 text-right font-semibold">مالک</th>
            <th className="px-6 py-3.5 text-right font-semibold">تعداد مشاوران</th>
            <th className="px-6 py-3.5 text-right font-semibold">وضعیت</th>
            <th className="px-6 py-3.5 text-right font-semibold">تاریخ ایجاد</th>
            <th className="px-6 py-3.5 text-right font-semibold">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {agencies.map((agency, index) => (
            <tr key={agency._id} className="cursor-pointer border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-right">
                {(index + 1).toLocaleString("fa-IR")}
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  href={`/admin/agencies/${agency._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {agency.name}
                </Link>
              </td>
              <td className="px-6 py-4 text-right">{agency.phone}</td>
              <td className="px-6 py-4 text-right">
                {agency.owner?.firstName} {agency.owner?.lastName}
              </td>
              <td className="px-6 py-4 text-right">
                {agency.consultants?.length.toLocaleString("fa-IR") || "۰"}
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex flex-col gap-1">
                  <Badge
                    color={agency.isActive ? "success" : "danger"}
                    variant="flat"
                    className="w-fit"
                  >
                    {agency.isActive ? "فعال" : "غیرفعال"}
                  </Badge>
                  <Badge
                    color={agency.isVerified ? "success" : "default"}
                    variant="flat"
                    className="w-fit"
                  >
                    {agency.isVerified ? "تأیید شده" : "تأیید نشده"}
                  </Badge>
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                {formatJalaliDate(agency.createdAt)}
              </td>
              <td className="px-6 py-4">
                <DropdownMenu>
                  <DropdownTrigger>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">باز کردن منو</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownSection title="عملیات">
                      <DropdownItem key="edit" onClick={() => onEdit?.(agency)}>
                        <Edit className="ml-2 h-4 w-4" />
                        ویرایش
                      </DropdownItem>
                      <DropdownItem
                        key="toggle-active"
                        onClick={() =>
                          onToggleActive?.(agency._id, !agency.isActive)
                        }
                      >
                        {agency.isActive ? (
                          <>
                            <X className="ml-2 h-4 w-4" />
                            غیرفعال کردن
                          </>
                        ) : (
                          <>
                            <Check className="ml-2 h-4 w-4" />
                            فعال کردن
                          </>
                        )}
                      </DropdownItem>
                      <DropdownItem
                        key="toggle-verify"
                        onClick={() => onVerify?.(agency._id, !agency.isVerified)}
                      >
                        {agency.isVerified ? (
                          <>
                            <X className="ml-2 h-4 w-4" />
                            لغو تأیید
                          </>
                        ) : (
                          <>
                            <Check className="ml-2 h-4 w-4" />
                            تأیید آژانس
                          </>
                        )}
                      </DropdownItem>
                      <DropdownItem
                        key="delete"
                        onClick={() => onDelete?.(agency._id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash className="ml-2 h-4 w-4" />
                        حذف
                      </DropdownItem>
                    </DropdownSection>
                  </DropdownMenu>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgenciesTable;
