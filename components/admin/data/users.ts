export type UserRole = "admin" | "agency" | "consultant" | "normal";

export interface Role {
  id: UserRole;
  name: string;
  description: string;
}

export interface RoleGroup {
  id: string;
  name: string;
  roles: Role[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: UserRole;
  status: "active" | "inactive" | "banned";
  lastLogin?: string;
  createdAt: string;
  originalId?: string; // Original ID from API for reference
  isDeleted?: boolean; // Flag to indicate if the user is deleted
  displayMobile?: boolean; // Whether to display the mobile number
  displayEmail?: boolean; // Whether to display the email
}

// Define role groups (without icon components)
export const roleGroups: RoleGroup[] = [
  {
    id: "management",
    name: "مدیریت و آژانس",
    roles: [
      {
        id: "admin",
        name: "مدیر",
        description: "دسترسی کامل به تمام قسمت‌های سیستم",
      },
      {
        id: "agency",
        name: "آژانس",
        description: "مدیریت آگهی‌ها و مشاوران",
      },
      {
        id: "consultant",
        name: "مشاور",
        description: "ثبت و مدیریت آگهی‌ها",
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
      },
    ],
  },
];

// Empty array of users (removed mock data)
const users: User[] = [];

export default users;
