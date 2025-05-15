import mainConfig from "@/configs/mainConfig";
import { useFilters } from "@/context/AuthContext";
import { globalSearch } from "@/controllers/makeRequest";
import { Location, SearchAdvertisement } from "@/types/interfaces";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
  Avatar,
  Button,
} from "@heroui/react";
import { useAsyncList } from "@react-stately/data";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";

type ApiResponse = {
  locations: Location[];
  Advertisement: SearchAdvertisement[];
};

export default function MainSearch() {
  const { filterState } = useFilters();

  const router = useRouter();
  const [searchText, setSearchText] = useState<string | undefined>("");
  const [visibleAll, setVisibleAll] = useState({
    locations: false,
    ads: false,
  });
  const SearchIcon = ({ size = 24, strokeWidth = 1.5, ...props }) => {
    return (
      <svg
        aria-hidden="true"
        fill="none"
        focusable="false"
        height={size}
        role="presentation"
        viewBox="0 0 24 24"
        width={size}
        {...props}
      >
        <path
          d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
        <path
          d="M22 22L20 20"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
        />
      </svg>
    );
  };
  const list = useAsyncList<{
    section: "locations" | "ads";
    items: (Location | SearchAdvertisement)[];
  }>({
    async load({ signal, filterText }) {
      setSearchText(filterText);
      if (!filterText) return { items: [] };

      try {
        const res = await globalSearch(filterText, signal);
        const data: ApiResponse = await res.data;
        return {
          items: [
            {
              section: "locations",
              items: data.locations.slice(0, 5), // Show top 5 locations
            },
            {
              section: "ads",
              items: data.Advertisement.slice(0, 5), // Show top 5 ads
            },
          ],
        };
      } catch (error) {
        console.error("Search error:", error);
        return { items: [] };
      }
    },
  });

  const handleShowMore = (
    section: "locations" | "ads",
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setVisibleAll((prev) => ({
      ...prev,
      [section]: true,
    }));
  };

  const handleLocationClick = useCallback(
    (location: Location) => {
      let url = `${filterState.transactionType?.slug}-${
        filterState.propertyType?.slug
      }${filterState.category?.slug ? `-${filterState.category?.slug}` : ""}/`;

      switch (location.type) {
        case "city":
          url += location.slug;
          break;
        case "province":
          url += `${location.slug}-province`;
          break;
        case "country":
          url += `${location.slug}-country`;
          break;
        case "area":
          url += `/${location.slug}`;
          break;
        default:
          url += "iran-country";
      }
      router.push(url);
    },
    [
      filterState.transactionType?.slug,
      filterState.propertyType?.slug,
      filterState.category?.slug,
      router,
    ]
  );

  const handleAdClick = useCallback(
    (ad: SearchAdvertisement) => {
      let url = `${ad.transactionType}-${ad.propertyType}${
        ad.category ? `-${ad.category}` : ""
      }/${ad.area?.slug ? ad.city.slug + "/" + ad.area.slug : ad.city.slug}/${
        ad.id
      }`;
      router.push(url);
    },
    [router]
  );
  const renderItem = useCallback(
    (item: Location | SearchAdvertisement, index: number) => {
      if ("type" in item) {
        // Location item
        return (
          <>
            {(index < 5 || visibleAll.locations) && (
              <AutocompleteItem
                key={`location-${item.slug}`}
                textValue={item.name}
                // onPress={() => handleLocationClick(item)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Avatar
                      alt={item.name}
                      className="flex-shrink-0 bg-transparent"
                      size="sm"
                      src="/location.png"
                      radius="none"
                      isBordered={false}
                    />
                    <div className="flex flex-col">
                      <span className="text-small">{item.name}</span>
                      <span className="text-tiny text-default-400">
                        {getTypeLabel(item.type)}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="border-small mr-0.5 font-medium shadow-small"
                    radius="full"
                    size="sm"
                    variant="bordered"
                    onPress={() => handleLocationClick(item)}
                  >
                    مشاهده
                  </Button>
                </div>
              </AutocompleteItem>
            )}
          </>
        );
      } else {
        // Advertisement item
        return (
          <>
            {(index < 5 || visibleAll.ads) && (
              <AutocompleteItem key={`ad-${item.id}`} textValue={item.title}>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2 items-center">
                    <Avatar
                      alt={item.title}
                      className="flex-shrink-0"
                      size="md"
                      src={
                        item.image_name
                          ? `${mainConfig.fileServer}/advertisement_gallery/xs/${item.image_name}`
                          : "/1.jpg"
                      }
                    />
                    <div className="flex flex-col">
                      <span className="text-small">{item.title}</span>
                      <span className="text-tiny text-default-400">
                        {item.area?.title}
                      </span>
                    </div>
                  </div>
                  <Button
                    className="border-small mr-0.5 font-medium shadow-small"
                    radius="full"
                    size="sm"
                    variant="bordered"
                    onPress={() => handleAdClick(item)}
                  >
                    جزئیات
                  </Button>
                </div>
              </AutocompleteItem>
            )}
          </>
        );
      }
    },
    [handleLocationClick, handleAdClick]
  );

  return (
    <Autocomplete
      className="w-full max-w-2xl"
      classNames={{
        base: "max-w-xs",
        listboxWrapper: "max-h-[640px]",
        clearButton: "text-[#cfcfcf]",
        selectorButton: "text-[#cfcfcf]",
      }}
      allowsEmptyCollection
      inputValue={list.filterText}
      isLoading={list.isLoading}
      style={{ color: "white" }}
      label={<span className="text-[#cfcfcf]">جستجوی هوشمند</span>}
      placeholder={`جست و جو در ${filterState.transactionType?.title},${
        filterState.propertyType?.title
      }${filterState.category?.title ? `,${filterState.category?.title}` : ""}`}
      variant="bordered"
      onInputChange={(value) => {
        setSearchText(value); // Update filterState
        list.setFilterText(value); // Also update the async list
      }}
      defaultInputValue={searchText} // Ensure initial value
      // allowsCustomValue
      startContent={
        <SearchIcon className="text-[#cfcfcf" size={20} strokeWidth={2.5} />
      }
      popoverProps={{
        offset: 10,
        classNames: {
          base: "rounded-large",
          content: "p-1 border-small border-default-100 bg-background",
        },
      }}
      radius="full"
      inputProps={{
        classNames: {
          input:
            "ml-1 placeholder:text-[#cfcfcf] border-white focus:border-white",
          inputWrapper: "h-[48px] group-data-[focus=true]:border-blue-200",
        },
      }}
      listboxProps={{
        hideSelectedIcon: true,
        emptyContent: (
          <div style={{ padding: 10 }}>
            نتیجه ای پیدا نشد، لطفا یک عبارت دیگر را جستجو نمایید.
          </div>
        ),
        itemClasses: {
          base: [
            "rounded-medium",
            "text-default-500",
            "transition-opacity",
            "data-[hover=true]:text-foreground",
            "dark:data-[hover=true]:bg-default-50",
            "data-[pressed=true]:opacity-70",
            "data-[hover=true]:bg-default-200",
            "data-[selectable=true]:focus:bg-default-100",
            "data-[focus-visible=true]:ring-default-500",
          ],
        },
      }}
    >
      {list.items.map((group, index) => (
        <AutocompleteSection
          key={group.section}
          title={group.section === "locations" ? "موقعیت‌ها" : "آگهی‌ها"}
          showDivider={index == 0}
        >
          <>
            {group.items.map(renderItem)}
            {/* {!visibleAll[group.section] && ( */}
            {/* <AutocompleteItem key={`show-more-${group.section}`} textValue="" itemScope={false}>
            <button
              onClick={(e) => {
                handleShowMore(group.section, e);
              }}
              className="justify-center"
            >
              مشاهده بیشتر
            </button>
            </AutocompleteItem> */}
            {/* )} */}
          </>
        </AutocompleteSection>
      ))}
    </Autocomplete>
  );
}

// Helper functions
function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    country: "کشور",
    province: "استان",
    city: "شهر",
    area: "محله",
  };
  return labels[type] || type;
}
