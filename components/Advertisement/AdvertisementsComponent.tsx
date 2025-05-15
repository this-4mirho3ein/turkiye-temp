import mainConfig from "@/configs/mainConfig";
import { Button, Card } from "@heroui/react";
import Link from "next/link";
import {
  IoLocation,
  IoHeart,
  IoHeartOutline,
  IoStar,
  IoFlash,
} from "react-icons/io5";
import CustomImage from "../CustomImage";
import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns-jalali";
import { Ads } from "@/types/interfaces";
import { Premium } from "@/types/enums";
import { filterIcons } from "@/utils/datas";
import { handleFavorite } from "@/controllers/makeRequest";
import { useAuth } from "@/context/AuthContext";

export function Advertisements({
  ads,
  count,
  limit,
  children,
}: {
  ads: Ads[];
  count?: number;
  limit?: number;
  children?: React.ReactNode;
}) {
  // Initialize favorites from props
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const { state, dispatch } = useAuth();
  // Initialize favorites state from ads data
  useEffect(() => {
    const initialFavorites = ads?.reduce((acc, ad) => {
      acc[ad.id] = ad.is_bookmarked || false;
      return acc;
    }, {} as Record<string, boolean>);
    setFavorites(initialFavorites);
  }, [ads]);

  const toggleFavorite = async (adId: string) => {
    // Get current favorite status before updating
    const currentStatus = favorites[adId] || false;

    // Optimistic update - immediately show the new state
    setFavorites((prev) => ({
      ...prev,
      [adId]: !currentStatus,
    }));

    try {
      // Call API to toggle bookmark status
      const type = currentStatus ? "delete" : "";
      await handleFavorite(
        adId,
        type,
        state.accessToken // Clearer API semantics
      );
    } catch (error) {
      // Rollback on error - revert to previous state
      setFavorites((prev) => ({
        ...prev,
        [adId]: currentStatus, // Revert to original status
      }));

      console.error("Failed to update favorite:", error);
      // Optionally show error to user
      // toast.error("Failed to update favorite");
    }
  };
  return (
    <div className="container px-1 py-2">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {ads?.length > 0 ? (
          <>
            {ads?.map((ad) => {
              const isFavorite = favorites[ad.id] || false;
              const lastUpdate =
                ad.update_date && ad.update_date !== ad.created_at
                  ? `${formatDistanceToNow(new Date(ad.update_date), {
                      addSuffix: true,
                    })} `
                  : `${formatDistanceToNow(new Date(ad.created_at), {
                      addSuffix: true,
                    })} `;
              const adUrl = `/${ad.transactionType.slug}-${
                ad.propertyType.slug
              }${ad.category?.slug ? `-${ad.category.slug}` : ""}/${
                ad.city?.slug
                  ? ad.neighborhood?.slug
                    ? `${ad.city.slug}/${ad.neighborhood.slug}`
                    : ad.city.slug
                  : "location-unknown"
              }/${ad.id}`;
              return (
                <Card dir="rtl" key={ad.id} className="overflow-visible">
                  <Link href={adUrl}>
                    <div className="grid grid-cols-12 h-auto p-2">
                      <div className="col-span-12 grid grid-cols-12 w-full border-b-1">
                        <div className="col-span-4 p-2 h-full">
                          <CustomImage
                            src={`${mainConfig.fileServer}/advertisement_gallery/sm/${ad.image_name}`}
                            width={615}
                            height={500}
                            alt={ad.title}
                            className="h-full w-full rounded-md"
                          />
                          <div className="absolute -top-3 right-2 flex flex-row items-start gap-2">
                            {ad.premium?.map((item, index) => (
                              <span
                                key={index}
                                className={`flex items-center gap-1 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-sm
                ${
                  item === Premium.Special ? "bg-blue-600/80" : "bg-red-600/80"
                }`}
                              >
                                {item === Premium.Special && (
                                  <IoStar className="text-yellow-300 text-sm" />
                                )}
                                {item === Premium.Urgent && (
                                  <IoFlash className="text-yellow-400 text-sm" />
                                )}

                                {item === Premium.Special && "ویژه"}
                                {item === Premium.Urgent && "فوری"}
                              </span>
                            ))}
                          </div>
                          <div className="absolute -top-3 left-2 flex flex-row items-start gap-2">
                            <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-md justify-end">
                              {lastUpdate}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-8 p-2 content-center">
                          <div className="flex flex-col gap-4">
                            <span className="w-full text-sm text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]">
                              {ad.title}
                            </span>
                            <span className="w-full font-bold text-primary">
                              {ad.price?.toLocaleString() + " تومان"}
                            </span>
                            <span className="w-full text-sm text-gray-600">
                              <IoLocation className="inline ml-2" />
                              {ad.city?.title + ", " + ad.neighborhood?.title}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 w-full">
                        <ul className="flex flex-wrap p-2 justify-between">
                          {ad?.mainFeature &&
                            ad.mainFeature.length > 0 &&
                            ad.mainFeature?.map((feature, index) => {
                              if (index <= 1) {
                                return (
                                  <li
                                    key={index}
                                    className="flex items-center justify-center gap-1 p-1.5 bg-gray-50 rounded-lg text-sm min-w-[110px]"
                                  >
                                    <span className="text-[16px] text-[#a3abb0]">
                                      {
                                        filterIcons[
                                          feature.slug as keyof typeof filterIcons
                                        ]
                                      }
                                    </span>
                                    <div className="whitespace-nowrap">
                                      <span className="text-gray-500">
                                        {feature.title}:{" "}
                                      </span>
                                      <span className="font-semibold text-gray-700">
                                        {feature.value}
                                      </span>
                                    </div>
                                  </li>
                                );
                              }
                            })}
                        </ul>
                      </div>
                    </div>
                  </Link>
                  <div className="absolute top-4 right-4 z-50">
                    <Button
                      variant="light"
                      onPress={() => {
                        toggleFavorite(ad.id);
                        return false;
                      }}
                      isIconOnly
                      size="sm"
                      className="bg-black/20"
                    >
                      {isFavorite ? (
                        <IoHeart className="text-red-600 text-lg" />
                      ) : (
                        <IoHeartOutline className="text-white text-lg" />
                      )}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </>
        ) : (
          <h1>نتیجه ای یافت نشد</h1>
        )}
      </div>
      {typeof limit === "number" &&
        typeof count === "number" &&
        count > limit &&
        children}
    </div>
  );
}
