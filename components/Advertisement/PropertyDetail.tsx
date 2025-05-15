"use client";
import { Avatar, Button, useDisclosure } from "@heroui/react";
import axios from "axios";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/grid";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import { setLoading, useAuth } from "@/context/AuthContext";
import { getAdvertisement } from "@/controllers/makeRequest";
import { Property } from "@/types/interfaces";
import { catchMessage } from "@/utils/showMessages";
import { Roles } from "@/types/enums";
import DOMPurify from "dompurify";

import Link from "next/link";
import mainConfig from "@/configs/mainConfig";
import { FaComments, FaPhoneAlt } from "react-icons/fa";
import {
  IoChatbubbleEllipsesOutline,
  IoCheckmarkCircleOutline,
  IoChevronForward,
  IoCloseCircleOutline,
  IoInformationCircleOutline,
  IoLocation,
} from "react-icons/io5";
import { AdNavbar } from "./AdNavbar";
import { filterIcons } from "@/utils/datas";
import ShareModal from "../ShareModal";

export default function PropertyDetail() {
  const { state, dispatch } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [open, setOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [data, setData] = useState<null | Property>(null);
  const params = useParams();
  const router = useRouter();
  const AdvertisementId = params.id || null;
  const pathname = usePathname();
  const getPropertyDetail = async () => {
    try {
      setLoading(dispatch, true);
      const response = await getAdvertisement(
        AdvertisementId as string,
        state.accessToken
      );
      setLoading(dispatch, false);
      if (response.status === 200) {
        console.log(response.data);
        setData(response.data);
      }
    } catch (error) {
      console.log(error);
      catchMessage();
      setLoading(dispatch, false);
      return false;
    }
  };

  const createChatroom = async (elanId: string) => {
    try {
      if (!state.accessToken){
        router.push("/auth/login");
        return
      }
      const chatResponse = await axios.get(
        `${mainConfig.apiServer}/create_chatroom`,
        
        { headers:{
          authorization:`Bearer ${state.accessToken}`
        },
          params: {
            elan_id: AdvertisementId,
          },
        }
      );

      // if (chatResponse.status >= 200 && chatResponse.status < 300) {
      //   router.push("/auth/login");
      //   return
      // }
      const id = chatResponse.data?.chat_room_id; // Assuming backend returns { id: "some-id" }

      console.log(chatResponse.data);

      if (id) {
        router.push(`/chat?id=${id}`);
      } else {
        console.error("No ID returned");
      }
    } catch (error) {
      console.error("Error creating chatroom:", error);
    }
  };

  useEffect(() => {
    if (!AdvertisementId) router.push("not-found");
    getPropertyDetail();
  }, []);

  return (
    <>
      <AdNavbar
        count={0}
        title={"جزئیات آگهی"}
        url={pathname}
        isSingle={true}
      />
      <div className="w-full mx-auto px-4 max-w-[1320px] py-5">
        {/* Image Gallery */}
        <div className="relative  pb-10">
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            navigation={true}
            pagination={{
              clickable: true,
              el: ".custom-pagination",
            }}
            className="rounded-xl shadow-lg"
            // breakpoints={{
            //   640: { slidesPerView: 1 },
            //   1024: { slidesPerView: 1, spaceBetween: 20 },
            // }}
            slidesPerView={1}
            loop={true}
          >
            {data?.image_name?.map((name, index) => (
              <SwiperSlide key={index}>
                <div
                  className="relative w-full h-72 md:h-96 lg:h-[500px] cursor-pointer"
                  onClick={() => {
                    setLightboxIndex(index);
                    setOpen(true);
                  }}
                >
                  <Image
                    src={`${mainConfig.fileServer}/advertisement_gallery/lg/${name}`}
                    alt={`Slide ${index}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    quality={90}
                    priority={index === 0}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="custom-pagination absolute bottom-0 left-0 right-0 h-10 flex justify-center items-center" />
        </div>

        {/* Lightbox */}

        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={lightboxIndex}
          slides={data?.image_name?.map((name) => ({
            src: `${mainConfig.fileServer}/advertisement_gallery/lg/${name}`,
            alt: `${data?.title || "Property"} - Full Image`,
          }))}
          zoom={{ maxZoomPixelRatio: 3, scrollToZoom: true }}
          plugins={[Zoom]}
        />
        {/* Header Section */}
        <div className="py-5 md:py-12">
          {/* <div className="space-y-8"> */}
          {/* Title and Price Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-gray-200">
            {/* Title with subtle decoration */}
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {data?.title || "عنوان ملک"}
              </h1>

              {data?.adv_type.slug && (
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {data.adv_type.slug === "rent" ? "اجاره" : "فروش"}
                </span>
              )}
            </div>

            {/* Price in a prominent card */}
            <div className="flex flex-col items-end w-full md:w-auto">
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3 rounded-xl shadow-sm border border-blue-200">
                <span className="text-2xl md:text-3xl font-bold text-blue-700">
                  {data?.price?.toLocaleString() || "---"}
                </span>
                <span className="text-gray-600 text-lg">تومان</span>
              </div>
            </div>
          </div>

          {/* Features and Location */}
          <div className="flex flex-col lg:flex-row justify-between gap-4 pt-2">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-700">ویژگی‌ها</h2>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                {data?.mainFeature?.map((feature, index) => {
                  return (
                    <li
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50  rounded-lg"
                    >
                      <span>
                        {filterIcons[feature.slug as keyof typeof filterIcons]}
                      </span>
                      <div>
                        <span className="text-gray-500 ">
                          {feature.title}:{" "}
                        </span>
                        <span className="font-semibold text-gray-700 ">
                          {feature.value}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-700 ">موقعیت</h2>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <IoLocation className="text-blue-500  text-xl" />
                <span className="text-gray-700 ">
                  {[
                    data?.country?.name,
                    data?.province?.name,
                    data?.city?.name,
                    data?.neighborhood?.name,
                  ]
                    .filter(Boolean)
                    .join("، ")}
                </span>
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>

        <section className="">
          {/* Flex container for responsive layout */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* توضیحات section - takes more space on desktop */}
            <div className="md:flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
              <h2 className="text-xl font-bold text-gray-900 mb-4">توضیحات</h2>
              <div className="prose max-w-none text-gray-700">
                {data?.description ? (
                  <>
                    <div
                      className={`whitespace-pre-line overflow-hidden transition-all duration-300 ${
                        // !expanded && data.description.length > 300
                        //   ? "max-h-[6rem]"
                        //   :
                        "max-h-[none]"
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(data?.description || ""),
                      }}
                    />
                    {/* {data.description.length > 300 && (
                      <button
                        onClick={() => setExpanded(!expanded)}
                        className="mt-3 flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none transition-colors duration-200"
                      >
                        {expanded ? (
                          <>
                            <span>مشاهده کمتر</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </>
                        ) : (
                          <>
                            <span>مشاهده بیشتر</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </>
                        )}
                      </button>
                    )} */}
                  </>
                ) : (
                  <p className="text-gray-400">
                    هیچ توضیحی برای این آگهی ثبت نشده است
                  </p>
                )}
              </div>
            </div>

            {/* اطلاعات فروشنده section - smaller on desktop */}
            <div className="md:w-80 lg:w-96 flex-shrink-0 bg-white p-6  rounded-xl shadow-sm border border-gray-100 self-start sticky top-4 w-full">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                اطلاعات فروشنده
              </h2>
              <div className="space-y-6">
                {data?.createdUser.role === Roles.User ? (
                  <div className="text-center py-4 text-gray-700 font-semibold">
                    کاربر عادی
                  </div>
                ) : (
                  <div className="space-y-6">
                    {data?.agency && (
                      <Link
                        href={`/realestates/${data.agency.id}`}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <Avatar
                            size="lg"
                            src={`${mainConfig.fileServer}/images/user/${data.agency.logo}`}
                            alt={data.agency.name}
                            className="border-2 border-blue-100"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500 mb-1">
                            آژانس املاک
                          </p>
                          <h3 className="font-semibold text-gray-900 truncate">
                            {data.agency.name}
                          </h3>
                        </div>
                        <IoChevronForward className="text-gray-400 text-lg" />
                      </Link>
                    )}

                    {data?.consulting && (
                      <div
                     
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex-shrink-0">
                          <Avatar
                            size="lg"
                            src={`${mainConfig.fileServer}/images/user/${data.consulting.logo}`}
                            alt={data.consulting.name}
                            className="border-2 border-blue-100"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-500 mb-1">
                            مشاور املاک
                          </p>
                          <h3 className="font-semibold text-gray-900 truncate">
                            {data.consulting.name}
                          </h3>
                        </div>
                        <IoChevronForward className="text-gray-400 text-lg" />
                      </div>
                    )}
                  </div>
                )}

                {/* Desktop-only button (hidden on mobile) */}
                <div className="hidden md:block">
                  <Button
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors"
                    onPress={() => {
                      onOpen();
                    }}
                  >
                    <IoChatbubbleEllipsesOutline className="ml-2 text-lg" />
                    تماس با فروشنده
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile-only fixed button */}
          <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent pt-4 pb-6 px-4 z-50 md:hidden">
            <Button
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
              onPress={() => {
                onOpen();
              }}
            >
              <IoChatbubbleEllipsesOutline className="ml-2 text-lg" />
              تماس با فروشنده
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-8 md:py-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-20 md:mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              دیگر ویژگی های ملک
            </h2>

            {/* Amenities - Table Style */}
            {data?.amenities && data.amenities?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  امکانات
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {data.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-2 px-3 border-b border-gray-100"
                    >
                      <span className="text-gray-800">{amenity.title}</span>
                      <span
                        className={
                          amenity.value === "دارد"
                            ? "text-green-600"
                            : "text-red-500"
                        }
                      >
                        {amenity.value === "دارد" ? (
                          <IoCheckmarkCircleOutline className="text-lg" />
                        ) : (
                          <IoCloseCircleOutline className="text-lg" />
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Features - Compact */}
            {data?.additionalFilters && data.additionalFilters?.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  اطلاعات تکمیلی
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {data.additionalFilters.map((filter, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg text-sm"
                    >
                      <span className="text-blue-500">
                        {filterIcons[
                          filter.slug as keyof typeof filterIcons
                        ] || (
                          <IoInformationCircleOutline className="text-base" />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-500 truncate">{filter.title}</p>
                        <p className="font-medium text-gray-900 truncate">
                          {filter.value}
                          {filter.slug === "size" && " متر"}
                          {filter.slug === "floor" && " ام"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!data?.amenities?.length && !data?.additionalFilters?.length && (
              <p className="text-gray-400 text-center py-4">
                هیچ ویژگی‌ای برای این ملک ثبت نشده است
              </p>
            )}
          </div>
        </section>
      </div>
      <ShareModal
        isOpen={isOpen}
        onClose={onClose}
        headerTitle="تماس با فروشنده"
        body={
          <div className="flex-shrink-0 bg-white p-6 rounded-xl shadow-sm w-full">
            <div className="space-y-6">
              {data?.consulting ? (
                <div>
                  <Link
                    href={`/consultant/${data.consulting.id}`}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <Avatar
                        size="lg"
                        src={`${mainConfig.fileServer}/images/user/${data.consulting.logo}`}
                        alt={data.consulting.name}
                        className="border-2 border-blue-100"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 mb-1">مشاور املاک</p>
                      <h3 className="font-semibold text-gray-900 truncate">
                        {data.consulting.name}
                      </h3>
                    </div>
                  </Link>
                </div>
              ) : data?.agency ? (
                <div>
                  <Link
                    href={`/agency/${data.agency.id}`}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex-shrink-0">
                      <Avatar
                        size="lg"
                        src={`${mainConfig.fileServer}/images/user/${data.agency.logo}`}
                        alt={data.agency.name}
                        className="border-2 border-blue-100"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-500 mb-1">آژانس املاک</p>
                      <h3 className="font-semibold text-gray-900 truncate">
                        {data.agency.name}
                      </h3>
                    </div>
                  </Link>

                  {/* Contact Buttons */}
                </div>
              ) : null}
              <div className="flex justify-around mt-4 gap-4">
                <Link
                  href={`tel:${data?.createdUser.mobile}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                >
                  <FaPhoneAlt />
                  تماس
                </Link>
                {data && (
                  <button
                    onClick={() => {
                      createChatroom(data.id);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow hover:bg-gray-200 transition"
                  >
                    <FaComments />
                    چت
                  </button>
                )}
              </div>
            </div>
          </div>
        }
      />
    </>
  );
}
