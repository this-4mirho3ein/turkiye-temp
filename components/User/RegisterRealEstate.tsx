"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, Input, Button, Spinner } from "@heroui/react";
import { FiSave, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import ImageUpload from "./UploadImage";
import { registerAgency } from "@/controllers/makeRequest";

interface AgencyRegistrationData {
  name_estate: string;
  national_code: string;
  national_id_photo: File | null;
  code_license: string;
  license_image: File | null;
}

export default function RegisterRealEstate() {
  const { state } = useAuth();
  const [formData, setFormData] = useState<AgencyRegistrationData>({
    name_estate: "",
    national_code: "",
    national_id_photo: null,
    code_license: "",
    license_image: null,
  });

  const [errors, setErrors] = useState<{
    name_estate?: string;
    national_code?: string;
    national_id_photo?: string;
    code_license?: string;
    license_image?: string;
  }>({});

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (field: keyof AgencyRegistrationData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user makes changes
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handlenational_id_photoChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, national_id_photo: file }));

    if (errors.national_id_photo) {
      setErrors((prev) => ({ ...prev, national_id_photo: undefined }));
    }
  };

  const handlelicense_imageChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, license_image: file }));

    if (errors.license_image) {
      setErrors((prev) => ({ ...prev, license_image: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: {
      name_estate?: string;
      national_code?: string;
      national_id_photo?: string;
      code_license?: string;
      license_image?: string;
    } = {};

    // Validate agency name
    if (!formData.name_estate.trim()) {
      newErrors.name_estate = "نام آژانس الزامی است";
    }

    // Validate national code (should be 10 digits)
    if (!formData.national_code) {
      newErrors.national_code = "کد ملی الزامی است";
    } else if (!/^\d{10}$/.test(formData.national_code)) {
      newErrors.national_code = "کد ملی باید ۱۰ رقم باشد";
    }

    // Validate national code image
    if (!formData.national_id_photo) {
      newErrors.national_id_photo = "تصویر کد ملی الزامی است";
    }

    // Validate business license code
    if (!formData.code_license.trim()) {
      newErrors.code_license = "کد پروانه کسب الزامی است";
    }

    // Validate business license image
    if (!formData.license_image) {
      newErrors.license_image = "تصویر پروانه کسب الزامی است";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus("submitting");

    try {
      // Create FormData for submitting files
      const formDataToSubmit = new FormData();
      formDataToSubmit.append("name_estate", formData.name_estate);
      formDataToSubmit.append("national_code", formData.national_code);

      if (formData.national_id_photo) {
        formDataToSubmit.append(
          "national_id_photo",
          formData.national_id_photo
        );
      }

      formDataToSubmit.append("code_license", formData.code_license);

      if (formData.license_image) {
        formDataToSubmit.append("license_image", formData.license_image);
      }

      // Send the data to the backend
      const response = await registerAgency(
        state.accessToken,
        formDataToSubmit
      );

      console.log("Agency registration response:", response);

      if (response.status === 200 || response.status === 201) {
        setStatus("success");
        // Optional: Reset form after successful submission
        /*
        setFormData({
          name_estate: "",
          national_code: "",
          national_id_photo: null,
          code_license: "",
          license_image: null,
        });
        */
      } else {
        console.error(
          "API returned non-success status:",
          response.status,
          response.message
        );
        throw new Error(response.message || "Error registering agency");
      }
    } catch (error) {
      console.error("Error submitting agency registration:", error);
      setStatus("error");
    }
  };

  return (
    <div className="col-span-12 lg:col-span-9">
      <Card className="rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row items-center mb-8">
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ثبت آژانس املاک
            </h2>
            <p className="text-gray-500 text-sm md:text-base mb-4">
              لطفا اطلاعات آژانس خود را وارد کنید تا پس از تایید ادمین، حساب
              کاربری آژانس شما فعال شود
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Agency Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              نام آژانس <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.name_estate}
              onChange={(e) => handleChange("name_estate", e.target.value)}
              placeholder="نام آژانس املاک خود را وارد کنید"
              className="w-full text-right"
              isInvalid={!!errors.name_estate}
              errorMessage={errors.name_estate}
            />
          </div>

          {/* National Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              کد ملی <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.national_code}
              onChange={(e) => handleChange("national_code", e.target.value)}
              placeholder="کد ملی مدیر آژانس را وارد کنید"
              className="w-full text-right"
              isInvalid={!!errors.national_code}
              errorMessage={errors.national_code}
            />
          </div>

          {/* National Code Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-2">
              تصویر کد ملی <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col items-start">
              <ImageUpload
                initialImage={undefined}
                onImageChange={handlenational_id_photoChange}
              />
              {errors.national_id_photo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.national_id_photo}
                </p>
              )}
            </div>
          </div>

          {/* Business License Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-1">
              کد پروانه کسب <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              value={formData.code_license}
              onChange={(e) => handleChange("code_license", e.target.value)}
              placeholder="کد پروانه کسب آژانس را وارد کنید"
              className="w-full text-right"
              isInvalid={!!errors.code_license}
              errorMessage={errors.code_license}
            />
          </div>

          {/* Business License Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 text-right mb-2">
              تصویر پروانه کسب <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col items-start">
              <ImageUpload
                initialImage={undefined}
                onImageChange={handlelicense_imageChange}
              />
              {errors.license_image && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.license_image}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              isLoading={status === "submitting"}
              color="primary"
              startContent={status !== "submitting" ? <FiSave /> : null}
              className="bg-primary/80"
              isDisabled={status === "success"}
            >
              {status === "submitting" ? "در حال ارسال..." : "ثبت درخواست"}
            </Button>
          </div>

          {/* Status Messages */}
          {status === "success" && (
            <div className="mt-4 p-3 bg-green-50 text-green-600 rounded-lg flex items-center">
              <FiCheckCircle className="w-5 h-5 ml-2" />
              درخواست ثبت آژانس شما با موفقیت ارسال شد و در صف بررسی قرار گرفت.
              لطفاً وضعیت درخواست خود را از طریق صفحه اعلان ها پیگیری نمایید.
              فرآیند تایید ممکن است تا ۲۴ ساعت کاری زمان ببرد. با تشکر از صبر و
              شکیبایی شما.
            </div>
          )}
          {status === "error" && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
              <FiAlertCircle className="w-5 h-5 ml-2" />
              خطا در ثبت درخواست. لطفا مجددا تلاش کنید.
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
