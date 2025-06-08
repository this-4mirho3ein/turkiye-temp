"use client";

import React from "react";
import { UserProfile } from "./types";
import { Activity, Users, Clock, Shield } from "lucide-react";
import Card, { CardBody, CardHeader } from "@/components/admin/ui/Card";

interface ProfileStatsProps {
  profile: UserProfile;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ profile }) => {
  const stats = [
    {
      title: "جلسات فعال",
      value: profile.activeSessions.length,
      icon: Activity,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "جلسه‌های فعال کاربر",
    },
    {
      title: "تاریخچه ورود",
      value: profile.loginHistory.length,
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "تعداد ورودهای ثبت شده",
    },
    {
      title: "سهمیه آگهی",
      value: profile.adQuota,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "تعداد آگهی‌های باقی‌مانده",
    },
    {
      title: "نقش‌ها",
      value: profile.roles.length,
      icon: Shield,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "تعداد نقش‌های کاربر",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="hover:shadow-lg transition-shadow duration-200"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardBody>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value.toLocaleString("fa-IR")}
            </div>
            <p className="text-xs text-gray-500">{stat.description}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default ProfileStats;
