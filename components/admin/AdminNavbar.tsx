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
import { FaBell, FaUser, FaSignOutAlt, FaCog } from "react-icons/fa";
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
        duration: 3000,
      });

      // Redirect to login page
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      showToast({
        message: "خطا در خروج از سیستم",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="full"
      shouldHideOnScroll
      className="bg-white border-b border-gray-200"
    >
      <NavbarContent className="sm:hidden">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="text-gray-700"
        />
      </NavbarContent>

      <NavbarContent className="pr-3">
        <NavbarBrand>
          <p className="font-bold text-primary text-xl">پنل مدیریت</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-4">
        <NavbarItem>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <FaBell className="text-gray-600" />
          </button>
        </NavbarItem>

        <NavbarItem>
          <Dropdown>
            <DropdownTrigger>
              <button className="flex items-center gap-2">
                <Avatar
                  size="sm"
                  src="https://via.placeholder.com/32"
                  fallback={<FaUser />}
                />
                <span className="hidden md:inline text-sm font-medium">
                  {user?.name || "مدیر سیستم"}
                </span>
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="منوی کاربر">
              <DropdownItem key="profile" startContent={<FaUser size={16} />}>
                پروفایل
              </DropdownItem>
              <DropdownItem key="settings" startContent={<FaCog size={16} />}>
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
      </NavbarContent>

      <NavbarMenu className="pt-6">
        <NavbarMenuItem>
          <Link
            href="/admin"
            className="w-full block py-2 text-gray-700 hover:text-primary"
          >
            داشبورد
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/admin/properties"
            className="w-full block py-2 text-gray-700 hover:text-primary"
          >
            املاک
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/admin/users"
            className="w-full block py-2 text-gray-700 hover:text-primary"
          >
            کاربران
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/admin/agencies"
            className="w-full block py-2 text-gray-700 hover:text-primary"
          >
            آژانس‌ها
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link
            href="/admin/settings"
            className="w-full block py-2 text-gray-700 hover:text-primary"
          >
            تنظیمات
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
