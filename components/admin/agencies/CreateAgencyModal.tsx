"use client";

import React, { useState, useEffect } from "react";
import { z } from "zod";
import {
  getAdminCountries,
  getAdminProvinces,
  getAdminCities,
  getAdminAreas,
  createAgency,
  getUploadUrl,
  uploadFileToSignedUrl,
  completeUpload,
} from "@/controllers/makeRequest";
import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <span className="text-gray-500">در حال بارگذاری نقشه...</span>
    </div>
  ),
});

// Zod schema for form validation
const createAgencySchema = z.object({
  name: z.string().min(1, "نام آژانس الزامی است"),
  phone: z.string().min(10, "شماره تلفن باید حداقل ۱۰ رقم باشد"),
  description: z.string().min(1, "توضیحات الزامی است"),
  agencyOwnerId: z.string().min(1, "شناسه مالک آژانس الزامی است"),
  address: z.object({
    country: z.string().min(1, "انتخاب کشور الزامی است"),
    province: z.string().min(1, "انتخاب استان الزامی است"),
    city: z.string().min(1, "انتخاب شهر الزامی است"),
    area: z.string().min(1, "انتخاب منطقه الزامی است"),
    location: z.object({
      coordinates: z
        .tuple([z.number(), z.number()])
        .refine(
          (coords) => coords.length === 2,
          "مختصات باید شامل دو عدد باشد"
        ),
    }),
    fullAddress: z.string().min(1, "آدرس کامل الزامی است"),
  }),
  isPhoneShow: z.boolean(),
  isAddressShow: z.boolean(),
  logoFileName: z.string().min(1, "انتخاب لوگو الزامی است"),
});

type CreateAgencyFormData = z.infer<typeof createAgencySchema>;

