"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge, Divider } from "@heroui/react";
import {
  FaArrowRight,
  FaEdit,
  FaCheck,
  FaTimesCircle,
  FaLink,
  FaHistory,
  FaChevronLeft,
  FaGlobe,
  FaSort,
  FaCalendarAlt,
  FaLayerGroup,
  FaClock,
} from "react-icons/fa";
import { useToast } from "@/components/admin/ui/ToastProvider";
import Card from "@/components/admin/ui/Card";
import Button from "@/components/admin/ui/Button";
import { getAdminCategoryById } from "@/controllers/makeRequest";
import { motion } from "framer-motion";
import AdminLoading from "@/components/admin/ui/AdminLoading";

interface PropertyType {
  _id: string;
  type: string;
  enName: string;
  row: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

interface Category {
  _id: string;
  name: string;
  enName: string;
  row: number;
  propertyType: PropertyType;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  slug: string;
}

interface ApiResponse {
  status: number;
  data: Category;
  message: string;
  success: boolean;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const staggerItems = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export default function CategoryDetailsPage() {
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCategory = async () => {
      setIsLoading(true);
      try {
        if (!id) {
          setError("شناسه دسته‌بندی نامعتبر است");
          setIsLoading(false);
          showToast({
            type: "error",
            title: "خطا",
            message: "شناسه دسته‌بندی نامعتبر است",
          });
          return;
        }

        const categoryId = Array.isArray(id) ? id[0] : (id as string);
        const response = await getAdminCategoryById(categoryId);

        if (response.success) {
          setCategory(response.data);
          setError(null);
          showToast({
            type: "success",
            title: "موفق",
            message: "اطلاعات دسته‌بندی با موفقیت دریافت شد",
          });
        } else {
          setError(response.message || "خطا در دریافت اطلاعات دسته‌بندی");
          showToast({
            type: "error",
            title: "خطا",
            message: response.message || "خطا در دریافت اطلاعات دسته‌بندی",
          });
        }
      } catch (err) {
        console.error("Error fetching category:", err);
        setError("خطا در ارتباط با سرور");
        showToast({
          type: "error",
          title: "خطا",
          message: "خطا در ارتباط با سرور. لطفاً مجدداً تلاش کنید",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id, showToast]);

  // Format date to Jalali
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <AdminLoading
        type="category"
        message="لطفاً کمی صبر کنید، در حال دریافت اطلاعات دسته‌بندی..."
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] grid place-items-center p-6 rtl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-r from-rose-50 to-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-sm"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 text-red-600 mb-6">
            <FaTimesCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            خطا در دریافت اطلاعات
          </h2>
          <p className="text-gray-700 mb-8 text-lg text-right">{error}</p>
          <Button
            color="primary"
            size="lg"
            onClick={handleBack}
            className="px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto"
          >
            <span>بازگشت به صفحه دسته‌بندی‌ها</span>
            <FaArrowRight className="mr-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[80vh] grid place-items-center p-6 rtl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-sm"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-yellow-100 text-yellow-600 mb-6">
            <FaTimesCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            دسته‌بندی یافت نشد
          </h2>
          <p className="text-gray-700 mb-8 text-lg text-right">
            دسته‌بندی مورد نظر در سیستم یافت نشد.
          </p>
          <Button
            color="primary"
            size="lg"
            onClick={handleBack}
            className="px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300 w-full md:w-auto"
          >
            <span>بازگشت به صفحه دسته‌بندی‌ها</span>
            <FaArrowRight className="mr-2" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 py-6 rtl"
      dir="rtl"
    >
      {/* Header with gradient background */}
      <motion.div
        variants={fadeInUp}
        className="bg-gradient-to-r from-white via-indigo-50 to-primary-50 p-6 rounded-xl shadow-sm mb-6 border border-indigo-100/60"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col">
            <div className="text-sm text-gray-500 mb-2 flex items-center justify-start">
              <span
                className="hover:text-primary cursor-pointer transition-colors"
                onClick={() => router.push("/admin")}
              >
                داشبورد
              </span>
              <FaChevronLeft className="mx-2 text-gray-400" size={10} />
              <span
                className="hover:text-primary cursor-pointer transition-colors"
                onClick={() => router.push("/admin/categories")}
              >
                دسته‌بندی‌ها
              </span>
              <FaChevronLeft className="mx-2 text-gray-400" size={10} />
              <span className="text-primary font-medium">{category.name}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <span className="ml-2 text-primary">{category.name}</span>
              <span>اطلاعات دسته‌بندی</span>
            </h1>
          </div>

          <div className="flex gap-3 self-start md:self-auto">
            <Button
              color="secondary"
              variant="light"
              onClick={handleBack}
              className="px-4 py-2 transition-all hover:bg-gray-100 flex items-center"
            >
              <FaArrowRight className="ml-2" />
              <span>بازگشت</span>
            </Button>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 mt-4">
          {category.isDeleted ? (
            <Badge
              color="danger"
              className="px-3 pt-1 text-sm rounded-lg shadow-sm inline-flex items-center mt-4 mr-1"
            >
              <FaTimesCircle className="ml-3" />
              <span>حذف شده</span>
            </Badge>
          ) : category.isActive ? (
            <Badge
              color="success"
              className="px-3 pt-1 text-sm rounded-lg shadow-sm inline-flex items-center mt-4 mr-1"
            >
              <FaCheck className="ml-3 " />
              <span>فعال</span>
            </Badge>
          ) : (
            <Badge
              color="warning"
              className="px-3 pt-1 text-sm rounded-lg shadow-sm inline-flex items-center mt-4 mr-1"
            >
              <FaTimesCircle className="ml-3" />
              <span>غیرفعال</span>
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <motion.div
        variants={staggerItems}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* General Information Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card
            shadow="sm"
            className="overflow-hidden border border-gray-100 rounded-xl hover:shadow-md transition-shadow duration-300"
          >
            <div className="bg-gradient-to-r from-primary-50 via-indigo-50 to-blue-50 py-3 px-6">
              <h2 className="text-lg font-bold text-gray-700 flex items-center">
                اطلاعات اصلی
                <FaLayerGroup className="mr-2 text-primary" size={18} />
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <motion.div
                  variants={fadeInScale}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm hover:bg-gray-50/80 transition-all duration-300"
                >
                  <p className="text-sm text-gray-500 flex items-center mb-2">
                    نام دسته‌بندی
                    <FaLayerGroup className="mr-1.5 text-primary" size={14} />
                  </p>
                  <p className="text-lg font-medium text-gray-800">
                    {category.name}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInScale}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm hover:bg-gray-50/80 transition-all duration-300"
                >
                  <p className="text-sm text-gray-500 flex items-center mb-2">
                    نام انگلیسی
                    <FaGlobe className="mr-1.5 text-primary" size={14} />
                  </p>
                  <p className="text-lg font-medium text-gray-800" dir="ltr">
                    {category.enName}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInScale}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm hover:bg-gray-50/80 transition-all duration-300"
                >
                  <p className="text-sm text-gray-500 flex items-center mb-2">
                    ردیف نمایش
                    <FaSort className="mr-1.5 text-primary" size={14} />
                  </p>
                  <p className="text-lg font-medium text-gray-800">
                    {category.row}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInScale}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm hover:bg-gray-50/80 transition-all duration-300"
                >
                  <p className="text-sm text-gray-500 flex items-center mb-2">
                    اسلاگ
                    <FaLink className="mr-1.5 text-primary" size={14} />
                  </p>
                  <p className="text-lg font-medium text-gray-800" dir="ltr">
                    {category.slug}
                  </p>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Dates and Meta Info Card */}
        <motion.div variants={itemVariants}>
          <Card
            shadow="sm"
            className="h-fit border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 py-3 px-6">
              <h2 className="text-lg font-bold text-gray-700 flex items-center">
                اطلاعات زمانی
                <FaCalendarAlt className="mr-2 text-emerald-600" size={18} />
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <motion.div
                  variants={fadeInScale}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm hover:bg-gray-50/80 transition-all duration-300"
                >
                  <p className="text-sm text-gray-500 flex items-center mb-2">
                    تاریخ ایجاد
                    <FaCalendarAlt
                      className="mr-1.5 text-green-500"
                      size={14}
                    />
                  </p>
                  <p className="text-md font-medium text-gray-800">
                    {formatDate(category.createdAt)}
                  </p>
                </motion.div>

