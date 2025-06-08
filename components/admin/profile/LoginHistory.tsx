"use client";

import React from "react";
import { LoginHistoryItem } from "./types";
import { Clock, Smartphone, Monitor, Globe } from "lucide-react";
import Card, { CardBody, CardHeader } from "@/components/admin/ui/Card";
import Badge from "./Badge";

interface LoginHistoryProps {
  loginHistory: LoginHistoryItem[];
}

const LoginHistory: React.FC<LoginHistoryProps> = ({ loginHistory }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("fa-IR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return "نامشخص";
    }
  };

  const getDeviceIcon = (device: string | undefined) => {
    if (!device) return <Monitor className="w-3 h-3" />;
    const ua = device.toLowerCase();
    if (
      ua.includes("mobile") ||
      ua.includes("android") ||
      ua.includes("iphone")
    ) {
      return <Smartphone className="w-3 h-3" />;
    }
    return <Monitor className="w-3 h-3" />;
  };

  const getDeviceType = (device: string | undefined) => {
    if (!device) return "نامشخص";
    const ua = device.toLowerCase();
    if (
      ua.includes("mobile") ||
      ua.includes("android") ||
      ua.includes("iphone")
    ) {
      return "موبایل";
    }
    if (ua.includes("postman")) {
      return "API";
    }
    return "دسکتاپ";
  };

  return (
    <Card className="h-80">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-black">
            <Clock className="w-5 h-5" />
            تاریخچه ورود
          </h3>
          <Badge variant="secondary" className="px-2 py-1 text-sm">
            {loginHistory.length}
          </Badge>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col h-full p-4 pt-0">
        <div className="flex-1 pr-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {loginHistory.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <p className="text-sm">هیچ تاریخچه ورودی یافت نشد</p>
            </div>
          ) : (
            loginHistory.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-2 transition-colors bg-white border border-gray-100 rounded-lg dark:bg-white dark:border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-50"
              >
                <div className="flex items-center flex-1 min-w-0 gap-2">
                  <div className="flex-shrink-0">
                    {getDeviceIcon(item.device)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-black truncate">
                        {getDeviceType(item.device)}
                      </span>
                      <span className="text-xs text-gray-600 truncate">
                        {item.ip || "نامشخص"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-2 text-xs text-left text-gray-600">
                  {formatDate(item.lastLogin)}
                </div>
              </div>
            ))
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default LoginHistory;