interface CreateAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateAgencyModal: React.FC<CreateAgencyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CreateAgencyFormData>({
    name: "",
    phone: "",
    description: "",
    agencyOwnerId: "",
    address: {
      country: "",
      province: "",
      city: "",
      area: "",
      location: {
        coordinates: [51.389, 35.6892], // Default to Tehran coordinates
      },
      fullAddress: "",
    },
    isPhoneShow: true,
    isAddressShow: true,
    logoFileName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<{
    step: number;
    message: string;
    isUploading: boolean;
  }>({
    step: 0,
    message: "",
    isUploading: false,
  });

  // Load countries on mount
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const data = await getAdminCountries();
        setCountries(data);
      } catch (error) {
        console.error("Error loading countries:", error);
      }
    };
    if (isOpen) {
      loadCountries();
    }
  }, [isOpen]);

  // Load provinces when country changes
  useEffect(() => {
    const loadProvinces = async () => {
      if (formData.address.country) {
        try {
          const data = await getAdminProvinces();
          console.log("All provinces:", data);
          console.log("Selected country:", formData.address.country);

          // Try different possible field names for country reference
          const filteredProvinces = data.filter(
            (province) =>
              province.country === formData.address.country ||
              province.countryId === formData.address.country ||
              province.country?._id === formData.address.country
          );

          console.log("Filtered provinces:", filteredProvinces);
          setProvinces(filteredProvinces);
        } catch (error) {
          console.error("Error loading provinces:", error);
        }
      } else {
        setProvinces([]);
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            province: "",
            city: "",
            area: "",
          },
        }));
      }
    };
    loadProvinces();
  }, [formData.address.country]);

  // Load cities when province changes
  useEffect(() => {
    const loadCities = async () => {
      if (formData.address.province) {
        try {
          const data = await getAdminCities();
          console.log("All cities:", data);
          console.log("Selected province:", formData.address.province);

          // Try different possible field names for province reference
          const filteredCities = data.filter(
            (city) =>
              city.province === formData.address.province ||
              city.provinceId === formData.address.province ||
              city.province?._id === formData.address.province
          );

          console.log("Filtered cities:", filteredCities);
          setCities(filteredCities);
        } catch (error) {
          console.error("Error loading cities:", error);
        }
      } else {
        setCities([]);
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            city: "",
            area: "",
          },
        }));
      }
    };
    loadCities();
  }, [formData.address.province]);

  // Load areas when city changes
  useEffect(() => {
    const loadAreas = async () => {
      if (formData.address.city) {
        try {
          const data = await getAdminAreas();
          console.log("🏘️ All areas:", data);
          console.log("🏘️ Selected city:", formData.address.city);

          // Log first few areas to see structure
          if (data.length > 0) {
            console.log(
              "🏘️ Sample area structure:",
              JSON.stringify(data[0], null, 2)
            );
          }

          // Try different possible field names for city reference
          const filteredAreas = data.filter((area) => {
            console.log(
              `🏘️ Checking area: ${area.name}, city field:`,
              area.city
            );
            return (
              area.city === formData.address.city ||
              area.cityId === formData.address.city ||
              area.city?._id === formData.address.city ||
              (typeof area.city === "object" &&
                area.city?._id === formData.address.city)
            );
          });

          console.log("🏘️ Filtered areas:", filteredAreas);
          setAreas(filteredAreas);
        } catch (error) {
          console.error("Error loading areas:", error);
        }
      } else {
        setAreas([]);
        setFormData((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            area: "",
          },
        }));
      }
    };
    loadAreas();
  }, [formData.address.city]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => {
        const parentValue = prev[parent as keyof CreateAgencyFormData];
        if (typeof parentValue === "object" && parentValue !== null) {
          return {
            ...prev,
            [parent]: {
              ...parentValue,
              [child]: type === "checkbox" ? checked : value,
            },
          };
        }
        return prev;
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        logoFileName: "لطفا یک فایل تصویری انتخاب کنید",
      }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        logoFileName: "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
      }));
      return;
    }

    setLogoFile(file);

    // Create preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Start upload process
    await uploadLogo(file);
  };

  const uploadLogo = async (file: File) => {
    try {
      setUploadProgress({
        step: 1,
        message: "در حال دریافت آدرس آپلود...",
        isUploading: true,
      });

      // Step 1: Get upload URL
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const uploadUrlResponse = await getUploadUrl(
        "agency",
        "image",
        fileExtension
      );

      if (!uploadUrlResponse.success || !uploadUrlResponse.data) {
        throw new Error(
          uploadUrlResponse.message || "خطا در دریافت آدرس آپلود"
        );
      }

      const { url: signedUrl, fileName } = uploadUrlResponse.data;

      setUploadProgress({
        step: 2,
        message: "در حال آپلود فایل...",
        isUploading: true,
      });

      // Step 2: Upload file to signed URL
      const uploadResponse = await uploadFileToSignedUrl(signedUrl, file);

      if (!uploadResponse.success) {
        throw new Error(uploadResponse.message || "خطا در آپلود فایل");
      }

      setUploadProgress({
        step: 3,
        message: "در حال تکمیل آپلود...",
        isUploading: true,
      });

      // Step 3: Complete upload
      const completeResponse = await completeUpload(
        fileName,
        file.type,
        "agency",
        file.name
      );

      if (!completeResponse.success) {
        throw new Error(completeResponse.message || "خطا در تکمیل آپلود");
      }

      // Update form data with the final fileName
      setFormData((prev) => ({
        ...prev,
        logoFileName: fileName,
      }));

      setUploadProgress({
        step: 4,
        message: "آپلود با موفقیت تکمیل شد",
        isUploading: false,
      });

      // Clear any previous errors
      setErrors((prev) => ({ ...prev, logoFileName: "" }));

      console.log("✅ Logo upload completed successfully:", fileName);
    } catch (error: any) {
      console.error("❌ Logo upload failed:", error);
      setErrors((prev) => ({
        ...prev,
        logoFileName: error.message || "خطا در آپلود لوگو",
      }));
      setUploadProgress({
        step: 0,
        message: "",
        isUploading: false,
      });

      // Reset logo data on error
      setFormData((prev) => ({
        ...prev,
        logoFileName: "",
      }));
      setLogoFile(null);
      setLogoPreview("");
    }
  };

  const handleMapClick = (coordinates: [number, number]) => {
    console.log("🗺️ Map click received in modal:", coordinates);
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        location: {
          coordinates,
        },
      },
    }));
  };

  const validateForm = () => {
    try {
      createAgencySchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if logo upload is still in progress
    if (uploadProgress.isUploading) {
      setErrors({ submit: "لطفا تا تکمیل آپلود لوگو صبر کنید" });
      return;
    }

    // Check if logo upload was successful
    if (logoFile && uploadProgress.step !== 4) {
      setErrors({ submit: "لطفا ابتدا لوگو را با موفقیت آپلود کنید" });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await createAgency(formData);

      if (response.success) {
        onSuccess();
        onClose();
        // Reset form
        setFormData({
          name: "",
          phone: "",
          description: "",
          agencyOwnerId: "",
          address: {
            country: "",
            province: "",
            city: "",
            area: "",
            location: {
              coordinates: [51.389, 35.6892],
            },
            fullAddress: "",
          },
          isPhoneShow: true,
          isAddressShow: true,
          logoFileName: "",
        });
        setLogoFile(null);
        setLogoPreview("");
        setUploadProgress({
          step: 0,
          message: "",
          isUploading: false,
        });
      } else {
        setErrors({ submit: response.message || "خطا در ایجاد آژانس" });
      }
    } catch (error: any) {
      setErrors({ submit: error.message || "خطا در ایجاد آژانس" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6" dir="rtl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              افزودن آژانس جدید
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام آژانس *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="نام آژانس را وارد کنید"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شماره تلفن *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="شماره تلفن را وارد کنید"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شناسه مالک آژانس *
              </label>
              <input
                type="text"
                name="agencyOwnerId"
                value={formData.agencyOwnerId}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="شناسه مالک آژانس را وارد کنید"
              />
              {errors.agencyOwnerId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.agencyOwnerId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                توضیحات *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="توضیحات آژانس را وارد کنید"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Location Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">اطلاعات مکانی</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    کشور *
                  </label>
                  <select
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">انتخاب کشور</option>
                    {countries.map((country) => (
                      <option key={country._id} value={country._id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {errors["address.country"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors["address.country"]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    استان *
                  </label>
                  <select
                    name="address.province"
                    value={formData.address.province}
                    onChange={handleInputChange}
                    disabled={!formData.address.country}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">انتخاب استان</option>
                    {provinces.map((province) => (
                      <option key={province._id} value={province._id}>
                        {province.name}
                      </option>
                    ))}
                  </select>
                  {errors["address.province"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors["address.province"]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شهر *
                  </label>
                  <select
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    disabled={!formData.address.province}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">انتخاب شهر</option>
                    {cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors["address.city"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors["address.city"]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    منطقه *
                  </label>
                  <select
                    name="address.area"
                    value={formData.address.area}
                    onChange={handleInputChange}
                    disabled={!formData.address.city}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">انتخاب منطقه</option>
                    {areas.map((area) => (
                      <option key={area._id} value={area._id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                  {errors["address.area"] && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors["address.area"]}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  آدرس کامل *
                </label>
                <textarea
                  name="address.fullAddress"
                  value={formData.address.fullAddress}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="آدرس کامل را وارد کنید"
                />
                {errors["address.fullAddress"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors["address.fullAddress"]}
                  </p>
                )}
              </div>

              {/* Map */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  انتخاب موقعیت روی نقشه
                </label>
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <MapComponent
                    onCoordinatesChange={handleMapClick}
                    initialCoordinates={formData.address.location.coordinates}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  مختصات انتخاب شده:{" "}
                  {formData.address.location.coordinates[1].toFixed(6)},{" "}
                  {formData.address.location.coordinates[0].toFixed(6)}
                </p>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">لوگو آژانس</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  انتخاب لوگو *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploadProgress.isUploading}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                {/* Upload Progress */}
                {uploadProgress.isUploading && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="text-sm text-blue-700">
                        مرحله {uploadProgress.step} از ۳:{" "}
                        {uploadProgress.message}
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(uploadProgress.step / 3) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {uploadProgress.step === 4 && !uploadProgress.isUploading && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <svg
                        className="h-4 w-4 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm text-green-700">
                        {uploadProgress.message}
                      </span>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {errors.logoFileName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.logoFileName}
                  </p>
                )}

                {/* Logo Preview */}
                {logoPreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      پیش‌نمایش لوگو:
                    </p>
                    <div className="relative inline-block">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="w-32 h-32 object-cover border border-gray-300 rounded-md"
                      />
                      {uploadProgress.step === 4 &&
                        !uploadProgress.isUploading && (
                          <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                    </div>
                    {formData.logoFileName && (
                      <p className="text-xs text-gray-500 mt-1">
                        نام فایل: {formData.logoFileName}
                      </p>
                    )}
                  </div>
                )}

                {/* File Requirements */}
                <div className="mt-2 text-xs text-gray-500">
                  <p>• فرمت‌های مجاز: JPG, PNG, GIF</p>
                  <p>• حداکثر حجم: ۵ مگابایت</p>
                  <p>• ابعاد پیشنهادی: ۲۰۰×۲۰۰ پیکسل</p>
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">تنظیمات نمایش</h3>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPhoneShow"
                    checked={formData.isPhoneShow}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="mr-2 text-sm text-gray-700">
                    نمایش شماره تلفن
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAddressShow"
                    checked={formData.isAddressShow}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="mr-2 text-sm text-gray-700">
                    نمایش آدرس
                  </label>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 space-x-reverse pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={loading || uploadProgress.isUploading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "در حال ایجاد..."
                  : uploadProgress.isUploading
                  ? "در حال آپلود لوگو..."
                  : "ایجاد آژانس"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAgencyModal;
