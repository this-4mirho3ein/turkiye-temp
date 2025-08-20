"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiUser,
  HiPhone,
  HiCalendar,
  HiCurrencyDollar,
  HiEye,
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiPencil,
} from "react-icons/hi";
import { Building2 } from "lucide-react";
import mainConfig from "@/configs/mainConfig";
import EditAdModal from "./EditAdModal";

interface AdMedia {
  _id: string;
  fileName: string;
  size: number;
  fileType: string;
}

interface AdUser {
  _id: string;
  phone: string;
  firstName: string;
  lastName: string;
}

interface AdCategory {
  _id: string;
  name: string;
}

interface AdPropertyType {
  _id: string;
  type?: string;
  name?: string;
  enName?: string;
  slug?: string;
  row?: number;
  isActive?: boolean;
  adCount?: number;
}

interface Ad {
  _id: string;
  title: string;
  user: AdUser;
  status: string;
  media: AdMedia[];
  isActive: boolean;
  isDeleted: boolean;
  description: string;
  propertyType: AdPropertyType;
  category: AdCategory;
  createdAt: string;
  updatedAt: string;
  price?: number;
  saleOrRent?: "sale" | "rent";
  address?: {
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
  filters?: Record<string, any>;
  flags?: string[];
}

interface AdCardProps {
  ad: Ad;
  viewMode: "grid" | "list";
  onAdUpdated?: () => void;
}

const AdCard: React.FC<AdCardProps> = ({ ad, viewMode, onAdUpdated }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  // Get the first image or use placeholder
  const primaryImage = ad.media && ad.media.length > 0 ? ad.media[0] : null;
  const hasImage = !!primaryImage;

  // Format price
  const formatPrice = (price?: number) => {
    if (!price) return "قیمت توافقی";
    return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status info (color and text)
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "confirmed":
        return { color: "bg-green-100 text-green-800", text: "تایید شده" };
      case "draft":
      case "pending":
      case "rejected":
        return { color: "bg-red-100 text-red-800", text: "تایید نشده" };
      default:
        return { color: "bg-gray-100 text-gray-800", text: status };
    }
  };

  const statusInfo = getStatusInfo(ad.status);

