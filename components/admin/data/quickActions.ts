import {
  FaPlusCircle,
  FaUserPlus,
  FaBuilding,
  FaFileExport,
} from "react-icons/fa";

export interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  buttonText: string;
  color: "primary" | "secondary" | "success" | "warning" | "danger";
}

const quickActions: QuickAction[] = [
  {
    title: "ثبت آگهی جدید",
    description: "افزودن یک ملک جدید به سیستم",
    icon: FaPlusCircle,
    buttonText: "افزودن ملک",
    color: "primary",
  },
  {
    title: "افزودن کاربر",
    description: "ثبت کاربر جدید در سیستم",
    icon: FaUserPlus,
    buttonText: "افزودن کاربر",
    color: "secondary",
  },
  {
    title: "افزودن آژانس",
    description: "ثبت آژانس جدید در سیستم",
    icon: FaBuilding,
    buttonText: "افزودن آژانس",
    color: "success",
  },
  {
    title: "خروجی گزارش",
    description: "ایجاد گزارش از داده‌های سیستم",
    icon: FaFileExport,
    buttonText: "ایجاد گزارش",
    color: "warning",
  },
];

export default quickActions;
