"use client";

import { usePathname } from "next/navigation";
import React,{ useState, useEffect } from "react";
import { getUser, updateUser } from "@/controllers/makeRequest";
import { catchMessage, successMessage } from "@/utils/showMessages";
import { setLoading, setLogOut, useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import Drawer from "@/components/Drawer";
import {
  MdOutlineDashboard,
  MdOutlineAccountBalanceWallet,
  MdOutlineRule,
  MdOutlineExpandMore,
  MdOutlineExpandLess,
} from "react-icons/md";
import { FaBug } from "react-icons/fa";
import { LuBookmark } from "react-icons/lu";
import { IoIosNotificationsOutline } from "react-icons/io";
import { VscHistory } from "react-icons/vsc";
import { BiSupport } from "react-icons/bi";
import { ImExit } from "react-icons/im";
import { IoSettingsOutline } from "react-icons/io5";
import { TiDocumentAdd } from "react-icons/ti";
import { FiUser } from "react-icons/fi";
import mainConfig from "@/configs/mainConfig";

// Define Menu Items with categories
const menuCategories = [
  {
    title: "آگهی ها",
    items: [
      {
        title: "ایجاد آگهی",
        path: "/post-ad",
        icon: <TiDocumentAdd size={26} />,
      },
      {
        title: "مدیریت آگهی های من",
        path: "/dashboard",
        icon: <MdOutlineDashboard size={26} />,
      },
      {
        title: "آگهی های نشان شده",
        path: "/dashboard/bookmarks",
        icon: <LuBookmark size={25} />,
      },
    ],
  },
  {
    title: "فعالیت ها",
    items: [
      {
        title: "بازدید های اخیر",
        path: "/dashboard/recently-viewed",
        icon: <VscHistory size={26} />,
      },
      {
        title: "اعلان ها",
        path: "/dashboard/notifications",
        icon: <IoIosNotificationsOutline size={27} />,
        hasNotification: true,
      },
      {
        title: "یادداشت ها",
        path: "/dashboard/notes",
        icon: <MdOutlineRule size={26} />,
      },
    ],
  },
  {
    title: "حساب کاربری",
    items: [
      {
        title: "اعتبار",
        path: "/dashboard/balance",
        icon: <MdOutlineAccountBalanceWallet size={26} />,
      },
      {
        title: "اطلاعات حساب",
        path: "/dashboard/settings",
        icon: <IoSettingsOutline size={26} />,
      },
    ],
  },
  {
    title: "سایر",
    items: [
      {
        title: "پشتیبانی",
        path: "/dashboard/support-report",
        icon: <FaBug size={24} />,
      },
      {
        title: "پنل املاک و آژانس",
        path: "/dashboard/realestate",
        icon: <BiSupport size={26} />,
      },
    ],
  },
];

export default function ProfileComponent({ children }: { children: React.ReactNode }) {  const { state, dispatch } = useAuth();
  const pathname = usePathname();

  const [mobileNumber, setMobileNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [email, setEmail] = useState("");
  const [notificationCount, setNotificationCount] = useState("1");
  const [name, setName] = useState("");
  const [family, setFamily] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [gender, setGender] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [role, setRole] = useState<{ title: string; title_new: string }>({
    title: "",
    title_new: "",
  });
  const [profileImage, setProfileImage] = useState<string | false>(false);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    "آگهی ها": true,
    "فعالیت ها": true,
    "حساب کاربری": true,
    سایر: true,
  });
  const [mobileExpandedCategories, setMobileExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleMobileCategory = (category: string) => {
    setMobileExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleLogOut = async () => {
    try {
      setLogOut(dispatch);
      successMessage("شما از حساب کاربری خود خارج شدید");
    } catch (error) {
      console.log(error);
      catchMessage();
    }
  };

  const fetchUserDetails = async () => {
    setLoading(dispatch, true);
    try {
      const response: any = await getUser(state.accessToken);
      console.log("User data response:", response);
      if (response.status === 200) {
        setMobileNumber(response.mobile_number || "");
        setEmail(response.email || "");
        setName(response.name || "");
        setFamily(response.family || "");
        setNationalCode(response.national_code || "");
        setGender(response.gender || "");
        setCountryCode(response.country_code || "");
        setIsComplete(response.is_infofield || false);

        // Set role if it exists in the response
        if (response.role) {
          setRole(response.role);
        }

        // Check different possible field names for profile image
        const profileImagePath =
          response.profileImage ||
          response.profile_image ||
          response.avatar ||
          response.image;
        console.log("Raw profile image path:", profileImagePath);

        if (profileImagePath) {
          const fullImageUrl = profileImagePath.startsWith("http")
            ? profileImagePath
            : `${mainConfig.apiServer}${profileImagePath}`;
          console.log("Full image URL:", fullImageUrl);
          setProfileImage(fullImageUrl);
        } else {
          console.log("No profile image found in response");
          setProfileImage(false);
        }

        setNotificationCount(response.notificationCount || 12);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return catchMessage();
    } finally {
      setLoading(dispatch, false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [state.accessToken]);

  const handleUpdateProfile = async () => {
    setLoading(dispatch, true);
    try {
      const response = await updateUser(state.accessToken, {
        email,
        name,
        family,
        national_code: nationalCode,
        gender,
      });

      if (response.status === 200) {
        return successMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      return catchMessage();
    } finally {
      setLoading(dispatch, false);
    }
  };

  const renderMenuItem = (item: any, isMobile = false) => {
    // Special case for real estate panel menu item
    if (item.title === "پنل املاک و آژانس") {
      const isRegularUser = role.title_new === "کاربر معمولی";
      const title = isRegularUser ? "ثبتنام پنل املاک" : "پنل املاک";
      const path = isRegularUser
        ? "/dashboard/register-realestate"
        : "/dashboard/realestate";

      return (
        <li key={path}>
          <Link
            href={path}
            className={`${
              pathname === path && "profile-menu-active"
            } profile-menu flex items-center justify-between rounded-lg px-2 py-3 xl:px-4 hover:bg-blue-100${
              isMobile ? "bg-primary-light/20" : ""
            }`}
            onClick={() => isMobile && setDrawerOpen(false)}
          >
            {isMobile ? (
              <>
                <div>{title}</div>
                {item.icon}
              </>
            ) : (
              <>
                <div className="flex items-center gap-x-4">
                  {item.icon}
                  <div>{title}</div>
                </div>
              </>
            )}
          </Link>
        </li>
      );
    }

    // Normal menu items
    return (
      <li key={item.path}>
        <Link
          href={item.path}
          className={`${
            pathname === item.path && "profile-menu-active"
          } profile-menu flex items-center justify-between rounded-lg px-2 py-3 xl:px-4 hover:bg-blue-100${
            isMobile ? "bg-primary-light/20" : ""
          }`}
          onClick={() => isMobile && setDrawerOpen(false)}
        >
          {isMobile ? (
            <>
              <div>{item.title}</div>
              {item.icon}
            </>
          ) : (
            <>
              <div className="flex items-center gap-x-4">
                {item.icon}
                <div>{item.title}</div>
              </div>
              {item.hasNotification && (
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-light text-xs font-bold text-white">
                  {notificationCount}
                </div>
              )}
            </>
          )}
        </Link>
      </li>
    );
  };

  const renderMenuCategory = (category: any) => (
    <div key={category.title} className="mb-2">
      <button
        className="flex w-full items-center justify-between rounded-lg px-2 py-3 font-medium text-text hover:bg-gray-100 xl:px-4"
        onClick={() => toggleCategory(category.title)}
      >
        <span>{category.title}</span>
        {expandedCategories[category.title] ? (
          <MdOutlineExpandLess size={24} />
        ) : (
          <MdOutlineExpandMore size={24} />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          expandedCategories[category.title] ? "max-h-96" : "max-h-0"
        }`}
      >
        {expandedCategories[category.title] && (
          <ul className="space-y-1 border-r-4 border-primary-light/25 pr-2">
            {category.items.map((item: any) => renderMenuItem(item))}
          </ul>
        )}
      </div>
    </div>
  );

  const renderMobileMenuCategory = (category: any) => (
    <div key={category.title} className="mb-2">
      <button
        className="flex w-full items-center justify-between rounded-lg px-3 py-3 font-medium text-text hover:bg-gray-100"
        onClick={() => toggleMobileCategory(category.title)}
      >
        <span>{category.title}</span>
        {mobileExpandedCategories[category.title] ? (
          <MdOutlineExpandLess size={24} className="" />
        ) : (
          <MdOutlineExpandMore size={24} className="" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out  ${
          mobileExpandedCategories[category.title] ? "max-h-96" : "max-h-0"
        }`}
      >
        {mobileExpandedCategories[category.title] && (
          <ul className="space-y-1 border-r-4  border-primary-light/30 px-3 mr-6 ">
            {category.items.map((item: any) => renderMenuItem(item, true))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-w-screen h-2vh w-full bg-[#f0f4f8] min-h-screen">
      <div className="flex relative min-w-screen h-full text-text">
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <button
            className="bg-secondary lg:hidden text-center px-4 py-1 text-lg flex items-center gap-x-2 rounded-md"
            onClick={() => setDrawerOpen(!isDrawerOpen)}
          >
            <IoSettingsOutline />
            منوی پنل کاربری
          </button>
        </div>
        <main className="grow mt-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-3 bg-white rounded-2xl shadow-md">
                <div className="hidden w-full overflow-hidden rounded-lg shadow-base lg:block">
                  <div
                    dir="ltr"
                    className="max-h-[calc(90vh_-_10p)] overflow-y-auto p-3 xl:p-5"
                  >
                    <div dir="rtl">
                      <div className="mb-2 flex items-center justify-between border-b pb-6">
                        <div className="flex items-center gap-x-4">
                          <div>
                            <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary/20">
                              {profileImage ? (
                                <Image
                                  src={profileImage as string}
                                  alt="User profile"
                                  width={100}
                                  height={100}
                                  className="object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-blue-50 flex items-center justify-center">
                                  <FiUser
                                    size={24}
                                    className="text-primary/60"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <div className="line-clamp-1">
                              {name ? name : "نام "}{" "}
                              {family ? family : "نام خانوادگی"}
                            </div>
                            <div
                              dir="ltr"
                              className="line-clamp-1 text-right text-sm text-text/90"
                            >
                              +{countryCode ? countryCode : 98} {mobileNumber}
                            </div>
                            {role.title_new && (
                              <div className="text-xs text-primary/80 mt-1">
                                {role.title_new}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {menuCategories.map(renderMenuCategory)}
                        <div className="mt-4">
                          <Link
                            className="profile-menu flex items-center justify-between rounded-lg px-2 py-3 xl:px-4 text-red-500 hover:bg-warning/10"
                            href="/"
                            onClick={handleLogOut}
                          >
                            <div className="flex items-center gap-x-4">
                              <ImExit size={26} />
                              <span> خروج از حساب </span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {children}
            </div>
          </div>
        </main>
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => setDrawerOpen(!isDrawerOpen)}
          title="منوی پنل کاربری"
        >
          <div className="p-2 px-6 bg-gradient-to-r from-blue-50 to-indigo-50  lg:hidden">
            <div className="flex flex-row items-center gap-8 justify-around">
              <div className="relative group">
                {profileImage ? (
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-primary/20">
                    <Image
                      src={profileImage as string}
                      alt="User profile"
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-blue-50 flex items-center justify-center border-2 border-dashed border-primary/20">
                    <FiUser size={32} className="text-primary/60" />
                  </div>
                )}
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-medium text-gray-800 line-clamp-1">
                  {name || "کاربر مهمان"}
                </h3>
                <p
                  dir="ltr"
                  className="text-sm text-gray-500 font-light tracking-wide"
                >
                  +{countryCode || "98"} {mobileNumber || "9123456789"}
                </p>
                {role.title_new && (
                  <p className="text-xs text-primary/80">{role.title_new}</p>
                )}
              </div>
              <Link
                href={"/dashboard/notifications"}
                className={`${
                  parseInt(notificationCount) > 0
                    ? "text-primary animate-bounce"
                    : "text-gray-400"
                } inline p-2 bg-white rounded-full  text-lg`}
              >
                {notificationCount}{" "}
                <IoIosNotificationsOutline size={30} className={`inline`} />
              </Link>
            </div>
          </div>
          <div className="space-y-2 mx-2">
            {menuCategories.map(renderMobileMenuCategory)}
            <div className="mt-4">
              <Link
                onClick={(e) => {
                  handleLogOut();
                  setDrawerOpen(false);
                }}
                href="/"
                className="profile-menu flex w-full items-center justify-between rounded-lg px-2 py-3 text-red-500 hover:bg-warning/10"
              >
                خروج از حساب کاربری
                <ImExit size={26} />
              </Link>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
}
