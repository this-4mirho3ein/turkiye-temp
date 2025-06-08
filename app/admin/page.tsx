"use client";

import { useEffect, useState } from "react";
import adminAuthService from "@/components/admin/login/services/authService";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaUsers,
  FaGlobe,
  FaLayerGroup,
  FaList,
  FaBuilding,
  FaFilter,
  FaCheckCircle,
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
    y: -4,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
};

interface AdminCardProps {
  title: string;
  description: string;
  icon: IconType;
  href: string;
  color: string;
}

const AdminCard = ({
  title,
  description,
  icon: Icon,
  href,
  color,
}: AdminCardProps) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className="col-span-1"
    >
      <Link href={href}>
        <div className="h-full overflow-hidden transition-all duration-300 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-300">
          <div className={`p-6 ${color}`}>
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-lg bg-white/20">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="mt-4 mb-2 text-lg font-semibold text-white">
              {title}
            </h3>
            <p className="text-sm text-white/90">{description}</p>
          </div>
          <div className="px-6 py-4">
            <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
              مدیریت →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg font-medium text-gray-700"
          >
            در حال بارگذاری...
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
      className="p-6 space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          داشبورد مدیریت
        </h1>
        <p className="text-gray-600">مدیریت سیستم املاک و مسکن</p>
      </motion.div>

      {/* Main Navigation Cards */}
      <motion.section variants={itemVariants} className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AdminCard
            title="مدیریت کاربران"
            description="مدیریت کاربران، نقش‌ها و دسترسی‌ها"
            icon={FaUsers}
            href="/admin/users"
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />

          <AdminCard
            title="مدیریت مناطق"
            description="کشورها، استان‌ها، شهرها و مناطق"
            icon={FaGlobe}
            href="/admin/regions"
            color="bg-gradient-to-br from-green-500 to-green-600"
          />

          <AdminCard
            title="دسته‌بندی‌ها"
            description="مدیریت دسته‌بندی‌های املاک"
            icon={FaLayerGroup}
            href="/admin/categories"
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />

          <AdminCard
            title="انواع کاربری"
            description="مدیریت انواع کاربری املاک"
            icon={FaBuilding}
            href="/admin/fields_type"
            color="bg-gradient-to-br from-orange-500 to-orange-600"
          />

          <AdminCard
            title="فیلترها"
            description="مدیریت فیلترهای جستجو"
            icon={FaFilter}
            href="/admin/filters"
            color="bg-gradient-to-br from-indigo-500 to-indigo-600"
          />

          <AdminCard
            title="آژانس‌ها"
            description="مدیریت آژانس‌های املاک"
            icon={FaList}
            href="/admin/agencies"
            color="bg-gradient-to-br from-teal-500 to-teal-600"
          />

          <AdminCard
            title="تأییدیه‌ها"
            description="بررسی و تأیید آژانس‌ها"
            icon={FaCheckCircle}
            href="/admin/verifications"
            color="bg-gradient-to-br from-rose-500 to-rose-600"
          />
        </div>
      </motion.section>
    </motion.div>
  );
}
