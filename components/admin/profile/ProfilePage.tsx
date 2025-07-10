"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "./types";
import { getCurrentUserProfile } from "@/controllers/makeRequest";
import ProfileHeader from "./ProfileHeader";
import ActiveSessions from "./ActiveSessions";
import LoginHistory from "./LoginHistory";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import Button from "@/components/admin/ui/Button";

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user ID from localStorage (stored during login)
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("شناسه کاربر یافت نشد. لطفاً دوباره وارد شوید.");
        return;
      }


      const response = await getCurrentUserProfile(userId);

      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setError(response.message || "خطا در دریافت اطلاعات پروفایل");
      }
    } catch (err: any) {

      setError("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleRefresh = () => {
    fetchProfile();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 text-blue-600 animate-spin" />
          <p className="text-gray-600">در حال بارگذاری اطلاعات پروفایل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
          <Button
            onPress={handleRefresh}
            className="w-full"
            variant="bordered"
            color="danger"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">اطلاعات پروفایل یافت نشد</p>
          <Button onPress={handleRefresh} className="mt-4" variant="bordered">
            <RefreshCw className="w-4 h-4 mr-2" />
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50 lg:p-6">
      <div className="mx-auto space-y-6 max-w-7xl">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">
              پروفایل کاربری
            </h1>
            <p className="mt-1 text-gray-600">
              مشاهده و مدیریت اطلاعات حساب کاربری
            </p>
          </div>
          <Button
            onPress={handleRefresh}
            variant="bordered"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            به‌روزرسانی
          </Button>
        </div>

        {/* Profile Header */}
        <ProfileHeader profile={profile} />

        {/* Sessions and History Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ActiveSessions
            sessions={profile.activeSessions}
            onRefresh={fetchProfile}
          />
          <LoginHistory loginHistory={profile.loginHistory} />
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="p-6 bg-white border rounded-lg">
            <h3 className="mb-4 font-semibold text-gray-900">
              تنظیمات حریم خصوصی
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">نمایش شماره تلفن</span>
                <span
                  className={`text-sm font-medium ${
                    profile.isPhoneShow ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {profile.isPhoneShow ? "فعال" : "غیرفعال"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">نمایش ایمیل</span>
                <span
                  className={`text-sm font-medium ${
                    profile.isEmailShow ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {profile.isEmailShow ? "فعال" : "غیرفعال"}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border rounded-lg">
            <h3 className="mb-4 font-semibold text-gray-900">اطلاعات حساب</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">وضعیت حساب</span>
                <span
                  className={`text-sm font-medium ${
                    profile.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {profile.isActive ? "فعال" : "غیرفعال"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">تکمیل پروفایل</span>
                <span
                  className={`text-sm font-medium ${
                    profile.isProfileComplete
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  {profile.isProfileComplete ? "کامل" : "ناقص"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
