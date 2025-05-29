"use client";

import { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/react";
import {
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaCog,
  FaTachometerAlt,
  FaHome,
  FaBuilding,
  FaUsers,
  FaChartBar,
  FaCrown,
  FaUserShield,
  FaUserCog,
  FaFilter,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "./ui/Avatar";
import Dropdown, {
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "./ui/Dropdown";
import { useAuth } from "@/contexts/AuthContext";
import adminAuthService from "@/components/admin/login/services/authService";
import { useToast } from "./ui/ToastProvider";
import { motion } from "framer-motion";

const navbarVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout: contextLogout, user } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogout = () => {
    try {
      // Use our admin auth service for logout
      adminAuthService.logout();

      // Also use context logout for backward compatibility
      contextLogout();

      // Show success toast
      showToast({
        message: "با موفقیت از سیستم خارج شدید",
        type: "success",
      });

      // Redirect to login page
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      showToast({
        message: "خطا در خروج از سیستم",
        type: "error",
      });
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={navbarVariants}>
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        maxWidth="full"
        shouldHideOnScroll
        className="bg-white border-b border-gray-200 shadow-sm rtl h-16"
      >
        <NavbarContent className="sm:hidden">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="text-gray-700"
          />
        </NavbarContent>

        <NavbarContent className="pr-3">
          <NavbarBrand>
            <motion.div variants={itemVariants} className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-indigo-600 rounded-lg flex items-center justify-center ml-2 shadow-sm">
                <FaTachometerAlt className="text-white text-sm" />
              </div>
              <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600 text-xl">
                پنل مدیریت
              </p>
            </motion.div>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent justify="end" className="gap-5">
          <motion.div variants={itemVariants}>
            <NavbarItem>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300 relative">
                <FaBell className="text-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">
                  ۳
                </span>
              </button>
            </NavbarItem>
          </motion.div>

          <motion.div variants={itemVariants}>
            <NavbarItem>
              <Dropdown>
                <DropdownTrigger>
                  <button className="flex items-center gap-2 p-1 pr-2 pl-3 rounded-full hover:bg-gray-50 border border-gray-100 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <FaUserCog className="text-primary" size={16} />
                    </div>
                    <div className="hidden md:flex items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user?.name || "مدیر سیستم"}
                      </span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-1.5 pt-0.5 pb-px rounded-full hidden md:inline">
                      آنلاین
                    </span>
                  </button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="منوی کاربر"
                  className="mt-2 min-w-[240px]"
                >
                  <DropdownItem
                    key="profile"
                    startContent={<FaUser size={16} className="text-primary" />}
                  >
                    پروفایل
                  </DropdownItem>
                  <DropdownItem
                    key="settings"
                    startContent={
                      <FaCog size={16} className="text-indigo-500" />
                    }
                  >
                    تنظیمات
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    startContent={<FaSignOutAlt size={16} />}
                    className="text-danger"
                    onClick={handleLogout}
                  >
                    خروج
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </motion.div>
        </NavbarContent>

        <NavbarMenu className="pt-6 bg-white">
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <p className="text-primary font-bold text-lg mb-2">منوی اصلی</p>
            <p className="text-xs text-gray-500">به پنل مدیریت خوش آمدید</p>
          </div>

          <NavbarMenuItem className="mt-4">
            <Link
              href="/admin"
              className="w-full block py-3 px-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center"
            >
              <FaHome className="ml-3 text-primary" />
              داشبورد
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              href="/admin/properties"
              className="w-full block py-3 px-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center"
            >
              <FaBuilding className="ml-3 text-primary" />
              املاک
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              href="/admin/users"
              className="w-full block py-3 px-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center"
            >
              <FaUsers className="ml-3 text-primary" />
              کاربران
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              href="/admin/agencies"
              className="w-full block py-3 px-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center"
            >
              <FaBuilding className="ml-3 text-primary" />
              آژانس‌ها
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              href="/admin/settings"
              className="w-full block py-3 px-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center"
            >
              <FaCog className="ml-3 text-primary" />
              تنظیمات
            </Link>
          </NavbarMenuItem>
          <NavbarMenuItem>
            <Link
              href="/admin/filters"
              className="w-full py-3 px-3 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors flex items-center"
            >
              <FaFilter className="ml-3 text-primary" />
              فیلترها
            </Link>
          </NavbarMenuItem>
        </NavbarMenu>
      </Navbar>
    </motion.div>
  );
}
