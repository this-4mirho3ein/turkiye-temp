"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  HiArrowRight,
  HiUser,
  HiPhone,
  HiCalendar,
  HiCurrencyDollar,
  HiLocationMarker,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiPencil,
  HiFlag,
  HiHome,
  HiTag,
  HiChevronRight,
  HiTrash,
} from "react-icons/hi";
import { Building2, MapPin, Calendar, DollarSign, Trash2 } from "lucide-react";
import { getAdminAdById, confirmAd, deleteAd } from "@/controllers/makeRequest";
import mainConfig from "@/configs/mainConfig";
import EditAdModal from "./EditAdModal";

interface AdDetailsPageClientProps {
  id: string;
}

interface AdDetails {
  _id: string;
  title: string;
  description: string;
  price: number;
  saleOrRent: "sale" | "rent";
  status: "confirmed" | "draft" | "pending" | "rejected";
  isActive: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
  };
  category: {
    _id: string;
    name: string;
  };
  propertyType: {
    _id: string;
    type?: string;
    name?: string;
  };
  address?: {
    country?: {
      _id: string;
      name: string;
    };
    province?: {
      _id: string;
      name: string;
    };
    city?: {
      _id: string;
      name: string;
    };
    area?: {
      _id: string;
      name: string;
    };
    fullAddress?: string;
    location?: {
      coordinates?: [number, number];
    };
  };
  media: Array<{
    _id: string;
    fileName: string;
    fileType: string;
    isMain?: boolean;
  }>;
  filters: Record<string, any>;
  flags: string[];
  viewCount?: number;
  agency?: any;
}

