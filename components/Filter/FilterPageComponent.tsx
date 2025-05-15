"use client";

import NotFound from "@/app/not-found";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Breadcrumb } from "../Advertisement/BreadCrumb";
import { Advertisements } from "../Advertisement/AdvertisementsComponent";
import { useEffect, useState, useRef } from "react";
import { FaHome } from "react-icons/fa";
import {
  fetchTitle,
  getAdvertisements,
  getPropertyFilters,
} from "@/controllers/makeRequest";
import {
  setFilters,
  setLoading,
  useAuth,
  useFilters,
} from "@/context/AuthContext";
import { catchMessage } from "@/utils/showMessages";
import PaginationComponent from "../Pagination";
import DynamicFilters from "./FilterProps";
import AdverismentsComponent from "../Advertisement/Advertisments";
import { SortOrder } from "@/types/enums";
import deepEqual from "@/utils/equal";
import slugs from "@/utils/slugs";
import { AdNavbar } from "../Advertisement/AdNavbar";

export default function FilterPageComponent() {
  const { state, dispatch } = useAuth();
  const { filterState, filterDispatch } = useFilters();
  const [advertisements, setAdvertisements] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [sort, setSort] = useState<SortOrder>(SortOrder.Newest);
  const [filtersData, setFiltersData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string | string[] | number | number[]>
  >({});
  const pathname = usePathname();

  //#region params set
  const limit = 21;
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract transactionType & category from slug
  const transactionCategory = Array.isArray(params.transactionCategory)
    ? params.transactionCategory[0]
    : params.transactionCategory || "sell";
  // Split it into transactionType & category
  const [transactionType, propertyType, category] =
    transactionCategory.split("-") || "";
  if (!transactionType || !propertyType) {
    return <NotFound />;
  }
  const location = Array.isArray(params.location)
    ? params.location[0]
    : params.location;

  let country = null,
    province = null,
    city = null;

  if (location) {
    if (location.endsWith("-country")) {
      country = location.replace("-country", "");
    } else if (location.endsWith("-province")) {
      province = location.replace("-province", "");
    } else {
      city = location;
    }
  }
  const area = params.area || null;
  //#endregion

  //#region set seach params to filter state
  const getFiltersFromSearchParams = () => {
    const paramsObject: Record<string, string | string[] | number | number[]> =
      {};
    searchParams.forEach((value, key) => {
      if (value.includes(",")) {
        paramsObject[key] = value.split(","); // Convert comma-separated values to an array
      } else {
        paramsObject[key] = value;
      }
    });
    setSelectedFilters(paramsObject);
    return paramsObject;
  };

  //#endregion

  const getAdvertisementsList = async (
    pageParam?: number,
    limitParam?: number
  ) => {
    console.log("xxxxxxxxxxxxx");

    try {
      const updatedFilters = getFiltersFromSearchParams();
      const filters = {
        transactionType,
        propertyType,
        category,
        location,
        area,
        sort,
        ...updatedFilters,
      };
      setLoading(dispatch, true);
      const response = await getAdvertisements(
        filters,
        pageParam || page,
        limitParam || limit,
        state.accessToken
      );
      setLoading(dispatch, false);
      if (response.status === 200) {
        setAdvertisements(response.results);
        setCount(response.count);
      }
    } catch (error) {
      console.log(error);
      catchMessage();
      setLoading(dispatch, false);
      return false;
    }
  };
  const getFiltersDataList = async () => {
    try {
      setLoading(dispatch, true);
      const response = await getPropertyFilters(propertyType);
      setLoading(dispatch, false);
      if (response.status === 200) {
        setFiltersData(response.data);
      }
    } catch (error) {
      console.log(error);
      catchMessage();
      setLoading(dispatch, false);
      return false;
    }
  };
  // Function to update filters dynamically
  const handleFilterChange = (
    slug: string,
    value: string | string[] | number | number[],
    isMobileView: boolean
  ) => {
    const newFilters = { ...selectedFilters };

    if (value === "" || (Array.isArray(value) && value.length === 0)) {
      // Remove filter if value is empty
      delete newFilters[slug];
    } else {
      newFilters[slug] = value;
    }
    setSelectedFilters(newFilters);
    if (!isMobileView) {
      const query = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          query.set(key, val.join(",")); // Convert arrays to comma-separated values
        } else {
          query.set(key, String(val));
        }
      });

      // Push new URL without reloading
      router.push(`?${query.toString()}`, { scroll: false });
      // Update the state
    }
  };

  const handleResetFilterClick = () => {
    setFilters(filterDispatch, {
      transactionType: { title: "فروش", slug: "فروش" },
      propertyType: { title: "مسکونی", slug: "housing" },
      category: { title: "", slug: "" },
      country: { title: "", slug: "" },
      province: { title: "", slug: "" },
      city: { title: "", slug: "" },
      area: { title: "", slug: "" },
    });

    setSelectedFilters({});

    const cleanPath = "/sale-housing/iran-country";
    
    window.history.replaceState(null, "", cleanPath);

    router.refresh();
  };

  const handleAcceptFilters = async () => {
    let url = `${filterState.transactionType?.slug || "sale"}-${
      filterState.propertyType?.slug || "housing"
    }${filterState.category?.slug ? `-${filterState.category.slug}` : ""}/${
      filterState.city?.slug
        ? filterState.city.slug
        : filterState.province?.slug
        ? filterState.province.slug + "-province"
        : filterState.country?.slug
        ? filterState.country.slug + "-country"
        : "iran" + "-country"
    }${filterState.area?.slug ? `/${filterState.area.slug}` : ""}`;
    const query = new URLSearchParams();
    Object.entries(selectedFilters).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        query.set(key, val.join(",")); // Convert arrays to comma-separated values
      } else {
        query.set(key, String(val));
      }
    });

    // Push new URL without reloading
    router.push(`/${url}?${query.toString()}`, { scroll: false });
  };
  const breadItems = [
    { label: "/Home", href: "/", component: <FaHome /> },
    {
      label: String(filterState.transactionType?.title),
      href: `/${filterState.transactionType?.slug}-${
        filterState.propertyType?.slug
      }/${
        filterState.city?.slug
          ? filterState.city.slug
          : filterState.province?.slug
          ? filterState.province.slug + "-province"
          : filterState.country?.slug
          ? filterState.country.slug + "-country"
          : "iran" + "-country"
      }`,
    },
    {
      label: String(filterState.propertyType?.title),
      href: `/${filterState.transactionType?.slug}-${
        filterState.propertyType?.slug
      }/${
        filterState.city?.slug
          ? filterState.city.slug
          : filterState.province?.slug
          ? filterState.province.slug + "-province"
          : filterState.country?.slug
          ? filterState.country.slug + "-country"
          : "iran" + "-country"
      }`,
    },
    filterState.category.slug
      ? {
          label: String(filterState.category?.title),
          href: `/${filterState.transactionType?.slug}-${
            filterState.propertyType?.slug
          }-${filterState.category.slug}/${
            filterState.city?.slug
              ? filterState.city.slug
              : filterState.province?.slug
              ? filterState.province.slug + "-province"
              : filterState.country?.slug
              ? filterState.country.slug + "-country"
              : "iran" + "-country"
          }`,
        }
      : null,
    filterState.country.slug
      ? {
          label: String(filterState.country?.title),
          href: `/${filterState.transactionType?.slug}-${
            filterState.propertyType?.slug
          }${
            filterState.category.slug ? "-" + filterState.category.slug : ""
          }/${filterState.country.slug}-country`,
        }
      : null,
    filterState.province.slug
      ? {
          label: String(filterState.province?.title),
          href: `/${filterState.transactionType?.slug}-${
            filterState.propertyType?.slug
          }${
            filterState.category.slug ? "-" + filterState.category.slug : ""
          }/${filterState.province.slug}-province`,
        }
      : null,
    filterState.city.slug
      ? {
          label: String(filterState.city?.title),
          href: `/${filterState.transactionType?.slug}-${
            filterState.propertyType?.slug
          }${
            filterState.category.slug ? "-" + filterState.category.slug : ""
          }/${filterState.city.slug}`,
        }
      : null,
    filterState.area?.title
      ? {
          label: String(filterState.area?.title),
          href: `/${filterState.transactionType?.slug}-${
            filterState.propertyType?.slug
          }${
            filterState.category.slug ? "-" + filterState.category.slug : ""
          }/${
            filterState.city?.slug
              ? filterState.city.slug
              : filterState.province?.slug
              ? filterState.province.slug + "-province"
              : filterState.country?.slug
              ? filterState.country.slug + "-country"
              : "iran" + "-country"
          }/${filterState.area?.slug}`,
        }
      : null,
  ].filter((item): item is { label: string; href: string } => item !== null);

  const getTitle = async (slug: string) => {
    const title = slugs[slug as keyof typeof slugs] ?? (await fetchTitle(slug));
    return title;
  };

  const handleChangeUrl = async () => {
    // Create an object with the current slugs from the URL
    const filtersFromURL = {
      transactionType,
      propertyType,
      category,
      country, // Updated: Using parsed country
      province, // Updated: Using parsed province
      city, // Updated: Using parsed city
      area,
    };

    // Compare slugs between URL and filterState
    const filterStateSlugs = {
      transactionType: filterState.transactionType?.slug,
      propertyType: filterState.propertyType?.slug,
      category: filterState.category?.slug,
      country: filterState.country?.slug,
      province: filterState.province?.slug,
      city: filterState.city?.slug,
      area: filterState.area?.slug,
    };

    // Find the filters that need to be updated by comparing slugs
    const filtersToUpdate = Object.keys(filtersFromURL).filter((key) => {
      const filterValueFromURL =
        filtersFromURL[key as keyof typeof filtersFromURL];
      const filterValueFromState =
        filterStateSlugs[key as keyof typeof filterStateSlugs];

      // Skip if both are null, undefined, or empty
      if (
        (!filterValueFromURL || filterValueFromURL === "") &&
        (!filterValueFromState || filterValueFromState === "")
      ) {
        return false;
      }

      // Include if filterFromURL has value and filterStateSlugs does not
      if (
        filterValueFromURL &&
        (!filterValueFromState || filterValueFromState === "")
      ) {
        return true;
      }

      // Only include filters that have changed
      return filterValueFromURL !== filterValueFromState;
    });
    // **فقط اگر `city` مقدار داشته باشد، `province` و `country` را تغییر نده!**

    if (city) {
      filtersToUpdate.splice(filtersToUpdate.indexOf("province"), 1);
      filtersToUpdate.splice(filtersToUpdate.indexOf("country"), 1);
    }
    // **اگر `province` مقدار داشته باشد، `country` را تغییر نده!**
    else if (province) {
      filtersToUpdate.splice(filtersToUpdate.indexOf("country"), 1);
    }
    // If any filter has changed, fetch the corresponding titles
    if (filtersToUpdate.length > 0) {
      const updatedFilters = { ...filterState };

      await Promise.all(
        filtersToUpdate.map(async (filter) => {
          const slug = filtersFromURL[
            filter as keyof typeof filtersFromURL
          ] as string;
          if (slug) {
            const title = await getTitle(slug); // Wait for the title to be fetched
            if (typeof title !== "string") return;
            updatedFilters[filter as keyof typeof updatedFilters] = {
              title,
              slug,
            };
          } else {
            updatedFilters[filter as keyof typeof updatedFilters] = {
              title: "",
              slug: "",
            };
          }
        })
      );

      // Update state only if values actually changed
      if (!deepEqual(filtersFromURL, filterStateSlugs)) {
        setFilters(filterDispatch, updatedFilters);
      } else {
        console.log("No state update needed.");
      }
    }
  };
  useEffect(() => {
    getAdvertisementsList();
  }, [params, page, limit, sort, searchParams]);

  useEffect(() => {
    getFiltersDataList();
  }, [propertyType]);

  useEffect(() => {
    handleChangeUrl();
    window.scrollTo(0, 0);
  }, []);

  // Check if the filter state change requires a URL update
  useEffect(() => {
    // Only update URL if all required filters are present
    if (!filterState.transactionType?.slug || !filterState.propertyType?.slug) {
      return;
    }
  }, [filterState]);

  // Generate title dynamically
  const generateTitle = () => {
    const location =
      filterState.area?.title ||
      filterState.city?.title ||
      filterState.province?.title ||
      filterState.country?.title ||
      "";

    const categoryOrProperty =
      filterState.category?.title || filterState.propertyType?.title || "";

    const title = `${
      filterState.transactionType?.title || ""
    } ${categoryOrProperty} در ${location}`;

    console.log("title", title.trim());

    return title.trim();
  };

  return (
    <>
      {filterState.transactionType?.title && (
        <AdNavbar count={count} title={generateTitle()} url={pathname} />
      )}

      <div className="md:container mx-auto md:p-4 mb-5 md:mt-0">
        {/* Breadcrumb */}
        <Breadcrumb items={breadItems} />

        {/* Advertisements List */}
        <div className="flex-1 ">
          <AdverismentsComponent
            mainChildren={
              <Advertisements
                ads={advertisements}
                count={count}
                limit={limit}
                children={
                  <PaginationComponent
                    currentPage={page}
                    onPageChange={setPage}
                    totalPages={Math.ceil(count / limit)}
                  />
                }
              />
            }
            filtersChildren={
              <DynamicFilters
                filters={filtersData}
                selectedFilters={selectedFilters}
                onChange={handleFilterChange}
                onFilterClick={handleAcceptFilters}
                onResetFilterClick={handleResetFilterClick}
                isMobileView={false}
              />
            }
            mobileFiltersChildren={
              <DynamicFilters
                filters={filtersData}
                selectedFilters={selectedFilters}
                onChange={handleFilterChange}
                onFilterClick={handleAcceptFilters}
                isMobileView={true}
              />
            }
            onFilterClick={handleAcceptFilters}
            onResetFilterClick={handleResetFilterClick}
            sort={sort}
            setSort={setSort}
          />
        </div>
      </div>
    </>
  );
}
