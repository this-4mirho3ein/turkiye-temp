"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Divider } from "@heroui/react";
import Button from "./ui/Button";
import mainMenuItems from "./data/menuItems";
import { motion } from "framer-motion";

// Animation variants
const sidebarVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

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
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      className="hidden md:flex md:w-64 lg:w-72 flex-col bg-gradient-to-b from-white to-gray-50 border-l border-gray-200 h-[calc(100vh-64px)] sticky top-16 shadow-sm rtl"
    >
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="bg-primary/5 rounded-lg p-3 mb-6">
          <motion.h3
            variants={itemVariants}
            className="text-primary font-bold text-lg pr-2 border-r-3 border-primary"
          >
            منوی اصلی
          </motion.h3>
        </div>

        <nav className="space-y-2">
          {mainMenuItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <motion.div
                key={item.name}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm rounded-lg transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-primary-600 to-primary text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon
                    className={`ml-3 ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                    size={18}
                  />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>
      </div>

      <motion.div
        variants={itemVariants}
        className="p-5 border-t border-gray-200 bg-gray-50/70"
      >
        <Divider className="my-3" />
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 font-medium">نسخه ۱.۰.۰</div>
          <Button
            variant="light"
            size="sm"
            color="primary"
            onPress={() => {}}
            className="text-xs hover:bg-primary/10"
          >
            راهنما
          </Button>
        </div>
      </motion.div>
    </motion.aside>
  );
}
