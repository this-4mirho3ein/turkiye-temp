"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { HiX, HiSave, HiLocationMarker } from "react-icons/hi";
import {
  getAdminCountries,
  getAdminProvinces,
  getAdminCities,
  getAdminAreas,
  getAdminCategories,
  getAdminPropertyTypes,
  updateAdminAd,
} from "@/controllers/makeRequest";

// Dynamically import map component to avoid SSR issues
const MapSelector = dynamic(() => import("./MapSelector"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">در حال بارگذاری نقشه...</span>
    </div>
  ),
});

interface EditAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: {
    _id: string;
    title: string;
    description: string;
    price: number;
    saleOrRent: "sale" | "rent";
    propertyType: {
      _id: string;
      name: string;
    };
    category: {
      _id: string;
      name: string;
    };
    address: {
      country: {
        _id: string;
        name: string;
      };
      province: {
        _id: string;
        name: string;
      };
      city: {
        _id: string;
        name: string;
      };
      area: {
        _id: string;
        name: string;
      };
      fullAddress: string;
      location: {
        coordinates: [number, number];
      };
    };
    filters: Record<string, any>;
    flags: string[];
  };
  onSuccess: () => void;
}

interface SelectOption {
  _id: string;
  name: string;
  type?: string;
}

const EditAdModal: React.FC<EditAdModalProps> = ({
  isOpen,
  onClose,
  ad,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: ad.title || "",
    description: ad.description || "",
    propertyType: ad.propertyType?._id || "",
    category: ad.category?._id || "",
    saleOrRent: ad.saleOrRent || "sale",
    country: ad.address?.country?._id || "",
    province: ad.address?.province?._id || "",
    city: ad.address?.city?._id || "",
    area: ad.address?.area?._id || "",
    fullAddress: ad.address?.fullAddress || "",
    coordinates: (ad.address?.location?.coordinates as [number, number]) || [
      39.925533, 32.866287,
    ], // Default to center of Ankara if coordinates not available
    price: ad.price || 0,
    flags: ad.flags || [],
  });

  // Options for dropdowns
  const [countries, setCountries] = useState<SelectOption[]>([]);
  const [provinces, setProvinces] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);
  const [areas, setAreas] = useState<SelectOption[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<SelectOption[]>([]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [countriesData, categoriesData, propertyTypesData] =
          await Promise.all([
            getAdminCountries({ limit: 100 }),
            getAdminCategories({ limit: 100 }),
            getAdminPropertyTypes({ limit: 100 }),
          ]);

        setCountries(countriesData);
        setCategories(categoriesData);
        setPropertyTypes(propertyTypesData);

        // Load provinces for the selected country
        if (formData.country) {
          const provincesData = await getAdminProvinces({ limit: 100 });
          setProvinces(
            provincesData.filter((p: any) => p.country === formData.country)
          );
        }

        // Load cities for the selected province
        if (formData.province) {
          const citiesData = await getAdminCities({ limit: 100 });
          setCities(
            citiesData.filter((c: any) => c.province === formData.province)
          );
        }

        // Load areas for the selected city
        if (formData.city) {
          const areasData = await getAdminAreas({ limit: 100 });
          setAreas(areasData.filter((a: any) => a.city === formData.city));
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen, formData.country, formData.province, formData.city]);

  // Handle country change
  const handleCountryChange = async (countryId: string) => {
    setFormData((prev) => ({
      ...prev,
      country: countryId,
      province: "",
      city: "",
      area: "",
    }));

    if (countryId) {
      const provincesData = await getAdminProvinces({ limit: 100 });
      setProvinces(provincesData.filter((p: any) => p.country === countryId));
    } else {
      setProvinces([]);
    }
    setCities([]);
    setAreas([]);
  };

  // Handle province change
  const handleProvinceChange = async (provinceId: string) => {
    setFormData((prev) => ({
      ...prev,
      province: provinceId,
      city: "",
      area: "",
    }));

    if (provinceId) {
      const citiesData = await getAdminCities({ limit: 100 });
      setCities(citiesData.filter((c: any) => c.province === provinceId));
    } else {
      setCities([]);
    }
    setAreas([]);
  };

  // Handle city change
  const handleCityChange = async (cityId: string) => {
    setFormData((prev) => ({
      ...prev,
      city: cityId,
      area: "",
    }));

    if (cityId) {
      const areasData = await getAdminAreas({ limit: 100 });
      setAreas(areasData.filter((a: any) => a.city === cityId));
    } else {
      setAreas([]);
    }
  };

  // Handle map click
  const handleMapClick = (coordinates: [number, number]) => {
    setFormData((prev) => ({
      ...prev,
      coordinates,
    }));
  };

  // Handle flag toggle
  const handleFlagToggle = (flag: string) => {
    setFormData((prev) => ({
      ...prev,
      flags: prev.flags.includes(flag)
        ? prev.flags.filter((f) => f !== flag)
        : [...prev.flags, flag],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        propertyType: formData.propertyType,
        category: formData.category,
        saleOrRent: formData.saleOrRent,
        address: {
          country: formData.country,
          province: formData.province,
          city: formData.city,
          area: formData.area,
          location: {
            coordinates: formData.coordinates,
          },
          fullAddress: formData.fullAddress,
        },
        filters: ad.filters, // Keep existing filters
        price: formData.price,
        flags: formData.flags,
        agency: "", // Keep empty as per requirement
        mainImageId: "", // Keep empty as per requirement
        mediaIds: "", // Keep empty as per requirement
      };

      const response = await updateAdminAd(ad._id, updateData);

      if (response.success) {
        onSuccess();
        onClose();
      } else {
        alert(response.message || "خطا در به‌روزرسانی آگهی");
      }
    } catch (error) {
      console.error("Error updating ad:", error);
      alert("خطا در به‌روزرسانی آگهی");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">ویرایش آگهی</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان آگهی
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قیمت (تومان)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                توضیحات
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Property Type and Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع معامله
                </label>
                <select
                  value={formData.saleOrRent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      saleOrRent: e.target.value as "sale" | "rent",
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="sale">فروش</option>
                  <option value="rent">اجاره</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع ملک
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      propertyType: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {propertyTypes &&
                    propertyTypes.map((type) => (
                      <option key={type._id} value={type._id}>
                        {type.type || type.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  دسته‌بندی
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  کشور
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">انتخاب کنید</option>
                  {countries.map((country) => (
                    <option key={country._id} value={country._id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  استان
                </label>
                <select
                  value={formData.province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!formData.country}
                >
                  <option value="">انتخاب کنید</option>
                  {provinces.map((province) => (
                    <option key={province._id} value={province._id}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شهر
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!formData.province}
                >
                  <option value="">انتخاب کنید</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  منطقه
                </label>
                <select
                  value={formData.area}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, area: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!formData.city}
                >
                  <option value="">انتخاب کنید</option>
                  {areas.map((area) => (
                    <option key={area._id} value={area._id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Full Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                آدرس کامل
              </label>
              <textarea
                value={formData.fullAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    fullAddress: e.target.value,
                  }))
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="آدرس دقیق ملک را وارد کنید"
              />
            </div>

            {/* Map */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                موقعیت روی نقشه
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <MapSelector
                  coordinates={formData.coordinates}
                  onLocationSelect={handleMapClick}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                روی نقشه کلیک کنید تا موقعیت دقیق ملک را انتخاب کنید
              </p>
            </div>

            {/* Flags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                برچسب‌ها
              </label>
              <div className="flex flex-wrap gap-3">
                {["premium", "featured", "urgent"].map((flag) => (
                  <label key={flag} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.flags.includes(flag)}
                      onChange={() => handleFlagToggle(flag)}
                      className="ml-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">
                      {flag === "premium" && "ویژه"}
                      {flag === "featured" && "برجسته"}
                      {flag === "urgent" && "فوری"}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiSave className="w-4 h-4" />
                {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditAdModal;
