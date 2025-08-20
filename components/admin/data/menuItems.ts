import {
  FaHome,
  FaBuilding,
  FaUsers,
  FaUserTie,
  FaCog,
  FaChartBar,
  FaComments,
  FaMapMarkerAlt,
  FaTag,
  FaLayerGroup,
  FaCheckCircle,
  FaFilter,
  FaMoneyBill,
  FaAd,
} from "react-icons/fa";

export interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

const mainMenuItems: MenuItem[] = [
  { name: "داشبورد", href: "/admin", icon: FaHome },
  // { name: "املاک", href: "/admin/properties", icon: FaBuilding },
  { name: "کاربران", href: "/admin/users", icon: FaUsers },
  { name: "آژانس‌ها", href: "/admin/agencies", icon: FaUserTie },
  { name: "آگهی‌ها", href: "/admin/ads", icon: FaAd },
  { name: "درخواست‌های پروفایل آژانس", href: "/admin/agency-updates", icon: FaCheckCircle },
  { name: "تأییدیه‌ها", href: "/admin/verifications", icon: FaCheckCircle },
  { name: "نوع کاربری", href: "/admin/fields_type", icon: FaTag },
  { name: "دسته‌بندی‌ها", href: "/admin/categories", icon: FaLayerGroup },
  { name: "مناطق", href: "/admin/regions", icon: FaMapMarkerAlt },
  { name: "فیلترها", href: "/admin/filters", icon: FaFilter },
  { name: "آمار و گزارشات", href: "/admin/reports", icon: FaChartBar },
  { name: "پلن ها", href: "/admin/plans", icon: FaMoneyBill },
  // { name: "پیام‌ها", href: "/admin/messages", icon: FaComments },
];

export default mainMenuItems;
