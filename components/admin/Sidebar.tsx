"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Divider } from "@heroui/react";
import Button from "./ui/Button";
import mainMenuItems from "./data/menuItems";

export default function Sidebar() {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (name: string) => {
    if (openSubmenu === name) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(name);
    }
  };

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-l border-gray-200 bg-white h-[calc(100vh-64px)] sticky top-16">
      <div className="p-4 flex-1 overflow-y-auto">
        <nav className="space-y-1">
          {mainMenuItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon
                  className={`ml-3 ${
                    isActive ? "text-white" : "text-gray-500"
                  }`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Divider className="my-3" />
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">نسخه ۱.۰.۰</div>
          <Button
            variant="light"
            size="sm"
            color="primary"
            onPress={() => {}}
            className="text-xs"
          >
            راهنما
          </Button>
        </div>
      </div>
    </aside>
  );
}
