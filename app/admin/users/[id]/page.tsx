"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  Smartphone,
  Mail,
  Phone,
  Map,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Shield,
  Activity,
  MapPin,
  Eye,
  UserPlus,
  History,
  LogIn,
  Layers,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Card, { CardBody, CardHeader } from "@/components/admin/ui/Card";
import Button from "@/components/admin/ui/Button";
import Avatar from "@/components/admin/ui/Avatar";
import { addToast } from "@heroui/react";
import { formatDistanceToNow } from "date-fns-jalali";
import { getAdminUserById } from "@/controllers/makeRequest";
import { motion } from "framer-motion";
import { useToast } from "@/components/admin/ui/ToastProvider";
import AdminLoading from "@/components/admin/ui/AdminLoading";

interface UserData {
  _id: string;
  phone: string;
  countryCode: string;
  roles: string[];
  adQuota: number;
  isActive: boolean;
  isBanned: boolean;
  isCompleteProfile: boolean;
  devices: any[];
  isDeleted: boolean;
  activeSessions: {
    sessionId: string;
    device: string;
    ip: string;
    loginTime: string;
    _id: string;
  }[];
  loginHistory: {
    ip: string;
    device: string;
    lastLogin: string;
    _id: string;
  }[];
  createdAt: string;
  updatedAt: string;
  birthDate?: string;
  email?: string;
  firstName?: string;
  gender?: string;
  lastName?: string;
  nationalCode?: string;
  lastLoginInfo?: {
    ip: string;
    device: string;
  };
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

export default function UserDetailsPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!id || typeof id !== "string") {
          throw new Error("شناسه کاربر نامعتبر است");
        }

        const response = await getAdminUserById(id);

        if (response.success && response.data) {
          setUserData(response.data);
          showToast({
            type: "success",
            title: "موفق",
            message: "اطلاعات کاربر با موفقیت دریافت شد",
          });
        } else {
          // Handle API success=false responses
          console.error(`📊 API returned error:`, response.message);
          throw new Error(response.message || "خطا در دریافت اطلاعات کاربر");
        }
      } catch (err) {
        console.error("📊 Error in component during fetch:", err);

        // Try to provide the most helpful error message possible
        let errorMessage = "خطا در دریافت اطلاعات کاربر";

        if (err instanceof Error) {
          errorMessage = err.message;
          console.error("📊 Error details:", err.stack);
        }

        setError(errorMessage);

        showToast({
          type: "error",
          title: "خطا",
          message: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id, showToast]);

  if (isLoading) {
    return (
      <AdminLoading
        type="user"
        message="لطفاً کمی صبر کنید، در حال دریافت اطلاعات کاربر..."
      />
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] grid place-items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md w-full bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-2xl p-8 text-center transition-all transform"
        >
          <div className="bg-red-100 text-red-600 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <XCircle className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-red-800">
            خطا در بارگذاری اطلاعات
          </h2>
          <p className="text-red-700 mb-6 opacity-80">{error}</p>
          <Button
            color="primary"
            size="lg"
            className="mt-2 px-8 w-full shadow-md hover:shadow-lg transition-all duration-300"
            href="/admin/users"
            as={Link}
          >
            <ArrowRight className="ml-2" />
            بازگشت به لیست کاربران
          </Button>
        </motion.div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-[70vh] grid place-items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md w-full bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-2xl p-8 text-center transition-all transform"
        >
          <div className="bg-amber-100 text-amber-600 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <Activity className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-amber-800">
            اطلاعات کاربر یافت نشد
          </h2>
          <p className="text-amber-700 mb-6 opacity-80">
            متأسفانه اطلاعات این کاربر در سیستم موجود نیست.
          </p>
          <Button
            color="primary"
            size="lg"
            className="mt-2 px-8 w-full shadow-md hover:shadow-lg transition-all duration-300"
            href="/admin/users"
            as={Link}
          >
            <ArrowRight className="ml-2" />
            بازگشت به لیست کاربران
          </Button>
        </motion.div>
      </div>
    );
  }

  // Prepare user name for display
  const fullName =
    userData.firstName && userData.lastName
      ? `${userData.firstName} ${userData.lastName}`
      : "کاربر";

  // Map role names to Persian
  const roleNames = {
    admin: "مدیر",
    agency: "آژانس",
    consultant: "مشاور",
    customer: "مشتری",
  };

  // Prepare role colors
  const roleColors = {
    admin: "bg-purple-100 text-purple-800",
    agency: "bg-blue-100 text-blue-800",
    consultant: "bg-teal-100 text-teal-800",
    customer: "bg-gray-100 text-gray-800",
  };

  // Get creation date
  const creationDate = new Date(userData.createdAt).toLocaleDateString("fa-IR");
  const lastLogin = userData.loginHistory[0]?.lastLogin
    ? formatDistanceToNow(new Date(userData.loginHistory[0].lastLogin), {
        addSuffix: true,
      })
    : "نامشخص";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6"
    >
      {/* Header with back button and gradient background */}
      <motion.div
        variants={fadeInUp}
        className="bg-gradient-to-l from-primary-50 via-indigo-50 to-white p-6 rounded-xl shadow-sm mb-8 flex items-center justify-between border border-indigo-100/60"
      >
        <div className="flex items-center">
          <Button
            color="secondary"
            variant="light"
            className="ml-4 hover:shadow-md transition-all hover:bg-gray-100"
            as={Link}
            href="/admin/users"
            startContent={<ArrowRight />}
          >
            بازگشت به لیست کاربران
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">
            جزئیات اطلاعات کاربر
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-lg font-mono">
            شناسه: {userData._id.substring(userData._id.length - 8)}
          </span>
        </div>
      </motion.div>

      {/* Profile Overview - Main Card */}
      <motion.div variants={itemVariants}>
        <Card
          shadow="sm"
          className="border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
        >
          <div className="bg-gradient-to-l from-blue-50 via-indigo-50 to-primary-50 py-3 px-6">
            <h2 className="text-lg font-bold text-gray-700 flex items-center">
              <User className="ml-2 text-primary-500" size={18} />
              مشخصات کاربر
            </h2>
          </div>

          <CardBody className="p-0">
            <div className="md:flex">
              {/* Profile Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full md:w-64 bg-gray-50 p-6 flex flex-col items-center md:border-l border-gray-100"
              >
                <div className="relative">
                  <Avatar
                    name={fullName}
                    size="lg"
                    className="mb-4 h-24 w-24 text-2xl font-bold shadow-md border-4 border-white"
                    src={undefined}
                  />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.5,
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                    }}
                    className={`absolute bottom-3 right-0 h-6 w-6 border-4 border-white rounded-full ${
                      userData.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></motion.div>
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {fullName}
                </h2>

                <div className="flex flex-wrap gap-2 justify-center my-3">
                  {userData.roles.map((role, index) => (
                    <motion.span
                      key={role}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        roleColors[role as keyof typeof roleColors] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <Shield className="ml-1 h-3 w-3" />
                      {roleNames[role as keyof typeof roleNames] || role}
                    </motion.span>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm text-gray-500 mt-1 flex items-center"
                >
                  <UserPlus className="ml-1 h-4 w-4 text-gray-400" />
                  عضویت: {creationDate}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-sm text-gray-500 mt-1 flex items-center"
                >
                  <Clock className="ml-1 h-4 w-4 text-gray-400" />
                  آخرین ورود: {lastLogin}
                </motion.div>

                <div className="w-full mt-6 pt-5 border-t border-gray-200">
                  <div className="space-y-3">
                    {userData.isDeleted ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-red-50 text-red-700 rounded-lg p-3 text-sm flex items-center shadow-sm"
                      >
                        <XCircle className="ml-2 h-5 w-5 text-red-500" />
                        <span>این حساب کاربری حذف شده است</span>
                      </motion.div>
                    ) : userData.isBanned ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-orange-50 text-orange-700 rounded-lg p-3 text-sm flex items-center shadow-sm"
                      >
                        <XCircle className="ml-2 h-5 w-5 text-orange-500" />
                        <span>این حساب کاربری مسدود شده است</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-green-50 text-green-700 rounded-lg p-3 text-sm flex items-center shadow-sm"
                      >
                        <CheckCircle className="ml-2 h-5 w-5 text-green-500" />
                        <span>حساب کاربری فعال</span>
                      </motion.div>
                    )}

                    {userData.isCompleteProfile ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-blue-50 text-blue-700 rounded-lg p-3 text-sm flex items-center shadow-sm"
                      >
                        <CheckCircle className="ml-2 h-5 w-5 text-blue-500" />
                        <span>پروفایل کامل شده</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="bg-amber-50 text-amber-700 rounded-lg p-3 text-sm flex items-center shadow-sm"
                      >
                        <Activity className="ml-2 h-5 w-5 text-amber-500" />
                        <span>پروفایل ناقص</span>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Profile Main Info */}
              <div className="flex-1 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Personal Information */}
                  <motion.div variants={itemVariants} className="space-y-6">
                    <div className="border-b border-gray-200 pb-2 mb-4">
                      <h3 className="text-md font-bold text-gray-700 flex items-center">
                        <User className="ml-2 text-primary-500" size={16} />
                        اطلاعات شخصی
                      </h3>
                    </div>

                    <div className="space-y-4" dir="rtl">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center ml-3 group-hover:bg-indigo-100 transition-colors">
                          <Phone className="h-4 w-4 text-indigo-500" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">
                            شماره تلفن
                          </div>
                          <div className="text-sm font-medium">
                            {userData.countryCode} {userData.phone}
                          </div>
                        </div>
                      </motion.div>

                      {userData.email && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="flex group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center ml-3 group-hover:bg-blue-100 transition-colors">
                            <Mail className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">
                              ایمیل
                            </div>
                            <div className="text-sm font-medium">
                              {userData.email}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {userData.birthDate && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="flex group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center ml-3 group-hover:bg-green-100 transition-colors">
                            <Calendar className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">
                              تاریخ تولد
                            </div>
                            <div className="text-sm font-medium">
                              {new Date(userData.birthDate).toLocaleDateString(
                                "fa-IR"
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {userData.gender && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="flex group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center ml-3 group-hover:bg-purple-100 transition-colors">
                            <User className="h-4 w-4 text-purple-500" />
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">
                              جنسیت
                            </div>
                            <div className="text-sm font-medium">
                              {userData.gender === "male" ? "مرد" : "زن"}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Additional Information */}
                  <motion.div variants={itemVariants} className="space-y-6">
                    <div className="border-b border-gray-200 pb-2 mb-4">
                      <h3 className="text-md font-bold text-gray-700 flex items-center">
                        <Layers className="ml-2 text-primary-500" size={16} />
                        اطلاعات اضافی
                      </h3>
                    </div>

                    <div className="space-y-4" dir="rtl">
                      {userData.nationalCode && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="flex group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center ml-3 group-hover:bg-amber-100 transition-colors">
                            <MapPin className="h-4 w-4 text-amber-500" />
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500 mb-1">
                              کد ملی
                            </div>
                            <div className="text-sm font-medium">
                              {userData.nationalCode}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center ml-3 group-hover:bg-red-100 transition-colors">
                          <Eye className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">
                            تعداد دستگاه‌های فعال
                          </div>
                          <div className="text-sm font-medium">
                            {userData.activeSessions.length} دستگاه
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center ml-3 group-hover:bg-teal-100 transition-colors">
                          <History className="h-4 w-4 text-teal-500" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">
                            تعداد ورودها
                          </div>
                          <div className="text-sm font-medium">
                            {userData.loginHistory.length} بار
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex group hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center ml-3 group-hover:bg-cyan-100 transition-colors">
                          <Zap className="h-4 w-4 text-cyan-500" />
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 mb-1">
                            سهمیه تبلیغات
                          </div>
                          <div className="text-sm font-medium">
                            {userData.adQuota} عدد
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Active Devices List */}
      <motion.div variants={itemVariants}>
        <Card
          shadow="sm"
          className="border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
        >
          <div className="bg-gradient-to-l from-red-50 via-orange-50 to-amber-50 py-3 px-6">
            <h2 className="text-lg font-bold text-gray-700 flex items-center">
              <Smartphone className="ml-2 text-red-500" size={18} />
              دستگاه‌های فعال
            </h2>
          </div>

          <CardBody>
            {userData.activeSessions.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                هیچ دستگاه فعالی یافت نشد
              </div>
            ) : (
              <div className="space-y-4 p-2">
                {userData.activeSessions.map((session) => (
                  <motion.div
                    key={session._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-between border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    dir="rtl"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center ml-4">
                        <Smartphone className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {session.device}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {session.ip}
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-gray-500">زمان ورود</div>
                      <div className="text-sm">
                        {new Date(session.loginTime).toLocaleDateString(
                          "fa-IR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>

      {/* Login History List */}
      <motion.div variants={itemVariants}>
        <Card
          shadow="sm"
          className="border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
        >
          <div className="bg-gradient-to-l from-teal-50 via-cyan-50 to-blue-50 py-3 px-6">
            <h2 className="text-lg font-bold text-gray-700 flex items-center">
              <History className="ml-2 text-teal-500" size={18} />
              تاریخچه ورود
            </h2>
          </div>

          <CardBody>
            {userData.loginHistory.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                هیچ سابقه ورودی یافت نشد
              </div>
            ) : (
              <div className="space-y-4 p-2">
                {userData.loginHistory.map((login, index) => (
                  <motion.div
                    key={login._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-between border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    dir="rtl"
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center ml-4">
                        <LogIn className="h-5 w-5 text-teal-500" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {login.device}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {login.ip}
                        </div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-gray-500">تاریخ ورود</div>
                      <div className="text-sm">
                        {new Date(login.lastLogin).toLocaleDateString("fa-IR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
    </motion.div>
  );
}
