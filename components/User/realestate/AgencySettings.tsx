import React, { useState } from "react";
import {
  FiSave,
  FiImage,
  FiMapPin,
  FiPhone,
  FiMail,
  FiGlobe,
  FiUpload,
} from "react-icons/fi";

interface AgencySettingsProps {
  userData?: any;
}

export default function AgencySettings({ userData }: AgencySettingsProps) {
  // Mock data for agency settings
  const [agencyData, setAgencyData] = useState({
    name: "آژانس املاک نگین",
    logo: "/agency-logo.jpg",
    bannerImage: "/agency-banner.jpg",
    address: "تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۳",
    phone: "۰۲۱-۸۸۷۷۶۶۵۵",
    email: "info@negin-estate.com",
    website: "www.negin-estate.com",
    description:
      "آژانس املاک نگین با سابقه درخشان در زمینه معاملات املاک در تهران، آماده ارائه خدمات به مشتریان گرامی می‌باشد.",
    workingHours: "شنبه تا پنجشنبه از ساعت ۹ الی ۱۹",
    foundedYear: "۱۳۸۵",
  });

  const [formData, setFormData] = useState({ ...agencyData });
  const [isEditing, setIsEditing] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // Here you would typically upload the images and save the data
    console.log("Files to upload:", { logoFile, bannerFile });
    console.log("Saved data:", formData);

    setAgencyData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(agencyData);
    setLogoPreview(null);
    setBannerPreview(null);
    setLogoFile(null);
    setBannerFile(null);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg my-4 border border-gray-200 p-4">
      <div className="flex justify-between items-center border-b pb-4">
        <h3 className="text-lg font-medium">تنظیمات آژانس</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-2 bg-primary text-white rounded-md text-sm"
          >
            ویرایش اطلاعات
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md text-sm"
            >
              انصراف
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-2 bg-primary text-white rounded-md flex items-center gap-2 text-sm"
            >
              <FiSave size={16} />
              ذخیره تغییرات
            </button>
          </div>
        )}
      </div>

      <div className="my-6">
        {/* Agency Profile View (When not editing) */}
        {!isEditing ? (
          <div className="space-y-6">
            {/* Banner Image */}
            <div className="w-full h-40 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden relative">
              {agencyData.bannerImage ? (
                <img
                  src={agencyData.bannerImage}
                  alt="تصویر بنر آژانس"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiImage size={32} className="text-gray-400" />
                  <p className="text-gray-500 mt-2">تصویر بنر</p>
                </div>
              )}
            </div>

            {/* Logo and Basic Info */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                {agencyData.logo ? (
                  <img
                    src={agencyData.logo}
                    alt={agencyData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FiImage size={32} className="text-gray-400" />
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold">{agencyData.name}</h2>
                <p className="text-gray-600 mt-1">
                  تاسیس: {agencyData.foundedYear}
                </p>
                <p className="text-gray-600 mt-1">{agencyData.workingHours}</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2.5 rounded-lg">
                  <FiMapPin className="text-blue-700" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">آدرس</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {agencyData.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2.5 rounded-lg">
                  <FiPhone className="text-green-700" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    شماره تماس
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {agencyData.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2.5 rounded-lg">
                  <FiMail className="text-purple-700" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">ایمیل</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {agencyData.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-amber-100 p-2.5 rounded-lg">
                  <FiGlobe className="text-amber-700" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">وب‌سایت</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {agencyData.website}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-md font-medium mb-2">درباره آژانس</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {agencyData.description}
              </p>
            </div>
          </div>
        ) : (
          /* Agency Profile Edit Form */
          <div className="space-y-6">
            {/* Banner Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تصویر بنر آژانس
              </label>
              <div
                className="w-full h-40 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 relative overflow-hidden"
                onClick={() =>
                  document.getElementById("banner-upload")?.click()
                }
              >
                {bannerPreview || formData.bannerImage ? (
                  <>
                    <img
                      src={bannerPreview || formData.bannerImage}
                      alt="تصویر بنر"
                      className="w-full h-full object-cover absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="bg-white p-2 rounded-full">
                        <FiUpload className="text-gray-700" size={20} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <FiImage className="text-gray-400 mb-2" size={36} />
                    <span className="text-sm text-gray-500">
                      بارگذاری تصویر بنر
                    </span>
                  </>
                )}
                <input
                  type="file"
                  id="banner-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                سایز پیشنهادی: 1200×300 پیکسل
              </p>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                لوگو آژانس
              </label>
              <div
                className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 relative overflow-hidden"
                onClick={() => document.getElementById("logo-upload")?.click()}
              >
                {logoPreview || formData.logo ? (
                  <>
                    <img
                      src={logoPreview || formData.logo}
                      alt="لوگو"
                      className="w-full h-full object-cover absolute inset-0"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="bg-white p-2 rounded-full">
                        <FiUpload className="text-gray-700" size={20} />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <FiImage className="text-gray-400 mb-2" size={24} />
                    <span className="text-xs text-gray-500">بارگذاری لوگو</span>
                  </>
                )}
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                سایز پیشنهادی: 400×400 پیکسل
              </p>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام آژانس
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  سال تاسیس
                </label>
                <input
                  type="text"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  شماره تماس
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ایمیل
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  وب‌سایت
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ساعات کاری
                </label>
                <input
                  type="text"
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  آدرس
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  درباره آژانس
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
