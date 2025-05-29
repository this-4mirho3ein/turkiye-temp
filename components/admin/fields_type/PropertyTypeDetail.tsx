"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaCalendarAlt,
  FaCheck,
  FaGlobe,
  FaLayerGroup,
  FaLink,
  FaSave,
  FaSortNumericDown,
  FaTag,
  FaTimes,
  FaTrash,
  FaHouseUser,
  FaRegBuilding,
  FaChartLine,
  FaChevronLeft,
} from "react-icons/fa";
import { Button, addToast } from "@heroui/react";
import { getAdminPropertyType } from "@/controllers/makeRequest";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Card, { CardBody, CardHeader } from "@/components/admin/ui/Card";

interface PropertyTypeDetailProps {
  id: string;
}

interface PropertyType {
  _id: string;
  type: string;
  enName: string;
  row: number;
  isActive: boolean;
  isDeleted: boolean;
  slug: string;
  adCount: number;
  createdAt: string;
  updatedAt: string;
  categories?: any[];
}

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
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
      stiffness: 100,
      damping: 15,
    },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
    },
  },
};

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
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

const formatNumber = (num: number | undefined) => {
  if (num === undefined || num === null) return "۰"; // Persian zero
  return num.toLocaleString("fa-IR");
};

const PropertyTypeDetail: React.FC<PropertyTypeDetailProps> = ({ id }) => {
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPropertyType = async () => {
      try {
        setIsLoading(true);
        const response = await getAdminPropertyType(id);

        if (response.success && response.data) {
          setPropertyType(response.data);
          setError(null);
        } else {
          setError(
            response.message || "خطا در دریافت اطلاعات نوع کاربری رخ داده است"
          );
          addToast({
            title: "خطا",
            description:
              response.message ||
              "خطا در دریافت اطلاعات نوع کاربری رخ داده است",
            color: "danger",
          });
        }
      } catch (err) {
        console.error("Error fetching property type:", err);
        setError("خطا در دریافت اطلاعات نوع کاربری رخ داده است");
        addToast({
          title: "خطا",
          description: "خطا در دریافت اطلاعات نوع کاربری رخ داده است",
          color: "danger",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyType();
  }, [id]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "تاریخ نامشخص";

    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full border-4 border-primary border-r-transparent h-14 w-14 mb-6"></div>
          <h3 className="text-xl font-medium text-gray-700">
            در حال بارگذاری اطلاعات...
          </h3>
          <p className="text-gray-500 mt-2">لطفا کمی صبر کنید</p>
        </div>
      </div>
    );
  }

  if (error || !propertyType) {
    return (
      <motion.div
        className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-3xl mx-auto shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <FaTimes className="text-red-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-3">
            خطا در بارگذاری اطلاعات
          </h2>
          <p className="text-red-600 mb-8 text-lg">{error}</p>
          <div className="flex gap-4">
            <Button
              color="primary"
              variant="solid"
              onClick={() => router.refresh()}
              className="gap-1.5 text-white px-5 py-2.5"
              size="lg"
            >
              <FaSave className="ml-1.5" /> تلاش مجدد
            </Button>
            <Link href="/admin/fields_type">
              <Button
                color="secondary"
                variant="flat"
                className="gap-1.5 px-5 py-2.5"
                size="lg"
              >
                <FaArrowRight className="ml-1.5" /> بازگشت به لیست
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="rtl"
      dir="rtl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header with gradient background */}
      <motion.div
        className="mb-8 bg-gradient-to-r from-white via-indigo-50 to-primary-50 p-6 rounded-xl shadow-sm border border-indigo-100/60 text-gray-800"
        variants={fadeInUp}
      >
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-500 mb-3 flex items-center justify-start">
          <span
            className="hover:text-primary cursor-pointer transition-colors"
            onClick={() => router.push("/admin")}
          >
            داشبورد
          </span>
          <FaChevronLeft className="mx-2 text-gray-400" size={10} />
          <span
            className="hover:text-primary cursor-pointer transition-colors"
            onClick={() => router.push("/admin/fields_type")}
          >
            انواع کاربری
          </span>
          <FaChevronLeft className="mx-2 text-gray-400" size={10} />
          <span className="text-primary font-medium">{propertyType.type}</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              <span className="ml-2 text-primary">{propertyType.type}</span>
              <span>جزئیات نوع کاربری</span>
            </h1>
          </div>

          <div className="flex gap-3 self-start md:self-auto">
            <Button
              color="secondary"
              variant="light"
              onClick={() => router.push("/admin/fields_type")}
              className="px-4 py-2 transition-all hover:bg-gray-100 flex items-center"
            >
              <FaArrowRight className="ml-2" />
              <span>بازگشت</span>
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Property Type Icon Card */}
        <motion.div variants={cardVariants} className="md:order-1">
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-l from-emerald-500 to-teal-600 text-white py-5">
              <h2 className="text-xl font-bold flex items-center justify-center">
                <FaRegBuilding className="ml-3 text-2xl" />
                نوع کاربری
              </h2>
            </CardHeader>
            <CardBody className="p-0">
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-gray-100">
                <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <FaHouseUser className="text-white text-4xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-1 text-center">
                  {propertyType.type}
                </h3>
                <div className="text-lg text-gray-600 font-mono text-center">
                  {propertyType.enName}
                </div>
                <div className="mt-4 flex justify-center">
                  {propertyType.isActive ? (
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                      <FaCheck className="ml-1.5" /> فعال
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                      <FaTimes className="ml-1.5" /> غیرفعال
                    </span>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Main Info Card */}
        <motion.div
          className="md:col-span-2 md:order-2"
          variants={itemVariants}
        >
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-l from-blue-500 to-indigo-600 text-white py-5">
              <h2 className="text-xl font-bold flex items-center">
                <FaTag className="ml-3 text-xl" />
                اطلاعات اصلی
              </h2>
            </CardHeader>
            <CardBody className="divide-y divide-gray-100 bg-white">
              {/* Details grid with improved styling */}
              <div className="py-5 px-1 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4 text-right">
                <motion.div
                  variants={fadeInVariants}
                  className="bg-gradient-to-br from-slate-50 to-blue-50 p-4 rounded-lg border border-slate-200"
                >
                  <span className="text-gray-500 text-sm block mb-1.5 text-right">
                    نام فارسی:
                  </span>
                  <div className="font-semibold text-lg text-right text-gray-800">
                    {propertyType.type}
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInVariants}
                  className="bg-gradient-to-br from-slate-50 to-purple-50 p-4 rounded-lg border border-slate-200"
                >
                  <span className="text-gray-500 text-sm block mb-1.5 text-right">
                    نام انگلیسی:
                  </span>
                  <div className="font-semibold text-lg text-right font-mono text-gray-800">
                    {propertyType.enName}
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInVariants}
                  className="bg-gradient-to-br from-slate-50 to-indigo-50 p-4 rounded-lg border border-slate-200"
                >
                  <span className="text-gray-500 text-sm block mb-1.5 text-right">
                    نامک (Slug):
                  </span>
                  <div className="font-semibold text-right font-mono text-gray-800 overflow-auto">
                    {propertyType.slug}
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInVariants}
                  className="bg-gradient-to-br from-slate-50 to-green-50 p-4 rounded-lg border border-slate-200"
                >
                  <span className="text-gray-500 text-sm block mb-1.5 text-right">
                    اولویت نمایش:
                  </span>
                  <div className="font-semibold text-right text-gray-800">
                    {propertyType.row}
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInVariants}
                  className="bg-gradient-to-br from-slate-50 to-yellow-50 p-4 rounded-lg border border-slate-200"
                >
                  <span className="text-gray-500 text-sm block mb-1.5 text-right">
                    وضعیت:
                  </span>
                  <div className="text-right">
                    {propertyType.isActive ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                        <FaCheck className="ml-1.5" /> فعال
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                        <FaTimes className="ml-1.5" /> غیرفعال
                      </span>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  variants={fadeInVariants}
                  className="bg-gradient-to-br from-slate-50 to-red-50 p-4 rounded-lg border border-slate-200"
                >
                  <span className="text-gray-500 text-sm block mb-1.5 text-right">
                    وضعیت حذف:
                  </span>
                  <div className="text-right">
                    {propertyType.isDeleted ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                        <FaTrash className="ml-1.5" /> حذف شده
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                        <FaCheck className="ml-1.5" /> فعال
                      </span>
                    )}
                  </div>
                </motion.div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          variants={cardVariants}
          className="md:col-span-3 md:order-3"
        >
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-l from-purple-500 to-violet-600 text-white py-5">
              <h2 className="text-xl font-bold flex items-center">
                <FaChartLine className="ml-3 text-xl" />
                آمار و اطلاعات
              </h2>
            </CardHeader>
            <CardBody className="bg-white">
              <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                  variants={fadeInVariants}
                  className="bg-gradient-to-br from-slate-50 to-purple-50 p-6 rounded-xl border border-slate-200 shadow-sm"
                >
                  <span className="text-gray-500 text-sm block mb-2 text-right">
                    تعداد آگهی‌ها:
                  </span>
                  <div className="flex items-center justify-center bg-purple-100 rounded-lg p-5 text-center">
                    <span className="text-3xl font-bold text-purple-700">
                      {formatNumber(propertyType.adCount)}
                    </span>
                    <span className="text-purple-600 mr-2 text-sm">آگهی</span>
                  </div>
                </motion.div>

                {/* <motion.div
                  variants={fadeInVariants}
                  className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl border border-slate-200 shadow-sm"
                >
                  <span className="text-gray-500 text-sm block mb-2 text-right">
                    تاریخ ایجاد:
                  </span>
                  <div className="flex items-center text-right bg-blue-100 rounded-lg p-5 text-right shadow-inner">
                    <FaCalendarAlt className="text-blue-500 ml-3 text-lg" />
                    <span
                      className="text-blue-700 text-xl"
                      style={{ direction: "rtl" }}
                    >
                      {formatDate(propertyType.createdAt)}
                    </span>
                  </div>
                </motion.div> */}

                <motion.div
                  variants={fadeInVariants}
                  className="bg-gradient-to-br from-slate-50 to-indigo-50 p-6 rounded-xl border border-slate-200 shadow-sm"
                >
                  <span className="text-gray-500 text-sm block mb-2 text-right">
                    آخرین بروزرسانی:
                  </span>
                  <div className="flex items-center text-right bg-indigo-100 rounded-lg p-5 text-right shadow-inner">
                    <FaCalendarAlt className="text-indigo-500 ml-3 text-lg" />
                    <span
                      className="text-indigo-700 text-xl"
                      style={{ direction: "rtl" }}
                    >
                      {formatDate(propertyType.updatedAt)}
                    </span>
                  </div>
                </motion.div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Categories Section (if available) */}
      {propertyType.categories && propertyType.categories.length > 0 && (
        <motion.div className="mt-6" variants={itemVariants}>
          <Card className="overflow-hidden border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-l from-green-500 to-teal-600 text-white py-5">
              <h2 className="text-xl font-bold flex items-center">
                <FaLayerGroup className="ml-3 text-xl" />
                دسته‌بندی‌ها ({propertyType.categories.length})
              </h2>
            </CardHeader>
            <CardBody className="bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 py-4">
                {propertyType.categories.map((category: any, index: number) => (
                  <motion.div
                    key={category._id || index}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-green-50"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          delay: index * 0.05,
                          duration: 0.3,
                        },
                      },
                    }}
                  >
                    <div className="font-semibold text-gray-800 text-lg text-right mb-2">
                      {category.name}
                    </div>
                    {category.slug && (
                      <div className="text-gray-500 text-sm mt-1 font-mono text-right">
                        <FaLink className="inline ml-1 text-xs" />
                        {category.slug}
                      </div>
                    )}
                    {category.count !== undefined && (
                      <div className="bg-green-100 text-green-700 text-sm font-semibold rounded-full px-3 py-1.5 inline-block mt-3 shadow-sm border border-green-200">
                        <FaSortNumericDown className="inline ml-1" />
                        {formatNumber(category.count)} آگهی
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PropertyTypeDetail;
