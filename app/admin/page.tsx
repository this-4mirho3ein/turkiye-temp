"use client";

import { useEffect, useState } from "react";
import DashboardStats from "@/components/admin/DashboardStats";
import adminAuthService from "@/components/admin/login/services/authService";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaUsers,
  FaGlobe,
  FaLayerGroup,
  FaList,
  FaChartBar,
  FaArrowRight,
  FaBuilding,
  FaBell,
  FaCalendarAlt,
  FaCog,
  FaEnvelope,
  FaUserCog,
  FaUserShield,
  FaUserTie,
} from "react-icons/fa";
import { IconType } from "react-icons";

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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
  hover: {
    y: -8,
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
};

type ColorType =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info";

interface AdminCardProps {
  title: string;
  description: string;
  icon: IconType;
  href: string;
  color?: ColorType;
  count?: number | null;
  delay?: number;
}

const AdminCard = ({
  title,
  description,
  icon: Icon,
  href,
  color = "primary",
  count = null,
  delay = 0,
}: AdminCardProps) => {
  const colorClasses: Record<ColorType, string> = {
    primary: "from-blue-500 to-indigo-600",
    secondary: "from-purple-500 to-indigo-600",
    success: "from-green-500 to-emerald-600",
    danger: "from-red-500 to-rose-600",
    warning: "from-orange-500 to-amber-600",
    info: "from-cyan-500 to-sky-600",
  };

  const lightColorClasses: Record<ColorType, string> = {
    primary: "bg-blue-50 text-blue-600",
    secondary: "bg-purple-50 text-purple-600",
    success: "bg-green-50 text-green-600",
    danger: "bg-red-50 text-red-600",
    warning: "bg-orange-50 text-orange-600",
    info: "bg-cyan-50 text-cyan-600",
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay }}
      className="col-span-1"
    >
      <Link href={href}>
        <div className="h-full rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-white hover:border-primary transition-all duration-300">
          <div
            className={`p-5 bg-gradient-to-r ${colorClasses[color]} text-white`}
          >
            <div className="flex justify-between items-center">
              <div className="rounded-full bg-white/20 p-3">
                <Icon className="w-6 h-6" />
              </div>
              {count !== null && (
                <div className="text-3xl font-bold">{count}</div>
              )}
            </div>
            <h3 className="text-xl font-bold mt-4 mb-1">{title}</h3>
            <p className="text-sm text-white/80">{description}</p>
          </div>
          <div className="px-5 py-4 flex justify-between items-center">
            <span
              className={`text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full flex items-center gap-1.5`}
            >
              مشاهده <FaArrowRight className="text-xs" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

interface NotificationItemProps {
  title: string;
  message: string;
  time: string;
  isNew?: boolean;
}

const NotificationItem = ({
  title,
  message,
  time,
  isNew = false,
}: NotificationItemProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className={`p-4 border-b last:border-0 border-gray-100 ${
      isNew ? "bg-blue-50" : ""
    }`}
  >
    <div className="flex justify-between items-start mb-1">
      <h4 className="font-medium text-gray-800">{title}</h4>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
    <p className="text-sm text-gray-600">{message}</p>
  </motion.div>
);

