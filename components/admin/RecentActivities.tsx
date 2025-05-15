"use client";

import { FaClock, FaCheck, FaBan, FaUser } from "react-icons/fa";
import Avatar from "./ui/Avatar";
import { Divider } from "@heroui/react";
import recentActivities, { ActivityStatus } from "./data/activities";

export default function RecentActivities() {
  const getStatusIcon = (status: ActivityStatus) => {
    switch (status) {
      case "success":
        return <FaCheck className="text-button" />;
      case "warning":
        return <FaClock className="text-secondary-bronze" />;
      case "danger":
        return <FaBan className="text-error" />;
      case "info":
        return <FaUser className="text-primary" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="p-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">فعالیت‌های اخیر</h2>
        <button className="text-primary text-sm hover:underline">
          مشاهده همه
        </button>
      </div>

      <Divider />

      <div className="p-2">
        {recentActivities.map((activity) => (
          <div
            key={activity.id}
            className="p-3 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div className="flex items-center">
              <Avatar
                src={activity.user.avatar}
                name={activity.user.name}
                size="sm"
                className="ml-3"
              />

              <div className="flex-1">
                <div className="flex items-center">
                  <p className="font-medium text-sm">{activity.user.name}</p>
                  <span className="mx-2 text-gray-400">•</span>
                  <p className="text-sm text-gray-500">{activity.title}</p>
                </div>
                <div className="flex items-center mt-1">
                  <FaClock className="text-gray-400 text-xs ml-1" />
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              </div>

              <div className="flex-shrink-0">
                {getStatusIcon(activity.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
