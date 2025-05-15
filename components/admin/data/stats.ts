import {
  FaBuilding,
  FaUsers,
  FaUserTie,
  FaEye,
  FaClipboardCheck,
} from "react-icons/fa";

export interface StatItem {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
  color: "primary" | "secondary" | "success" | "warning" | "danger";
}

const stats: StatItem[] = [
  {
    title: "کل املاک",
    value: "۳,۵۶۴",
    change: "+۱۲%",
    trend: "up",
    icon: FaBuilding,
    color: "primary",
  },
  {
    title: "کل کاربران",
    value: "۸,۵۲۱",
    change: "+۸%",
    trend: "up",
    icon: FaUsers,
    color: "secondary",
  },
  {
    title: "آژانس‌ها",
    value: "۱۲۳",
    change: "+۵%",
    trend: "up",
    icon: FaUserTie,
    color: "success",
  },
  {
    title: "بازدیدها",
    value: "۲۲,۹۸۰",
    change: "+۱۵%",
    trend: "up",
    icon: FaEye,
    color: "warning",
  },
  {
    title: "معاملات",
    value: "۵۶",
    change: "-۲%",
    trend: "down",
    icon: FaClipboardCheck,
    color: "danger",
  },
];

export default stats;
