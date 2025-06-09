"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { z } from "zod";
import {
  getAdminCountries,
  getAdminProvinces,
  getAdminCities,
  getAdminAreas,
  updateAgency,
} from "@/controllers/makeRequest";
import mainConfig from "@/configs/mainConfig";
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
const editAgencySchema = z.object({
  name: z.string().min(1, "نام آژانس الزامی است"),
  phone: z.string().min(10, "شماره تلفن باید حداقل ۱۰ رقم باشد"),
  description: z.string().min(1, "توضیحات الزامی است"),
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
});

type EditAgencyFormData = z.infer<typeof editAgencySchema>;

interface Agency {
  _id: string;
  name: string;
  phone: string;
  description: string;
  address?: {
    country?: string;
    province?: string;
    city?: string;
    area?: string;
    location?: {
      coordinates: [number, number];
    };
    fullAddress?: string;
  };
}

interface EditAgencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  agency: Agency;
}

const EditAgencyModal: React.FC<EditAgencyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  agency,
}) => {
  const [formData, setFormData] = useState<EditAgencyFormData>({
    name: "",
    phone: "",
    description: "",
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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);

  // Memoize coordinates to prevent unnecessary re-renders
  const memoizedCoordinates = useMemo(() => {
    return formData.address.location.coordinates;
  }, [
    formData.address.location.coordinates[0],
    formData.address.location.coordinates[1],
  ]);

  // Initialize form data with agency data when modal opens
  useEffect(() => {
    if (isOpen && agency) {
      setFormData({
        name: agency.name || "",
        phone: agency.phone || "",
        description: agency.description || "",
        address: {
          country: agency.address?.country || "",
          province: agency.address?.province || "",
          city: agency.address?.city || "",
          area: agency.address?.area || "",
          location: {
            coordinates: agency.address?.location?.coordinates || [
              51.389, 35.6892,
            ],
          },
          fullAddress: agency.address?.fullAddress || "",
        },
      });
    }
  }, [isOpen, agency]);

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

          // Try different possible field names for city reference
          const filteredAreas = data.filter(
            (area) =>
              area.city === formData.address.city ||
              area.cityId === formData.address.city ||
              area.city?._id === formData.address.city
          );

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
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleMapClick = useCallback((coordinates: [number, number]) => {
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
  }, []);

  const validateForm = () => {
    try {
      editAgencySchema.parse(formData);
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await updateAgency(agency._id, formData);

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        setErrors({ submit: response.message || "خطا در به‌روزرسانی آژانس" });
      }
    } catch (error: any) {
      setErrors({ submit: error.message || "خطا در به‌روزرسانی آژانس" });
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
            <h2 className="text-2xl font-bold text-gray-900">ویرایش آژانس</h2>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={!formData.address.country}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شهر *
                  </label>
                  <select
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={!formData.address.province}
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
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    disabled={!formData.address.city}
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

              {/* Map Component */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  موقعیت روی نقشه *
                </label>
                <div className="border border-gray-300 rounded-md overflow-hidden">
                  <MapComponent
                    onCoordinatesChange={handleMapClick}
                    initialCoordinates={memoizedCoordinates}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  روی نقشه کلیک کنید تا موقعیت آژانس را انتخاب کنید
                </p>
                {errors["address.location.coordinates"] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors["address.location.coordinates"]}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "در حال به‌روزرسانی..." : "به‌روزرسانی آژانس"}
              </button>
            </div>

            {errors.submit && (
              <div className="text-red-500 text-sm text-center">
                {errors.submit}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAgencyModal;
