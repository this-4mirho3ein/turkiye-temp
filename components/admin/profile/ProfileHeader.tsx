"use client";

import React from "react";
import { UserProfile } from "./types";
import { User, Shield, CheckCircle, XCircle, Calendar } from "lucide-react";
import Badge from "./Badge";
import Card, { CardBody } from "@/components/admin/ui/Card";

interface ProfileHeaderProps {
  profile: UserProfile;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (isActive: boolean, isBanned: boolean) => {
    if (isBanned) return "destructive";
    if (isActive) return "default";
    return "secondary";
  };

  const getStatusText = (isActive: boolean, isBanned: boolean) => {
    if (isBanned) return "مسدود شده";
    if (isActive) return "فعال";
    return "غیرفعال";
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "customer":
        return "default";
      default:
        return "secondary";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "admin":
        return "مدیر";
      case "customer":
        return "مشتری";
      default:
        return role;
    }
  };

  return (
    <Card className="w-full">
      <CardBody className="p-6">
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
          {/* Avatar Section */}
          <div className="flex-shrink-0">
            <div className="relative">
              {profile.icon ? (
                <img
                  src={profile.icon}
                  alt="پروفایل کاربر"
                  className="object-cover w-24 h-24 border-4 border-gray-200 rounded-full lg:w-32 lg:h-32"
                />
              ) : (
                <div className="flex items-center justify-center w-24 h-24 border-4 border-gray-200 rounded-full lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-purple-600">
                  <User className="w-12 h-12 text-white lg:w-16 lg:h-16" />
                </div>
              )}
              {/* Status Indicator */}
              <div className="absolute -bottom-2 -right-2">
                {profile.isActive && !profile.isBanned ? (
                  <CheckCircle className="w-8 h-8 text-green-500 bg-white rounded-full" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500 bg-white rounded-full" />
                )}
              </div>
            </div>
          </div>

          {/* User Info Section */}
          <div className="flex-1 min-w-0">
            <div className="space-y-4">
              {/* Name and Basic Info */}
              <div className="text-right">
                <h1 className="mb-2 text-2xl font-bold text-gray-900 lg:text-3xl">
                  {profile.firstName && profile.lastName
                    ? `${profile.firstName} ${profile.lastName}`
                    : "کاربر بدون نام"}
                </h1>
                <div className="flex flex-col items-start gap-1 text-sm text-right text-gray-600">
                  <span className="flex flex-row-reverse items-center gap-1">
                    📱 {profile.phone} {profile.countryCode}+
                  </span>
                  {profile.email && (
                    <span className="flex flex-row-reverse items-center gap-1">
                      📧 {profile.email}
                    </span>
                  )}
                </div>
              </div>

              {/* Status and Roles */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={getStatusColor(profile.isActive, profile.isBanned)}
                  className="flex items-center gap-1"
                >
                  {profile.isActive && !profile.isBanned ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <XCircle className="w-3 h-3" />
                  )}
                  {getStatusText(profile.isActive, profile.isBanned)}
                </Badge>

                {profile.roles.map((role, index) => (
                  <Badge
                    key={index}
                    variant={getRoleColor(role)}
                    className="flex items-center gap-1"
                  >
                    <Shield className="w-3 h-3" />
                    {getRoleText(role)}
                  </Badge>
                ))}

                {profile.isProfileComplete && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    پروفایل کامل
                  </Badge>
                )}
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>عضویت: {formatDate(profile.createdAt)}</span>
                </div>
                {profile.birthDate && (
                  <div className="flex items-center gap-2 text-gray-600">
                    🎂 <span>تولد: {formatDate(profile.birthDate)}</span>
                  </div>
                )}
                {profile.nationalCode && (
                  <div className="flex items-center gap-2 text-gray-600">
                    🆔 <span>کد ملی: {profile.nationalCode}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProfileHeader;
