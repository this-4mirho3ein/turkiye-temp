"use client";
import { useEffect } from "react";
import {  Tabs, Tab } from "@heroui/react";
import { useApi } from "@/hooks/useApi";
import {
  getAreas,
  getCategories,
  getCities,
  getCountries,
  getProvinces,
} from "@/controllers/makeRequest";
import CustomSelect from "../CustomSelect";
import { Category } from "@/types/interfaces";
import { useRouter } from "next/navigation";
import { setFilters, useFilters } from "@/context/AuthContext";
import { properties } from "@/utils/datas";

const fetchers = {
  countries: getCountries,
  provinces: getProvinces,
  cities: getCities,
  areas: getAreas,
  categories: getCategories,
};

export default function BaseFilter({
  isMobileView,
}: {
  isMobileView: boolean;
}) {
  const { filterState, filterDispatch } = useFilters();
  const router = useRouter();

  // Fetch location data using useApi hook
  const { data: countries, isLoading: isCountriesLoading } = useApi(
    "countries",
    fetchers,
    null,
    true
  );
  const { data: provinces, isLoading: isProvincesLoading } = useApi(
    "provinces",
    fetchers,
    filterState.country?.slug,
    !!filterState.country?.slug
  );
  const { data: cities, isLoading: isCitiesLoading } = useApi(
    "cities",
    fetchers,
    filterState.province?.slug,
    !!filterState.province?.slug
  );
  const { data: areas, isLoading: isAreasLoading } = useApi(
    "areas",
    fetchers,
    filterState.city?.slug,
    !!filterState.city?.slug
  );
  const { data: categories, isLoading: isCategoriesLoading } = useApi(
    "categories",
    fetchers,
    filterState.propertyType?.slug,
    !!filterState.propertyType?.slug
  );

  // Handle filter state changes and navigate
  const handleFilters = (currentFilterState: any) => {
    if (isMobileView) return;
    const currentUrlParams = new URLSearchParams(window.location.search);
    let url = `${currentFilterState.transactionType?.slug || "sale"}-${
      currentFilterState.propertyType?.slug || "housing"
    }${
      currentFilterState.category?.slug
        ? `-${currentFilterState.category.slug}`
        : ""
    }/${
      currentFilterState.city?.slug
        ? currentFilterState.city.slug
        : currentFilterState.province?.slug
        ? currentFilterState.province.slug + "-province"
        : currentFilterState.country?.slug
        ? currentFilterState.country.slug + "-country"
        : "iran" + "-country"
    }${
      currentFilterState.area?.slug ? `/${currentFilterState.area.slug}` : ""
    }`;

    router.push(`/${url}?${currentUrlParams.toString()}`, { scroll: false });
  };

  // Reset category filter if not valid for the selected transaction type and property type
  useEffect(() => {
    if (
      !categories?.[filterState.transactionType?.slug]?.subgroup?.some(
        (c: Category) => c.slug.toString() === filterState.category?.slug
      )
    ) {
      setFilters(filterDispatch, {
        ...filterState,
        category: { title: "", slug: "" },
      });
    }
  }, [
    filterState.transactionType?.slug,
    filterState.propertyType?.slug,
    categories,
    filterState.category?.slug,
  ]);

  // Render the filter components
  const renderFilters = () => {
    return (
      <>
        <div className="px-1 lg:px-2 py-2 border rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            نوع آگهی و ملک
          </h3>
          <Tabs
            size="md"
            className="flex flex-col md:flex-row rounded-lg p-1 justify-center w-full md:w-auto"
            color="primary"
            selectedKey={filterState.transactionType?.slug}
            onSelectionChange={(key) => {
              let updatedFilterState;
              if (
                !categories?.[
                  filterState.transactionType?.slug
                ]?.subgroup?.some(
                  (c: Category) =>
                    c.slug.toString() === filterState.category?.slug
                )
              ) {
                updatedFilterState = {
                  ...filterState,
                  transactionType: {
                    title: key === "sale" ? "فروش" : "اجاره",
                    slug: key as string,
                  },
                  category: { title: "", slug: "" },
                };
                setFilters(filterDispatch, {
                  ...filterState,
                  category: { title: "", slug: "" },
                });
              } else {
                updatedFilterState = {
                  ...filterState,
                  transactionType: {
                    title: key === "sale" ? "فروش" : "اجاره",
                    slug: key as string,
                  },
                };
              }
              setFilters(filterDispatch, updatedFilterState);
              handleFilters(updatedFilterState);
            }}
          >
            <Tab
              key="sale"
              title={
                <div className="flex items-center space-x-1">
                  {/* <FaHome className="ml-2" /> */}
                  <span>فروش</span>
                </div>
              }
              className="w-full md:w-auto"
             
            />
            <Tab
              key="rent"
              title={
                <div className="flex items-center space-x-1">
                  {/* <FaKey className="ml-2" /> */}
                  <span>اجاره</span>
                </div>
              }
              className="w-full md:w-auto"
            />
          </Tabs>

          <CustomSelect
            isDisabled={false}
            placeholder=":کاربری"
            selectedKeys={
              filterState.propertyType?.slug !== ""
                ? [String(filterState.propertyType?.slug)]
                : []
            }
            onChange={(value) => {
              const selected = properties?.find((c: any) => c.slug === value);
              if (selected) {
                let updatedFilterState;
                if (
                  !categories?.[
                    filterState.transactionType?.slug
                  ]?.subgroup?.some(
                    (c: Category) =>
                      c.slug.toString() === filterState.category?.slug
                  )
                ) {
                  updatedFilterState = {
                    ...filterState,
                    propertyType: {
                      title: selected.title,
                      slug: selected.slug,
                    },
                    category: { title: "", slug: "" },
                  };
                  setFilters(filterDispatch, {
                    ...filterState,
                    category: { title: "", slug: "" },
                  });
                } else {
                  updatedFilterState = {
                    ...filterState,
                    propertyType: {
                      title: selected.title,
                      slug: selected.slug,
                    },
                  };
                }
                setFilters(filterDispatch, updatedFilterState);
                handleFilters(updatedFilterState);
              }
            }}
            items={properties || []}
            itemKey="slug"
            itemLabel="title"
            classNames="py-2"
          />

          <CustomSelect
            isDisabled={isCategoriesLoading}
            placeholder="نوع"
            selectedKeys={
              filterState.category?.slug !== ""
                ? [String(filterState.category?.slug)]
                : []
            }
            onChange={(value) => {
              const selected = categories?.[
                filterState.transactionType?.slug
              ]?.subgroup?.find((c: any) => c.slug === value);
              let updatedFilterState;
              if (selected) {
                updatedFilterState = {
                  ...filterState,
                  category: {
                    title: selected.title,
                    slug: selected.slug,
                  },
                };
              } else {
                updatedFilterState = {
                  ...filterState,
                  category: {
                    title: "",
                    slug: "",
                  },
                };
              }
              setFilters(filterDispatch, updatedFilterState);
              handleFilters(updatedFilterState);
            }}
            items={
              categories?.[filterState.transactionType?.slug]?.subgroup || []
            }
            itemKey="slug"
            itemLabel="title"
            classNames="py-2"
          />
        </div>

        {/* Repeat for other filters with similar changes */}

        <div className="px-1 lg:px-2 py-2 border rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">آدرس</h3>
          <CustomSelect
            isDisabled={isCountriesLoading}
            placeholder="کشور"
            selectedKeys={
              filterState.country?.slug
                ? [String(filterState.country.slug)]
                : []
            }
            onChange={(value) => {
              const selectedCountry = countries?.results.find(
                (c: any) => c.slug === value
              );
              if (selectedCountry) {
                const updatedFilterState = {
                  ...filterState,
                  country: {
                    title: selectedCountry.name,
                    slug: selectedCountry.slug,
                  },
                  province: { title: "", slug: "" },
                  city: { title: "", slug: "" },
                  area: { title: "", slug: "" },
                };
                setFilters(filterDispatch, updatedFilterState);
                handleFilters(updatedFilterState); // Pass the updated state
              }
            }}
            items={countries?.results || []}
            itemKey="slug"
            itemLabel="name"
            classNames="py-2"
          />

          <CustomSelect
            isDisabled={isProvincesLoading}
            placeholder="ناحیه"
            selectedKeys={
              filterState.province?.slug
                ? [String(filterState.province?.slug)]
                : []
            }
            onChange={(value) => {
              const selected = provinces?.find((c: any) => c.slug === value);
              if (selected) {
                const updatedFilterState = {
                  ...filterState,
                  province: {
                    title: selected.name,
                    slug: selected.slug,
                  },
                  city: { title: "", slug: "" },
                  area: { title: "", slug: "" },
                };
                setFilters(filterDispatch, updatedFilterState);
                handleFilters(updatedFilterState); // Pass the updated state
              }
            }}
            items={provinces || []}
            itemKey="slug"
            itemLabel="name"
            classNames="py-2"
          />
          <CustomSelect
            isDisabled={isCitiesLoading}
            placeholder="منطقه"
            selectedKeys={
              filterState.city?.slug !== ""
                ? [String(filterState.city?.slug)]
                : []
            }
            onChange={(value) => {
              const selected = cities?.find((c: any) => c.slug === value);
              if (selected) {
                const updatedFilterState = {
                  ...filterState,
                  city: {
                    title: selected.name,
                    slug: selected.slug,
                  },
                  area: { title: "", slug: "" },
                };
                setFilters(filterDispatch, updatedFilterState);
                handleFilters(updatedFilterState); // Pass the updated state
              }
            }}
            items={cities || []}
            itemKey="slug"
            itemLabel="name"
            classNames="py-2"
          />
          <CustomSelect
            isDisabled={isAreasLoading}
            placeholder="محله"
            selectedKeys={
              filterState.area?.slug !== ""
                ? [String(filterState.area?.slug)]
                : []
            }
            onChange={(value) => {
              const selected = areas?.find((c: any) => c.slug === value);
              if (selected) {
                const updatedFilterState = {
                  ...filterState,
                  area: {
                    title: selected.name,
                    slug: selected.slug,
                  },
                };
                setFilters(filterDispatch, updatedFilterState);
                handleFilters(updatedFilterState); // Pass the updated state
              }
            }}
            items={areas || []}
            itemKey="slug"
            itemLabel="name"
            classNames="py-2"
          />
        </div>
      </>
    );
  };

  return <>{renderFilters()}</>;
}