const AdDetailsPageClient: React.FC<AdDetailsPageClientProps> = ({ id }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ad, setAd] = useState<AdDetails | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmingAction, setIsConfirmingAction] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionResult, setActionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const fetchAdDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Fetching ad details for ID: ${id}`);
      const response = await getAdminAdById(id);
      console.log("Full response from getAdminAdById:", response);

      if (response.success) {
        // Check if the response data is already the ad details or has a nested structure
        let adData = response.data;

        // Handle nested data structure (response.data.data)
        if (response.data && response.data.data) {
          adData = response.data.data;
          console.log("Found nested data structure, using response.data.data");
        }

        // Normalize property type data structure if it's incomplete
        if (adData.propertyType) {
          // Ensure property type has either type or name field
          if (!adData.propertyType.type && !adData.propertyType.name) {
            console.log(
              "Property type missing type/name, fetching complete data..."
            );

            // If only ID is available, we need to ensure UI has the necessary fields
            // This is a temporary workaround - ideally we'd fetch the complete property type data
            adData.propertyType = {
              ...adData.propertyType,
              type: "نامشخص", // Default value if type is missing
            };
          }
        }

        // Ensure address fields are properly structured
        if (adData.address) {
          // Make sure each location field has at least an empty object if missing
          adData.address.country = adData.address.country || {
            _id: "",
            name: "",
          };
          adData.address.province = adData.address.province || {
            _id: "",
            name: "",
          };
          adData.address.city = adData.address.city || { _id: "", name: "" };
          adData.address.area = adData.address.area || { _id: "", name: "" };
          adData.address.fullAddress = adData.address.fullAddress || "";

          // Remove location coordinates
          delete adData.address.location;
        } else {
          // Create a default address structure if missing
          adData.address = {
            country: { _id: "", name: "" },
            province: { _id: "", name: "" },
            city: { _id: "", name: "" },
            area: { _id: "", name: "" },
            fullAddress: "",
          };
        }

        console.log("Setting ad data:", adData);
        setAd(adData);
      } else {
        console.error("API call was not successful:", response.message);
        setError(response.message || "خطا در دریافت اطلاعات آگهی");
      }
    } catch (err) {
      console.error("Error fetching ad details:", err);
      setError("خطا در دریافت اطلاعات آگهی");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdDetails();
  }, [id]);

  const formatPrice = (price?: number): string => {
    if (!price) return "قیمت توافقی";
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "تاریخ نامشخص";

    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "تاریخ نامعتبر";

      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "خطا در نمایش تاریخ";
    }
  };

  // Get status info (color and text)
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "confirmed":
        return { color: "bg-green-100 text-green-800", text: "تایید شده" };
      case "draft":
        return { color: "bg-yellow-100 text-yellow-800", text: "پیش‌نویس" };
      case "pending":
        return { color: "bg-blue-100 text-blue-800", text: "در انتظار تایید" };
      case "rejected":
        return { color: "bg-red-100 text-red-800", text: "تایید نشده" };
      default:
        return { color: "bg-gray-100 text-gray-800", text: status };
    }
  };

  const getFlagBadge = (flag: string) => {
    const flagConfig = {
      premium: { color: "bg-purple-100 text-purple-800", text: "ویژه" },
      featured: { color: "bg-orange-100 text-orange-800", text: "برجسته" },
      urgent: { color: "bg-red-100 text-red-800", text: "فوری" },
    };

    const config = flagConfig[flag as keyof typeof flagConfig];
    if (!config) return null;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <HiFlag className="w-3 h-3 ml-1" />
        {config.text}
      </span>
    );
  };

  // Function to handle ad approval
  const handleApproveAd = async () => {
    if (!ad) return;

    try {
      setIsConfirmingAction(true);
      setActionResult(null);

      const response = await confirmAd(ad._id, true);

      if (response.success) {
        setActionResult({
          success: true,
          message: "آگهی با موفقیت تایید شد",
        });
        // Refresh ad data to show updated status
        fetchAdDetails();
      } else {
        setActionResult({
          success: false,
          message: response.message || "خطا در تایید آگهی",
        });
      }
    } catch (err) {
      console.error("Error approving ad:", err);
      setActionResult({
        success: false,
        message: "خطا در تایید آگهی",
      });
    } finally {
      setIsConfirmingAction(false);
    }
  };

  // Function to handle ad rejection
  const handleRejectAd = async () => {
    if (!ad) return;

    // Show rejection reason modal
    setIsRejectModalOpen(true);
  };

  // Function to submit rejection with reason
  const submitRejection = async () => {
    if (!ad) return;

    try {
      setIsConfirmingAction(true);
      setActionResult(null);

      const response = await confirmAd(ad._id, false, rejectReason);

      if (response.success) {
        setActionResult({
          success: true,
          message: "آگهی با موفقیت رد شد",
        });
        // Refresh ad data to show updated status
        fetchAdDetails();
        // Close the modal and reset reason
        setIsRejectModalOpen(false);
        setRejectReason("");
      } else {
        setActionResult({
          success: false,
          message: response.message || "خطا در رد آگهی",
        });
      }
    } catch (err) {
      console.error("Error rejecting ad:", err);
      setActionResult({
        success: false,
        message: "خطا در رد آگهی",
      });
    } finally {
      setIsConfirmingAction(false);
    }
  };

  // Function to handle ad deletion
  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  // Function to confirm and execute ad deletion
  const confirmDelete = async () => {
    if (!ad) return;

    try {
      setIsConfirmingAction(true);
      setActionResult(null);

      const response = await deleteAd(ad._id);

      if (response.success) {
        setActionResult({
          success: true,
          message: "آگهی با موفقیت حذف شد",
        });

        // Close the modal
        setIsDeleteModalOpen(false);

        // Redirect to ads list after a short delay
        setTimeout(() => {
          router.push("/admin/ads");
        }, 1500);
      } else {
        setActionResult({
          success: false,
          message: response.message || "خطا در حذف آگهی",
        });
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      console.error("Error deleting ad:", err);
      setActionResult({
        success: false,
        message: "خطا در حذف آگهی",
      });
      setIsDeleteModalOpen(false);
    } finally {
      setIsConfirmingAction(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-t-4 border-b-4 border-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-8 text-center text-red-800 border border-red-200 rounded-lg bg-red-50">
          <p className="mb-4 text-xl font-medium">{error || "آگهی یافت نشد"}</p>
          <button
            onClick={() => router.push("/admin/ads")}
            className="px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
          >
            بازگشت به لیست آگهی‌ها
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(ad.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        {/* Header and Navigation */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center mb-2 text-sm text-gray-500">
                <a
                  href="/admin"
                  className="transition-colors hover:text-purple-600"
                >
                  داشبورد
                </a>
                <span className="mx-2">/</span>
                <a
                  href="/admin/ads"
                  className="transition-colors hover:text-purple-600"
                >
                  آگهی‌ها
                </a>
                <span className="mx-2">/</span>
                <span className="text-purple-600">جزئیات آگهی</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">{ad.title}</h1>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/admin/ads")}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <HiChevronRight className="w-5 h-5" />
                <span>بازگشت به لیست</span>
              </button>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700"
              >
                <HiPencil className="w-5 h-5" />
                <span>ویرایش آگهی</span>
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                <HiTrash className="w-5 h-5" />
                <span>حذف آگهی</span>
              </button>
            </div>
          </div>

          {/* Approval/Rejection buttons */}
          <div className="flex items-center mt-4 space-x-4 space-x-reverse">
            <button
              onClick={handleApproveAd}
              disabled={isConfirmingAction || ad.status === "confirmed"}
              className={`flex items-center gap-1 px-4 py-2 font-medium text-white rounded-lg shadow-sm ${
                ad.status === "confirmed"
                  ? "bg-green-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 disabled:opacity-50"
              }`}
            >
              <HiCheckCircle className="w-5 h-5" />
              <span>
                {ad.status === "confirmed"
                  ? "تایید شده"
                  : isConfirmingAction
                  ? "در حال پردازش..."
                  : "تایید آگهی"}
              </span>
            </button>
            <button
              onClick={handleRejectAd}
              disabled={isConfirmingAction || ad.status === "rejected"}
              className={`flex items-center gap-1 px-4 py-2 font-medium text-white rounded-lg shadow-sm ${
                ad.status === "rejected"
                  ? "bg-red-300 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 disabled:opacity-50"
              }`}
            >
              <HiXCircle className="w-5 h-5" />
              <span>
                {ad.status === "rejected"
                  ? "تایید نشده"
                  : isConfirmingAction
                  ? "در حال پردازش..."
                  : "رد آگهی"}
              </span>
            </button>
          </div>

          {/* Action result message */}
          {actionResult && (
            <div
              className={`mt-4 p-3 rounded-lg ${
                actionResult.success
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {actionResult.message}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Images Gallery */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">تصاویر</h2>
              {ad.media && ad.media.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {ad.media.map((media, index) => (
                    <div
                      key={media._id}
                      className={`relative rounded-lg overflow-hidden ${
                        media.isMain ? "md:col-span-2" : ""
                      }`}
                      style={{
                        height: media.isMain ? "400px" : "250px",
                        maxWidth: "100%",
                      }}
                    >
                      <Image
                        src={`${mainConfig.imageUploadServer}/${media._id}`}
                        alt={`تصویر ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ maxHeight: "100%", width: "100%" }}
                      />
                      {media.isMain && (
                        <div className="absolute px-2 py-1 text-xs text-white rounded top-2 left-2 bg-purple-600/80">
                          تصویر اصلی
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-48 p-8 text-center bg-gray-100 rounded-lg">
                  <div className="flex flex-col items-center">
                    <Building2 className="w-16 h-16 mb-3 text-gray-400" />
                    <p className="text-gray-500">
                      هیچ تصویری برای این آگهی وجود ندارد
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">توضیحات</h2>
              <div className="prose-sm prose text-gray-700 max-w-none">
                <p className="whitespace-pre-wrap">{ad.description}</p>
              </div>
            </div>

            {/* Property Details */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">مشخصات ملک</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">نوع معامله:</span>
                  <span className="font-medium">
                    {ad.saleOrRent === "sale" ? "فروش" : "اجاره"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">نوع ملک:</span>
                  <span className="font-medium">
                    {ad.propertyType?.type || ad.propertyType?.name || "نامشخص"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">دسته‌بندی:</span>
                  <span className="font-medium">
                    {ad.category?.name || "نامشخص"}
                  </span>
                </div>
                {ad.address?.country?.name && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">کشور:</span>
                    <span className="font-medium">
                      {ad.address.country.name}
                    </span>
                  </div>
                )}
                {ad.address?.province?.name && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">استان:</span>
                    <span className="font-medium">
                      {ad.address.province.name}
                    </span>
                  </div>
                )}
                {ad.address?.city?.name && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">شهر:</span>
                    <span className="font-medium">{ad.address.city.name}</span>
                  </div>
                )}
                {ad.address?.area?.name && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">منطقه:</span>
                    <span className="font-medium">{ad.address.area.name}</span>
                  </div>
                )}
                {ad.address?.fullAddress && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">آدرس کامل:</span>
                    <span className="font-medium">
                      {ad.address.fullAddress}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">برچسب‌ها:</span>
                  <div className="flex flex-wrap gap-2">
                    {ad.flags && ad.flags.length > 0 ? (
                      ad.flags.map((flag: string) => (
                        <span
                          key={flag}
                          className="px-2 py-1 text-xs text-purple-800 bg-purple-100 rounded-full"
                        >
                          {flag === "premium" && "ویژه"}
                          {flag === "featured" && "برجسته"}
                          {flag === "urgent" && "فوری"}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">بدون برچسب</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Filters Details */}
            {ad.filters && Object.keys(ad.filters).length > 0 && (
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">ویژگی‌های اضافی</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {Object.entries(ad.filters).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-gray-600">{key}:</span>
                      <span className="font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ad Info Card */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">اطلاعات آگهی</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">وضعیت:</span>
                  <span
                    className={`px-3 py-1 rounded-full ${statusInfo.color}`}
                  >
                    {statusInfo.text}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">تایید شده:</span>
                  {ad.status === "confirmed" ? (
                    <div className="flex items-center gap-1">
                      <HiCheckCircle className="w-6 h-6 text-green-500" />
                      <span className="font-medium text-green-600">بله</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <HiXCircle className="w-6 h-6 text-red-500" />
                      <span className="font-medium text-red-600">خیر</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">فعال:</span>
                  {ad.isActive ? (
                    <HiCheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <HiXCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">حذف شده:</span>
                  {ad.isDeleted ? (
                    <HiCheckCircle className="w-6 h-6 text-red-500" />
                  ) : (
                    <HiXCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">قیمت:</span>
                  <span className="font-bold text-purple-600">
                    {formatPrice(ad.price)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">بازدید:</span>
                  <span className="font-medium">
                    {ad.viewCount !== undefined ? ad.viewCount : 0}
                  </span>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <HiCalendar className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600">تاریخ ایجاد:</span>
                    <span className="font-medium">
                      {formatDate(ad.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <HiCalendar className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600">آخرین بروزرسانی:</span>
                    <span className="font-medium">
                      {formatDate(ad.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* User Info Card */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h2 className="mb-4 text-xl font-semibold">اطلاعات آگهی‌دهنده</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                    <HiUser className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {ad.user?.firstName} {ad.user?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">کاربر</p>
                  </div>
                </div>

                {ad.agency && (
                  <div className="flex items-center gap-2">
                    <HiHome className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600">آژانس:</span>
                    <span className="font-medium">{ad.agency.name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection reason modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">
              دلیل رد آگهی
            </h3>
            <div className="mb-4">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="لطفاً دلیل رد آگهی را وارد کنید..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={4}
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectReason("");
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                انصراف
              </button>
              <button
                onClick={submitRejection}
                disabled={!rejectReason.trim() || isConfirmingAction}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isConfirmingAction ? "در حال پردازش..." : "تایید رد آگهی"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && ad && (
        <EditAdModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            fetchAdDetails(); // Refresh the data after editing
          }}
          ad={{
            _id: ad._id,
            title: ad.title,
            description: ad.description,
            price: ad.price || 0,
            category: {
              _id: ad.category?._id || "",
              name: ad.category?.name || "",
            },
            propertyType: {
              _id: ad.propertyType?._id || "",
              name: ad.propertyType?.type || ad.propertyType?.name || "",
            },
            saleOrRent: ad.saleOrRent || "sale",
            address: {
              country: {
                _id: ad.address?.country?._id || "",
                name: ad.address?.country?.name || "",
              },
              province: {
                _id: ad.address?.province?._id || "",
                name: ad.address?.province?.name || "",
              },
              city: {
                _id: ad.address?.city?._id || "",
                name: ad.address?.city?.name || "",
              },
              area: {
                _id: ad.address?.area?._id || "",
                name: ad.address?.area?.name || "",
              },
              fullAddress: ad.address?.fullAddress || "",
              location: {
                coordinates: ad.address?.location?.coordinates || [0, 0],
              },
            },
            filters: ad.filters || {},
            flags: ad.flags || [],
          }}
          onSuccess={() => {
            fetchAdDetails(); // Refresh the data after editing
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">
              تایید حذف آگهی
            </h3>
            <p className="mb-6 text-gray-600">
              آیا از حذف این آگهی اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                انصراف
              </button>
              <button
                onClick={confirmDelete}
                disabled={isConfirmingAction}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isConfirmingAction ? "در حال پردازش..." : "بله، حذف شود"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdDetailsPageClient;
