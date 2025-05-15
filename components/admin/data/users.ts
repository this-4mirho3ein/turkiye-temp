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

// Mock users data
const users: User[] = [
  {
    id: 1,
    name: "امیرحسین محمدی",
    email: "amir@example.com",
    phone: "09123456789",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "admin",
    status: "active",
    lastLogin: "۳ ساعت پیش",
    createdAt: "۱۴۰۲/۰۳/۱۵",
  },
  {
    id: 2,
    name: "سارا احمدی",
    email: "sara@example.com",
    phone: "09123456788",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    role: "agency",
    status: "active",
    lastLogin: "۱ روز پیش",
    createdAt: "۱۴۰۲/۰۲/۱۰",
  },
  {
    id: 3,
    name: "محمد رضایی",
    email: "mohammad@example.com",
    phone: "09123456787",
    role: "consultant",
    status: "active",
    lastLogin: "۲ ساعت پیش",
    createdAt: "۱۴۰۲/۰۱/۲۰",
  },
  {
    id: 4,
    name: "نازنین کریمی",
    email: "nazanin@example.com",
    phone: "09123456786",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    role: "normal",
    status: "active",
    lastLogin: "۲ روز پیش",
    createdAt: "۱۴۰۱/۱۲/۱۵",
  },
  {
    id: 5,
    name: "علی حسینی",
    email: "ali@example.com",
    phone: "09123456785",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    role: "normal",
    status: "inactive",
    lastLogin: "۱ هفته پیش",
    createdAt: "۱۴۰۱/۱۱/۰۵",
  },
  {
    id: 6,
    name: "مریم طاهری",
    email: "maryam@example.com",
    phone: "09123456784",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    role: "consultant",
    status: "active",
    lastLogin: "۴ ساعت پیش",
    createdAt: "۱۴۰۱/۱۰/۲۵",
  },
  {
    id: 7,
    name: "رضا فرهادی",
    email: "reza@example.com",
    phone: "09123456783",
    role: "normal",
    status: "banned",
    createdAt: "۱۴۰۱/۰۹/۱۸",
  },
  {
    id: 8,
    name: "زهرا نوری",
    email: "zahra@example.com",
    phone: "09123456782",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    role: "normal",
    status: "active",
    lastLogin: "۱۲ ساعت پیش",
    createdAt: "۱۴۰۱/۰۸/۰۷",
  },
  {
    id: 9,
    name: "سعید جعفری",
    email: "saeed@example.com",
    phone: "09123456781",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    role: "agency",
    status: "active",
    lastLogin: "۵ ساعت پیش",
    createdAt: "۱۴۰۱/۰۷/۱۵",
  },
  {
    id: 10,
    name: "فاطمه محمودی",
    email: "fateme@example.com",
    phone: "09123456780",
    role: "normal",
    status: "active",
    lastLogin: "۳ روز پیش",
    createdAt: "۱۴۰۱/۰۶/۲۸",
  },
];

export default users;
