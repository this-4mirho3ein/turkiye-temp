"use client";

import { FaCheckCircle, FaTimesCircle, FaBan } from "react-icons/fa";

interface UserStatusBadgeProps {
  status: "active" | "inactive" | "banned";
}

export default function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const statusConfig = {
    active: {
      color: "bg-green-100 text-green-800",
      icon: <FaCheckCircle className="text-green-600 ml-1" />,
      label: "فعال",
    },
    inactive: {
      color: "bg-gray-100 text-gray-800",
      icon: <FaTimesCircle className="text-gray-600 ml-1" />,
      label: "غیرفعال",
    },
    banned: {
      color: "bg-red-100 text-red-800",
      icon: <FaBan className="text-red-600 ml-1" />,
      label: "مسدود",
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {config.label}
    </div>
  );
}
