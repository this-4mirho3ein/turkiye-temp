"use client";

import { useState, useEffect } from "react";
import {
  Input,
  Textarea,
  Button,
  Spinner,
  Select,
  SelectItem,
  Avatar,
} from "@heroui/react";
import { Agency, AgencyStats } from "../data/agencies";
import { addAgency, updateAgency } from "../data/agency-actions";

interface AgencyFormProps {
  agency: Agency | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AgencyForm({
  agency,
  onSuccess,
  onCancel,
}: AgencyFormProps) {
  const isEditMode = !!agency;
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Default empty stats for new agency
  const defaultStats: AgencyStats = {
    totalListings: 0,
    activeSales: 0,
    activeRentals: 0,
    viewsThisMonth: 0,
    inquiriesThisMonth: 0,
    successfulDeals: 0,
  };

  // Form state
  const [formData, setFormData] = useState<
    Omit<Agency, "id" | "reviews" | "complaints" | "staff"> & { id?: number }
  >({
    name: "",
    logo: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    website: "",
    description: "",
    established: "",
    rating: 0,
    reviewsCount: 0,
    status: "pending",
    verified: false,
    stats: defaultStats,
  });

  // Status options for dropdown
  const statusOptions = [
    { value: "active", label: "فعال" },
    { value: "pending", label: "در انتظار تایید" },
    { value: "suspended", label: "تعلیق شده" },
  ];

  // Initialize form with agency data if in edit mode
  useEffect(() => {
    if (agency) {
      setFormData({
        id: agency.id,
        name: agency.name,
        logo: agency.logo || "",
        address: agency.address,
        city: agency.city,
        phone: agency.phone,
        email: agency.email,
        website: agency.website || "",
        description: agency.description,
        established: agency.established,
        rating: agency.rating,
        reviewsCount: agency.reviewsCount,
        status: agency.status,
        verified: agency.verified,
        featuredUntil: agency.featuredUntil,
        stats: agency.stats,
      });
    }
  }, [agency]);

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Validate the form
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "نام آژانس الزامی است";
    }

    if (!formData.address.trim()) {
      errors.address = "آدرس الزامی است";
    }

    if (!formData.city.trim()) {
      errors.city = "شهر الزامی است";
    }

    if (!formData.phone.trim()) {
      errors.phone = "شماره تلفن الزامی است";
    } else if (!/^\d+$/.test(formData.phone.replace(/[-\s]/g, ""))) {
      errors.phone = "شماره تلفن باید فقط شامل اعداد باشد";
    }

    if (!formData.email.trim()) {
      errors.email = "ایمیل الزامی است";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "فرمت ایمیل صحیح نیست";
    }

    if (
      formData.website &&
      !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(
        formData.website
      )
    ) {
      errors.website = "فرمت وب‌سایت صحیح نیست";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (isEditMode && formData.id) {
        // Update existing agency
        await updateAgency(formData as Agency);
      } else {
        // Add new agency
        await addAgency(formData);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving agency:", error);
      setFormErrors({
        submit: "خطا در ذخیره‌سازی اطلاعات. لطفاً دوباره تلاش کنید.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* General Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">اطلاعات کلی</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="نام آژانس"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isRequired
              isInvalid={!!formErrors.name}
              errorMessage={formErrors.name}
            />
          </div>

          <div>
            <Input
              label="لوگو (آدرس URL)"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              startContent={
                formData.logo ? (
                  <Avatar
                    src={formData.logo}
                    alt={formData.name}
                    size="sm"
                    className="ml-1"
                  />
                ) : null
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Select
              label="وضعیت"
              name="status"
              selectedKeys={[formData.status]}
              onChange={handleChange}
              isRequired
            >
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div>
            <Input
              label="سال تاسیس"
              name="established"
              value={formData.established}
              onChange={handleChange}
              isRequired
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <input
                type="checkbox"
                checked={formData.verified}
                onChange={(e) =>
                  handleCheckboxChange("verified", e.target.checked)
                }
                className="rounded text-primary ml-2"
              />
              تایید شده
            </label>
          </div>

          <div>
            <Input
              label="ویژه تا تاریخ"
              name="featuredUntil"
              value={formData.featuredUntil || ""}
              onChange={handleChange}
              placeholder="مثال: ۱۴۰۲/۰۶/۳۰"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium border-b pb-2">اطلاعات تماس</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="شهر"
              name="city"
              value={formData.city}
              onChange={handleChange}
              isRequired
              isInvalid={!!formErrors.city}
              errorMessage={formErrors.city}
            />
          </div>

          <div>
            <Input
              label="آدرس"
              name="address"
              value={formData.address}
              onChange={handleChange}
              isRequired
              isInvalid={!!formErrors.address}
              errorMessage={formErrors.address}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="شماره تلفن"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              isRequired
              isInvalid={!!formErrors.phone}
              errorMessage={formErrors.phone}
            />
          </div>

          <div>
            <Input
              label="ایمیل"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isRequired
              isInvalid={!!formErrors.email}
              errorMessage={formErrors.email}
            />
          </div>
        </div>

        <div>
          <Input
            label="وب‌سایت"
            name="website"
            value={formData.website}
            onChange={handleChange}
            isInvalid={!!formErrors.website}
            errorMessage={formErrors.website}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Textarea
          label="توضیحات"
          name="description"
          value={formData.description}
          onChange={handleChange}
          minRows={3}
          isRequired
        />
      </div>

      {/* Form Error */}
      {formErrors.submit && (
        <div className="text-red-600 text-sm">{formErrors.submit}</div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-3">
        <Button color="default" onClick={onCancel} disabled={isLoading}>
          انصراف
        </Button>

        <Button color="primary" type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner size="sm" color="white" className="ml-2" />
              در حال ذخیره‌سازی...
            </>
          ) : isEditMode ? (
            "بروزرسانی آژانس"
          ) : (
            "افزودن آژانس"
          )}
        </Button>
      </div>
    </form>
  );
}