export default function AdminDashboard() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState({
    userId: "",
    roles: [] as string[],
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Remove the authentication transition flag if it exists
    // This ensures normal auth behavior is restored after successful login
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("isAuthenticating")
    ) {
      console.log("Clearing authentication transition flag on admin dashboard");
      sessionStorage.removeItem("isAuthenticating");
    }

    // Get authentication information
    const userId = localStorage.getItem("userId") || "";
    const roles = adminAuthService.getUserRoles();
    const isAuthenticated = adminAuthService.isAuthenticated();

    setUserInfo({
      userId,
      roles,
      isAuthenticated,
    });

    setIsLoading(false);

    // If not authenticated at this point, redirect to login
    if (!isAuthenticated && typeof window !== "undefined") {
      console.log("Not authenticated on dashboard, redirecting to login");
      router.replace("/admin/login");
    }
  }, [router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-700 font-medium rtl text-lg"
          >
            در حال بارگذاری داشبورد...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 p-6 rtl"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-gray-200">
        <motion.h1
          variants={itemVariants}
          className="text-3xl font-bold text-gray-800 pr-2 border-r-4 border-primary"
        >
          داشبورد مدیریت
        </motion.h1>

        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <FaBell className="text-gray-600 w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <FaEnvelope className="text-gray-600 w-5 h-5" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <FaCog className="text-gray-600 w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-3 bg-white py-2 px-4 rounded-full shadow border border-gray-100">
            <div className="w-8 h-8 text-white">
              <FaUserShield className="w-full h-full text-primary" />
            </div>
            <span className="font-medium text-gray-700">مدیر سیستم</span>
          </div>
        </motion.div>
      </div>

      {/* Summary stats */}
      <motion.div variants={itemVariants}>
        <DashboardStats />
      </motion.div>

      {/* Quick Access Cards */}
      <motion.section variants={itemVariants} className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            <FaList className="ml-2 text-primary" />
            بخش‌های اصلی مدیریت
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminCard
            title="مدیریت کاربران"
            description="مدیریت کاربران، دسترسی‌ها و نقش‌ها"
            icon={FaUsers}
            href="/admin/users"
            color="primary"
            count={215}
            delay={0}
          />

          <AdminCard
            title="مدیریت مناطق"
            description="مدیریت کشورها، استان‌ها، شهرها و مناطق"
            icon={FaGlobe}
            href="/admin/regions"
            color="info"
            count={184}
            delay={0.1}
          />

          <AdminCard
            title="دسته‌بندی‌ها"
            description="مدیریت دسته‌بندی‌های ملک و آگهی"
            icon={FaLayerGroup}
            href="/admin/categories"
            color="success"
            count={42}
            delay={0.2}
          />

          <AdminCard
            title="انواع کاربری"
            description="مدیریت انواع کاربری املاک"
            icon={FaBuilding}
            href="/admin/fields_type"
            color="secondary"
            count={26}
            delay={0.3}
          />
        </div>
      </motion.section>

      {/* Recent Activity and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-6 py-4 text-white">
            <h3 className="text-xl font-bold flex items-center">
              <FaChartBar className="ml-2" />
              فعالیت‌های اخیر
            </h3>
          </div>

          <div className="p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex relative">
                <div className="mr-4 ml-8">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                    <FaUsers className="text-white" />
                  </div>
                  <div className="absolute top-8 bottom-0 right-4 w-0.5 bg-gray-200"></div>
                </div>
                <div className="flex-1 border-b border-gray-100 pb-4">
                  <h4 className="font-medium text-gray-800">
                    افزودن کاربر جدید
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    کاربر جدید «علی محمدی» با دسترسی «مشاور» اضافه شد
                  </p>
                  <span className="block text-xs text-gray-500 mt-2">
                    ۱۰ دقیقه پیش
                  </span>
                </div>
              </div>

              <div className="flex relative">
                <div className="mr-4 ml-8">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <FaGlobe className="text-white" />
                  </div>
                  <div className="absolute top-8 bottom-0 right-4 w-0.5 bg-gray-200"></div>
                </div>
                <div className="flex-1 border-b border-gray-100 pb-4">
                  <h4 className="font-medium text-gray-800">بروزرسانی منطقه</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    منطقه «ولنجک» در شهر «تهران» بروزرسانی شد
                  </p>
                  <span className="block text-xs text-gray-500 mt-2">
                    ۴۵ دقیقه پیش
                  </span>
                </div>
              </div>

              <div className="flex relative">
                <div className="mr-4 ml-8">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <FaLayerGroup className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">
                    افزودن دسته‌بندی
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    دسته‌بندی جدید «ویلایی لوکس» با مشخصات کامل اضافه شد
                  </p>
                  <span className="block text-xs text-gray-500 mt-2">
                    ۳ ساعت پیش
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6"
            >
              <Link
                href="/admin/activity-log"
                className="flex items-center justify-center p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors gap-1.5"
              >
                مشاهده همه فعالیت‌ها
                <FaArrowRight />
              </Link>
            </motion.div>
          </div>
        </motion.section>

        {/* Notifications */}
        <motion.section
          variants={itemVariants}
          className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-4 text-white">
            <h3 className="text-xl font-bold flex items-center">
              <FaBell className="ml-2" />
              اعلان‌های سیستم
            </h3>
          </div>

          <div className="divide-y divide-gray-100">
            <NotificationItem
              title="درخواست تایید آگهی جدید"
              message="۳ آگهی جدید نیاز به تایید شما دارند"
              time="۱۵ دقیقه پیش"
              isNew={true}
            />

            <NotificationItem
              title="گزارش عملکرد هفتگی"
              message="گزارش عملکرد هفتگی سیستم آماده مشاهده است"
              time="۴ ساعت پیش"
              isNew={true}
            />

            <NotificationItem
              title="بروزرسانی سیستم"
              message="نسخه جدید سیستم با موفقیت نصب شد"
              time="۱ روز پیش"
            />

            <NotificationItem
              title="پیام پشتیبانی جدید"
              message="یک پیام جدید از کاربر 'حسین رضایی' دریافت شده است"
              time="۲ روز پیش"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-4"
          >
            <Link
              href="/admin/notifications"
              className="flex items-center justify-center p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md font-medium transition-colors gap-1.5"
            >
              مشاهده همه اعلان‌ها
              <FaArrowRight />
            </Link>
          </motion.div>
        </motion.section>
      </div>

      {/* Upcoming Events */}
      <motion.section
        variants={itemVariants}
        className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-orange-400 to-pink-500 px-6 py-4 text-white">
          <h3 className="text-xl font-bold flex items-center">
            <FaCalendarAlt className="ml-2" />
            رویدادهای پیش رو
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-b from-orange-50 to-white rounded-xl p-5 border border-orange-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="text-orange-500" />
                </div>
                <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                  امروز
                </span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">
                جلسه بررسی عملکرد
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                بررسی گزارش‌های ماهانه و برنامه‌ریزی استراتژی‌های جدید
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <span>۱۶:۰۰ - ۱۷:۳۰</span>
                <span className="mx-2">•</span>
                <span>اتاق جلسات اصلی</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-b from-blue-50 to-white rounded-xl p-5 border border-blue-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="text-blue-500" />
                </div>
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  فردا
                </span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">آموزش کارکنان</h4>
              <p className="text-sm text-gray-600 mb-3">
                دوره آموزشی آشنایی با امکانات جدید سیستم برای کارمندان
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <span>۱۰:۰۰ - ۱۲:۰۰</span>
                <span className="mx-2">•</span>
                <span>سالن آموزش</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-gradient-to-b from-purple-50 to-white rounded-xl p-5 border border-purple-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaCalendarAlt className="text-purple-500" />
                </div>
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  ۳ روز دیگر
                </span>
              </div>
              <h4 className="font-bold text-gray-800 mb-2">انتشار بروزرسانی</h4>
              <p className="text-sm text-gray-600 mb-3">
                انتشار نسخه جدید سیستم با امکانات و بهبودهای جدید
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <span>۰۹:۰۰</span>
                <span className="mx-2">•</span>
                <span>اتوماتیک</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <Link
              href="/admin/calendar"
              className="flex items-center justify-center p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-medium transition-colors gap-1.5"
            >
              مشاهده تقویم رویدادها
              <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
}