                <motion.div
                  variants={fadeInScale}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm hover:bg-gray-50/80 transition-all duration-300"
                >
                  <p className="text-sm text-gray-500 flex items-center mb-2">
                    آخرین به‌روزرسانی
                    <FaHistory className="mr-1.5 text-green-500" size={14} />
                  </p>
                  <p className="text-md font-medium text-gray-800">
                    {formatDate(category.updatedAt)}
                  </p>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Property Type Card */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <Card
            shadow="sm"
            className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 py-3 px-6">
              <h2 className="text-lg font-bold text-gray-700 flex items-center">
                نوع کاربری مرتبط
                <FaGlobe className="mr-2 text-indigo-600" size={18} />
              </h2>
            </div>
            <div className="p-6">
              {category.propertyType ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center mb-5">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            {category.propertyType.type}
                          </h3>
                          <p className="text-sm text-gray-500" dir="ltr">
                            {category.propertyType.enName}
                          </p>
                        </div>
                        <div className="mr-3 w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">
                          <FaGlobe className="text-indigo-500" size={20} />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <motion.div
                          variants={fadeInScale}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:shadow-sm hover:bg-gray-50/80 transition-all duration-300"
                        >
                          <p className="text-xs text-gray-500 mb-1 flex items-center">
                            ردیف نمایش
                            <FaSort
                              className="mr-1.5 text-indigo-500"
                              size={12}
                            />
                          </p>
                          <p className="text-md font-medium text-gray-800">
                            {category.propertyType.row}
                          </p>
                        </motion.div>

                        <motion.div
                          variants={fadeInScale}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:shadow-sm hover:bg-gray-50/80 transition-all duration-300"
                        >
                          <p className="text-xs text-gray-500 mb-1 flex items-center">
                            اسلاگ
                            <FaLink
                              className="mr-1.5 text-indigo-500"
                              size={12}
                            />
                          </p>
                          <p
                            className="text-md font-medium text-gray-800"
                            dir="ltr"
                          >
                            {category.propertyType.slug}
                          </p>
                        </motion.div>

                        <motion.div
                          variants={fadeInScale}
                          className="bg-gray-50 rounded-lg p-3 border border-gray-100 hover:shadow-sm hover:bg-gray-50/80 transition-all duration-300"
                        >
                          <p className="text-xs text-gray-500 mb-1 flex items-center">
                            تاریخ ایجاد
                            <FaClock
                              className="mr-1.5 text-indigo-500"
                              size={12}
                            />
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {formatDate(category.propertyType.createdAt)}
                          </p>
                        </motion.div>
                      </div>
                    </div>

                    <div className="md:border-r md:pr-6 pt-4 md:pt-0">
                      <Divider
                        orientation="horizontal"
                        className="mb-4 md:hidden"
                      />
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">وضعیت</p>
                        <div>
                          {category.propertyType.isDeleted ? (
                            <Badge
                              color="danger"
                              className="px-4 pt-1 text-sm rounded-lg shadow-sm inline-flex items-center mt-4 mr-1"
                            >
                              <FaTimesCircle className="ml-3" />
                              <span>حذف شده</span>
                            </Badge>
                          ) : category.propertyType.isActive ? (
                            <Badge
                              color="success"
                              className="px-4 pt-1 text-sm rounded-lg shadow-sm inline-flex items-center mt-4 mr-1"
                            >
                              <FaCheck className="ml-3" />
                              <span>فعال</span>
                            </Badge>
                          ) : (
                            <Badge
                              color="warning"
                              className="px-4 pt-1 text-sm rounded-lg shadow-sm inline-flex items-center mt-4 mr-1"
                            >
                              <FaTimesCircle className="ml-3" />
                              <span>غیرفعال</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.div
                  variants={fadeInScale}
                  className="bg-yellow-50 rounded-xl border border-yellow-100 p-6 text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-4">
                    <FaTimesCircle size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    اطلاعات کاربری موجود نیست
                  </h3>
                  <p className="text-gray-600">
                    اطلاعات مربوط به نوع کاربری برای این دسته‌بندی موجود
                    نمی‌باشد.
                  </p>
                </motion.div>
              )}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
