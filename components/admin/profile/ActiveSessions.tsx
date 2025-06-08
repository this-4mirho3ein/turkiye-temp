"use client";

import React from "react";
import { ActiveSession } from "./types";
import { Monitor, Smartphone, Globe, Clock } from "lucide-react";
import Card, { CardBody, CardHeader } from "@/components/admin/ui/Card";
import Badge from "./Badge";

interface ActiveSessionsProps {
  sessions: ActiveSession[];
}

const ActiveSessions: React.FC<ActiveSessionsProps> = ({ sessions }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeviceIcon = (device: string) => {
    if (
      device.toLowerCase().includes("mobile") ||
      device.toLowerCase().includes("android") ||
      device.toLowerCase().includes("iphone")
    ) {
      return Smartphone;
    }
    return Monitor;
  };

  const getDeviceType = (device: string) => {
    if (
      device.toLowerCase().includes("mobile") ||
      device.toLowerCase().includes("android") ||
      device.toLowerCase().includes("iphone")
    ) {
      return "موبایل";
    }
    if (device.toLowerCase().includes("postman")) {
      return "API";
    }
    return "دسکتاپ";
  };

  const getBrowserName = (device: string) => {
    if (device.includes("Chrome")) return "Chrome";
    if (device.includes("Firefox")) return "Firefox";
    if (device.includes("Safari")) return "Safari";
    if (device.includes("Edge")) return "Edge";
    if (device.includes("PostmanRuntime")) return "Postman";
    return "نامشخص";
  };

  const getTimeDifference = (dateString: string) => {
    const now = new Date();
    const activityTime = new Date(dateString);
    const diffInMinutes = Math.floor(
      (now.getTime() - activityTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "همین الان";
    if (diffInMinutes < 60) return `${diffInMinutes} دقیقه پیش`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ساعت پیش`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} روز پیش`;
  };

  return (
    <Card className="h-80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-black">
            <Globe className="w-5 h-5" />
            جلسات فعال
          </h3>
          <Badge variant="secondary" className="px-2 py-1 text-sm">
            {sessions.length}
          </Badge>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col h-full p-4 pt-0">
        <div className="flex-1 pr-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {sessions.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p className="text-sm">هیچ جلسه فعالی یافت نشد</p>
            </div>
          ) : (
            sessions.map((session, index) => {
              const DeviceIcon = getDeviceIcon(session.device);
              return (
                <div
                  key={session.sessionId}
                  className="flex items-center justify-between p-2 transition-colors bg-white border border-gray-100 rounded-lg dark:bg-white dark:border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-50"
                >
                  <div className="flex items-center flex-1 min-w-0 gap-2">
                    <div className="flex-shrink-0">
                      <DeviceIcon className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-black truncate">
                          {getDeviceType(session.device)}
                        </span>
                        <span className="text-xs text-gray-600 truncate">
                          {session.ip.replace("::ffff:", "")}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {getBrowserName(session.device)}
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-2 text-xs text-left text-gray-600">
                    {getTimeDifference(session.lastActivity)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ActiveSessions;
