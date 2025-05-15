"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Head from "next/head";

type FormData = {
  title: string;
  description: string;
  type: "sale" | "rent";
  propertyType: "apartment" | "villa" | "land" | "commercial";
  price: string;
  area: string;
  rooms: string;
  address: string;
  city: string;
  amenities: string[];
  images: File[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
};

type FormErrors = {
  title?: string;
  description?: string;
  price?: string;
  area?: string;
  address?: string;
  city?: string;
  contactName?: string;
  contactPhone?: string;
  images?: string;
};

export default function AddPropertyPage() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    type: "sale",
    propertyType: "apartment",
    price: "",
    area: "",
    rooms: "",
    address: "",
    city: "",
    amenities: [],
    images: [],
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === "checkbox") {
      setFormData((prev) => {
        const amenities = [...prev.amenities];
        const amenityValue = value;
        
        if (checked) {
          amenities.push(amenityValue);
        } else {
          const index = amenities.indexOf(amenityValue);
          if (index > -1) {
            amenities.splice(index, 1);
          }
        }
        return { ...prev, amenities };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = "عنوان آگهی الزامی است";
    if (!formData.description.trim()) newErrors.description = "توضیحات الزامی است";
    if (!formData.price) newErrors.price = "قیمت الزامی است";
    if (!formData.area) newErrors.area = "متراژ الزامی است";
    if (!formData.address.trim()) newErrors.address = "آدرس الزامی است";
    if (!formData.city.trim()) newErrors.city = "شهر الزامی است";
    if (!formData.contactName.trim()) newErrors.contactName = "نام تماس الزامی است";
    if (!formData.contactPhone.trim()) newErrors.contactPhone = "تلفن تماس الزامی است";
    if (formData.images.length === 0) newErrors.images = "حداقل یک تصویر الزامی است";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      console.log("Form data:", formData);

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>درج آگهی ملک</title>
        <meta name="description" content="صفحه درج آگهی فروش یا اجاره ملک" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-white py-4 px-6">
            <h1 className="text-dark text-2xl font-bold">درج آگهی ملک جدید</h1>
          </div>

          {submitSuccess ? (
            <div className="p-6">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                <strong className="font-bold">آگهی با موفقیت ثبت شد!</strong>
                <span className="block sm:inline"> آگهی شما پس از تایید در سایت نمایش داده خواهد شد.</span>
              </div>
              <button
                onClick={() => setSubmitSuccess(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                ثبت آگهی جدید
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* بخش اول */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="title">
                      عنوان آگهی *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="مثال: آپارتمان ۳ خوابه نوساز در نیاوران"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                      توضیحات *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.description ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="توضیحات کامل درباره ملک..."
                    ></textarea>
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      نوع آگهی *
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value="sale"
                          checked={formData.type === "sale"}
                          onChange={handleChange}
                          className="text-blue-600"
                        />
                        <span className="mr-2">فروش</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="type"
                          value="rent"
                          checked={formData.type === "rent"}
                          onChange={handleChange}
                          className="text-blue-600"
                        />
                        <span className="mr-2">اجاره</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="propertyType">
                      نوع ملک *
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="apartment">آپارتمان</option>
                      <option value="villa">ویلا</option>
                      <option value="land">زمین</option>
                      <option value="commercial">تجاری</option>
                    </select>
                  </div>
                </div>

                {/* بخش دوم */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="price">
                      قیمت (تومان) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="مثال: 5000000000"
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="area">
                      متراژ (متر مربع) *
                    </label>
                    <input
                      type="number"
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.area ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="مثال: 120"
                    />
                    {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="rooms">
                      تعداد اتاق
                    </label>
                    <select
                      id="rooms"
                      name="rooms"
                      value={formData.rooms}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">انتخاب کنید</option>
                      <option value="1">۱</option>
                      <option value="2">۲</option>
                      <option value="3">۳</option>
                      <option value="4">۴</option>
                      <option value="5+">۵+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* بخش آدرس */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="address">
                    آدرس دقیق *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="خیابان، پلاک، طبقه، واحد"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="city">
                    شهر *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="مثال: تهران"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
              </div>

              {/* امکانات */}
              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-2">
                  امکانات
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {[
                    "پارکینگ",
                    "آسانسور",
                    "انباری",
                    "بالکن",
                    "پنت هاوس",
                    "جکوزی",
                    "استخر",
                    "سالن ورزش",
                    "آنتن مرکزی",
                    "اینترنت",
                    "لوله کشی گاز",
                    "سیستم گرمایشی",
                    "سیستم سرمایشی",
                    "درب ضد سرقت",
                    "حیاط",
                    "شوفاژ",
                  ].map((amenity) => (
                    <label key={amenity} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        value={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onChange={handleChange}
                        className="text-blue-600"
                      />
                      <span className="mr-2">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* آپلود تصاویر */}
              <div className="mt-6">
                <label className="block text-gray-700 font-medium mb-2">
                  تصاویر ملک *
                </label>
                {errors.images && <p className="text-red-500 text-sm mb-2">{errors.images}</p>}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                  <input
                    type="file"
                    id="images"
                    name="images"
                    onChange={handleImageUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <label
                    htmlFor="images"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      برای آپلود تصاویر کلیک کنید یا فایل‌ها را اینجا بکشید
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      حداکثر حجم هر فایل: 5MB (فرمت‌های مجاز: JPG, PNG)
                    </p>
                  </label>
                </div>

                {/* نمایش تصاویر انتخاب شده */}
                {formData.images.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-gray-700 font-medium mb-2">تصاویر انتخاب شده:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`ملک ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* اطلاعات تماس */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="contactName">
                    نام تماس‌دهنده *
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contactName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="نام و نام خانوادگی"
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="contactPhone">
                    تلفن تماس *
                  </label>
                  <input
                    type="tel"
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.contactPhone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="مثال: 09123456789"
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.contactPhone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="contactEmail">
                    ایمیل (اختیاری)
                  </label>
                  <input
                    type="email"
                    id="contactEmail"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="example@example.com"
                  />
                </div>
              </div>

              {/* دکمه ارسال */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium text-white ${
                    isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  {isSubmitting ? "در حال ارسال..." : "ثبت آگهی"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}