"use client";

import { FaUserCog, FaUserTie, FaUserAlt, FaUser } from "react-icons/fa";
import { UserRole } from "../data/users";
import { getRoleById } from "../data/roles-client";

interface UserRoleBadgeProps {
  role: UserRole;
}

export default function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const roleConfig = {
    admin: {
      color: "bg-purple-100 text-purple-800",
      icon: <FaUserCog className="text-purple-600 ml-1" />,
      label: "مدیر",
    },
    agency: {
      color: "bg-blue-100 text-blue-800",
      icon: <FaUserTie className="text-blue-600 ml-1" />,
      label: "آژانس",
    },
    consultant: {
      color: "bg-indigo-100 text-indigo-800",
      icon: <FaUserAlt className="text-indigo-600 ml-1" />,
      label: "مشاور",
    },
    normal: {
      color: "bg-gray-100 text-gray-800",
      icon: <FaUser className="text-gray-600 ml-1" />,
      label: "کاربر عادی",
    },
  };

  const config = roleConfig[role];
  const roleData = getRoleById(role);

  return (
    <div
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.icon}
      {roleData?.name || config.label}
    </div>
  );
}
