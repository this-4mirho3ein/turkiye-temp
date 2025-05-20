import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatJalaliDate } from "@/lib/utils";
import Link from "next/link";

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
    <div className="rounded-md border">
      <Table dir="rtl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-12 text-right">ردیف</TableHead>
            <TableHead className="text-right">نام آژانس</TableHead>
            <TableHead className="text-right">تلفن</TableHead>
            <TableHead className="text-right">مالک</TableHead>
            <TableHead className="text-right">تعداد مشاوران</TableHead>
            <TableHead className="text-right">وضعیت</TableHead>
            <TableHead className="text-right">تاریخ ایجاد</TableHead>
            <TableHead className="text-right">عملیات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agencies.map((agency, index) => (
            <TableRow key={agency._id} className="cursor-pointer">
              <TableCell className="font-medium text-right">
                {(index + 1).toLocaleString("fa-IR")}
              </TableCell>
              <TableCell className="text-right">
                <Link
                  href={`/admin/agencies/${agency._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {agency.name}
                </Link>
              </TableCell>
              <TableCell className="text-right">{agency.phone}</TableCell>
              <TableCell className="text-right">
                {agency.owner?.firstName} {agency.owner?.lastName}
              </TableCell>
              <TableCell className="text-right">
                {agency.consultants?.length.toLocaleString("fa-IR") || "۰"}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col gap-1">
                  <Badge
                    variant={agency.isActive ? "success" : "destructive"}
                    className="w-fit"
                  >
                    {agency.isActive ? "فعال" : "غیرفعال"}
                  </Badge>
                  <Badge
                    variant={agency.isVerified ? "success" : "outline"}
                    className="w-fit"
                  >
                    {agency.isVerified ? "تأیید شده" : "تأیید نشده"}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {formatJalaliDate(agency.createdAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">باز کردن منو</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>عملیات</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit?.(agency)}>
                      <Edit className="ml-2 h-4 w-4" />
                      ویرایش
                    </DropdownMenuItem>
                    <DropdownMenuItem
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
                    </DropdownMenuItem>
                    <DropdownMenuItem
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
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete?.(agency._id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash className="ml-2 h-4 w-4" />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AgenciesTable;
