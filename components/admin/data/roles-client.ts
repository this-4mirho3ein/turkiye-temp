"use client";

import { FaUser, FaUserTie, FaUserCog, FaUserAlt } from "react-icons/fa";
import { UserRole } from "./users";

export interface RoleDefinition {
  id: UserRole;
  name: string;
  description: string;
  icon: React.ElementType;
}

export interface RoleGroupDefinition {
  id: string;
  name: string;
  roles: RoleDefinition[];
}

// Define role groups with icon components
export const roleGroupsWithIcons: RoleGroupDefinition[] = [
  {
    id: "management",
    name: "مدیریت و آژانس",
    roles: [
      {
        id: "admin",
        name: "مدیر",
        description: "دسترسی کامل به تمام قسمت‌های سیستم",
        icon: FaUserCog,
      },
      {
        id: "agency",
        name: "آژانس",
        description: "مدیریت آگهی‌ها و مشاوران",
        icon: FaUserTie,
      },
      {
        id: "consultant",
        name: "مشاور",
        description: "ثبت و مدیریت آگهی‌ها",
        icon: FaUserAlt,
      },
    ],
  },
  {
    id: "regular",
    name: "عادی",
    roles: [
      {
        id: "normal",
        name: "کاربر عادی",
        description: "دسترسی به امکانات عمومی سایت",
        icon: FaUser,
      },
    ],
  },
];

// Helper function to get role data by id
export function getRoleById(roleId: UserRole): RoleDefinition | undefined {
  for (const group of roleGroupsWithIcons) {
    const role = group.roles.find((r) => r.id === roleId);
    if (role) return role;
  }
  return undefined;
}
