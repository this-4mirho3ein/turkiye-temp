import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaUserTie,
  FaCog,
  FaChartBar,
  FaComments,
  FaMapMarkerAlt,
} from "react-icons/fa";

export interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const mainMenuItems: MenuItem[] = [
  { name: "داشبورد", href: "/admin", icon: FaHome },
  { name: "املاک", href: "/admin/properties", icon: FaBuilding },
  { name: "کاربران", href: "/admin/users", icon: FaUsers },
  { name: "آژانس‌ها", href: "/admin/agencies", icon: FaUserTie },
  { name: "مناطق", href: "/admin/regions", icon: FaMapMarkerAlt },
  { name: "آمار و گزارشات", href: "/admin/reports", icon: FaChartBar },
  { name: "پیام‌ها", href: "/admin/messages", icon: FaComments },
  { name: "تنظیمات", href: "/admin/settings", icon: FaCog },
];

export default mainMenuItems;
