"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { BiSupport } from "react-icons/bi";

import { FaRegUser, FaUser } from "react-icons/fa";
import {
  IoChatboxEllipsesOutline,
  IoChatboxEllipses,
  IoHome,
  IoHomeOutline,
} from "react-icons/io5";
import { BsPlusCircle, BsPlusCircleFill } from "react-icons/bs";

const Navbar = () => {
  const pathname = usePathname();
  const { state } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAuthenticated(state.authenticated);
  }, [state.authenticated]);
  return (
    <div className="">
      {/* Desktop Navigation */}
      <div className="w-full hidden md:block bg-primary shadow-md z-10 ">
        <nav
          className={`hidden md:flex justify-between items-center mx-auto h-14 md:px-6 lg:px-12 max-w-7xl`}
        >
          <Link
            href="/"
            className="text-white hover:text-gray-200 rounded-md font-medium transition-all duration-300"
          >
            <Image
              alt=""
              src={"/logo1.png"}
              width={200}
              height={200}
              className="object-contain hover:opacity-90 transition-opacity block w-12 h-full  rounded-md"
            />
          </Link>

          <div className="flex items-center space-x-6 space-x-reverse">
            <Link
              href="/chat"
              className="text-white hover:text-gray-200 p-2 hover:scale-105 bg-primary hover:bg-primary-light rounded-md font-medium transition-all duration-300"
            >
              چت
            </Link>
            <Link
              href="/dashboard/support"
              className="text-white hover:text-gray-200 p-2 hover:scale-105 bg-primary hover:bg-primary-light rounded-md font-medium transition-all duration-300"
            >
              پشتیبانی
            </Link>
            <div className="border-[0.25px] rounded-full border-blue-600 mx-8 h-8 "></div>
            {isAuthenticated === null ? (
              <div className="text-white">Loading...</div>
            ) : isAuthenticated ? (
              <Link
                href="/dashboard"
                className="text-white hover:text-gray-200 p-2 hover:scale-105 bg-primary hover:bg-primary-light rounded-md font-medium transition-all duration-300"
              >
                پنل کاربری
                <FaRegUser size={24} className="inline mr-1" />
              </Link>
            ) : (
              <Link
                href="/auth/login"
                className="text-white hover:text-gray-200 p-2 hover:scale-105 bg-primary hover:bg-primary-light rounded-md font-medium transition-all duration-300"
              >
                ورود / ثبت‌ نام
                <FaRegUser size={24} className="inline mr-1" />
              </Link>
            )}
            <Link
              href={isAuthenticated ? "/post-ad" : "/auth/login"}
              className="bg-secondary text-white p-1 px-2 rounded-md font-semibold hover:scale-105 transition-all"
            >
              درج آگهی
              <BsPlusCircle size={25} className="inline mr-1" />
            </Link>
          </div>
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white flex justify-around items-center py-3 shadow-lg border-t border-gray-200 z-50">
        <Link
          href="/"
          className="flex flex-col items-center justify-center text-xs text-gray-600"
        >
          {pathname === "/" ? (
            <IoHome size={24} />
          ) : (
            <IoHomeOutline size={24} />
          )}
          صفحه اصلی
        </Link>

        <Link
          href="/chat"
          className="flex flex-col items-center justify-center text-xs text-gray-600"
        >
          {pathname === "/chat" ? (
            <IoChatboxEllipses size={24} />
          ) : (
            <IoChatboxEllipsesOutline size={24} />
          )}
          چت
        </Link>

        <Link
          href="/post-ad"
          className="flex flex-col items-center justify-center bg-secondary text-white px-2 py-2 rounded-xl -mt-6 text-sm font-semibold"
        >
          {pathname === "/post-ad" ? (
            <BsPlusCircleFill size={24} />
          ) : (
            <BsPlusCircle size={24} />
          )}
          <p className="mt-1"> درج آگهی</p>
        </Link>

        <Link
          href="/dashboard/support"
          className="flex flex-col items-center justify-center text-xs text-gray-600 mt-1"
        >
          {pathname === "/dashboard/support" ? (
            <BiSupport size={26} />
          ) : (
            <BiSupport size={26} />
          )}
          پشتیبانی
        </Link>

        {isAuthenticated === null ? (
          <div className="text-gray-600 text-xs">Loading...</div>
        ) : isAuthenticated ? (
          <Link
            href="/dashboard"
            className="flex flex-col items-center text-xs text-gray-600"
          >
            <FaUser size={24} />
            پنل
          </Link>
        ) : (
          <Link
            href="/auth/login"
            className="flex flex-col justify-center items-center text-xs text-gray-600"
          >
            <FaRegUser size={24} />
            ورود
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