  // Helper function to convert Ad to EditAdModal expected format
  const formatAdForEditModal = (ad: Ad) => {
    return {
      _id: ad._id,
      title: ad.title,
      description: ad.description,
      price: ad.price || 0,
      saleOrRent: ad.saleOrRent || "sale",
      propertyType: {
        _id: ad.propertyType?._id,
        name: ad.propertyType?.type || ad.propertyType?.name || "",
      },
      category: {
        _id: ad.category?._id,
        name: ad.category?.name || "",
      },
      address: {
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
    };
  };

  if (viewMode === "list") {
    return (
      <>
        <div className="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg hover:shadow-md">
          <div className="flex flex-col gap-4 p-6 sm:flex-row">
            {/* Image */}
            <div className="relative flex-shrink-0 w-full h-48 overflow-hidden rounded-lg sm:w-48 sm:h-32">
              {hasImage ? (
                <>
                  <Image
                    src={`${mainConfig.imageUploadServer}/${primaryImage._id}`}
                    alt={ad.title}
                    fill
                    className="object-cover transition-transform hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 192px"
                  />
                  {ad.media.length > 1 && (
                    <div className="absolute px-2 py-1 text-xs text-white rounded top-2 right-2 bg-black/70">
                      +{ad.media.length - 1}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100">
                  <Building2 className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {ad.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}
                      >
                        {statusInfo.text}
                      </span>
                      {ad.isActive ? (
                        <HiCheckCircle
                          className="w-5 h-5 text-green-500"
                          title="فعال"
                        />
                      ) : (
                        <HiXCircle
                          className="w-5 h-5 text-red-500"
                          title="غیرفعال"
                        />
                      )}
                    </div>
                  </div>

                  <p className="mb-3 text-sm text-gray-600 line-clamp-1">
                    {ad.description}
                  </p>

                  <div className="grid grid-cols-1 gap-2 text-sm text-gray-500 sm:grid-cols-2">
                    <div className="flex items-center gap-1">
                      <HiUser className="w-4 h-4" />
                      <span>
                        {ad.user.firstName} {ad.user.lastName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiPhone className="w-4 h-4" />
                      <span>{ad.user.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiCalendar className="w-4 h-4" />
                      <span>{formatDate(ad.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HiCurrencyDollar className="w-4 h-4" />
                      <span className="font-medium text-purple-600">
                        {formatPrice(ad.price)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="px-2 py-1 bg-gray-100 rounded">
                      {ad.category.name}
                    </span>
                    {(ad.propertyType?.type || ad.propertyType?.name) && (
                      <span className="px-2 py-1 bg-gray-100 rounded">
                        {ad.propertyType?.type || ad.propertyType?.name}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/ads/${ad._id}`}
                      className="flex items-center gap-1 px-3 py-1 text-xs text-purple-600 transition-colors rounded bg-purple-50 hover:bg-purple-100"
                    >
                      <HiEye className="w-4 h-4" />
                      مشاهده
                    </Link>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-1 px-3 py-1 text-xs text-gray-600 transition-colors rounded bg-gray-50 hover:bg-gray-100"
                    >
                      <HiPencil className="w-4 h-4" />
                      ویرایش
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <EditAdModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          ad={formatAdForEditModal(ad)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            if (onAdUpdated) {
              onAdUpdated();
            }
          }}
        />
      </>
    );
  }

  // Grid view
  return (
    <>
      <div className="overflow-hidden transition-all bg-white border border-gray-200 rounded-xl hover:shadow-lg hover:border-purple-200">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {hasImage ? (
            <>
              <Image
                src={`${mainConfig.imageUploadServer}/${primaryImage._id}`}
                alt={ad.title}
                fill
                className="object-cover transition-transform hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {ad.media.length > 1 && (
                <div className="absolute px-2 py-1 text-xs text-white rounded top-3 right-3 bg-black/70">
                  +{ad.media.length - 1}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-100">
              <Building2 className="w-20 h-20 text-gray-400" />
            </div>
          )}
          <div className="absolute flex items-center gap-2 top-3 left-3">
            <div>
              <span
                className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}
              >
                {statusInfo.text}
              </span>
              {ad.isActive ? (
                <HiCheckCircle
                  className="inline-block w-5 h-5 ml-1 text-green-500"
                  title="فعال"
                />
              ) : (
                <HiXCircle
                  className="inline-block w-5 h-5 ml-1 text-red-500"
                  title="غیرفعال"
                />
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="mb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {ad.title}
              </h3>
            </div>
          </div>

          <p className="mb-4 text-sm text-gray-600 line-clamp-2">
            {ad.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1 text-sm font-medium text-purple-600">
              <HiCurrencyDollar className="w-4 h-4" />
              <span>{formatPrice(ad.price)}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between pt-3 mt-3 border-t border-gray-100">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="px-2 py-1 bg-gray-100 rounded">
                {ad.category.name}
              </span>
              {(ad.propertyType?.type || ad.propertyType?.name) && (
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {ad.propertyType?.type || ad.propertyType?.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/ads/${ad._id}`}
                className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm text-purple-600 transition-colors rounded-lg bg-purple-50 hover:bg-purple-100"
              >
                <HiEye className="w-4 h-4" />
                مشاهده
              </Link>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center justify-center flex-1 gap-1 px-3 py-2 text-sm text-gray-600 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <HiPencil className="w-4 h-4" />
                ویرایش
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditAdModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        ad={formatAdForEditModal(ad)}
        onSuccess={() => {
          setIsEditModalOpen(false);
          if (onAdUpdated) {
            onAdUpdated();
          }
        }}
      />
    </>
  );
};

export default AdCard;
