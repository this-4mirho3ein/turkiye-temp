"use client";

import React, { useEffect, useState } from "react";
import { getAgencyDetails } from "@/controllers/makeRequest";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Phone, Mail, Building, User, CalendarDays, Info } from "lucide-react";
import { formatJalaliDate, persianUtils } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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

interface AgencyDetailsProps {
  agencyId: string;
}

const AgencyDetails: React.FC<AgencyDetailsProps> = ({ agencyId }) => {
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAgencyDetails(agencyId);
        if (response.success) {
          // Assuming response.data contains the agency object directly
          setAgency(response.data.data);
        } else {
          setError(response.message || "خطا در دریافت اطلاعات آژانس");
        }
      } catch (err: any) {
        console.error("Error fetching agency details:", err);
        setError("خطا در برقراری ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    };

    if (agencyId) {
      fetchDetails();
    }
  }, [agencyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">در حال بارگذاری اطلاعات آژانس...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>{error}</p>
        <Button onClick={() => router.back()} className="mt-4">
          برگشت
        </Button>
      </div>
    );
  }

  if (!agency) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>اطلاعات آژانس یافت نشد.</p>
        <Button onClick={() => router.back()} className="mt-4">
          برگشت
        </Button>
      </div>
    );
  }

  return (
    <Card className="w-full" dir="rtl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-6 w-6" />
          {agency.name}
        </CardTitle>
        <CardDescription>جزئیات آژانس</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center gap-4">
          <Phone className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium leading-none">تلفن:</p>
            <p className="text-sm text-muted-foreground">
              {persianUtils.toPersianDigits(agency.phone)}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-4">
          <User className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium leading-none">مالک:</p>
            <p className="text-sm text-muted-foreground">
              {agency.owner?.firstName} {agency.owner?.lastName} (تلفن:
              {persianUtils.toPersianDigits(agency.owner?.phone)}) (ایمیل:
              {agency.owner?.email})
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-4">
          <Info className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium leading-none">تعداد مشاوران:</p>
            <p className="text-sm text-muted-foreground">
              {persianUtils.toPersianDigits(agency.consultants?.length || 0)}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-4">
          <CalendarDays className="h-5 w-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium leading-none">تاریخ ایجاد:</p>
            <p className="text-sm text-muted-foreground">
              {formatJalaliDate(agency.createdAt, true)}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex items-center gap-4">
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

        {agency.description && (
          <div className="grid gap-2">
            <p className="text-sm font-medium leading-none">توضیحات:</p>
            <p className="text-sm text-muted-foreground">
              {agency.description}
            </p>
          </div>
        )}
        <Separator />
        <Button onClick={() => router.back()} className="mt-4">
          برگشت به لیست آژانس‌ها
        </Button>
      </CardContent>
    </Card>
  );
};

export default AgencyDetails;
