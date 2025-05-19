"use client";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";
import { FaKey, FaHome } from "react-icons/fa";
import { Tabs, Tab } from "@heroui/react";
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
import MainSearch from "../Filter/MainSearch";
import { setFilters, useFilters } from "@/context/AuthContext";
import { properties } from "@/utils/datas";

const fetchers = {
  countries: getCountries,
  provinces: getProvinces,
  cities: getCities,
  areas: getAreas,
  categories: getCategories,
};

export default function MainFilter() {
  const { filterState, filterDispatch } = useFilters();
  const router = useRouter();
  const isMdScreenOrLarger = useMediaQuery({ minWidth: 768 });
  const isMobile = useMediaQuery({ maxWidth: 768 });

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

  const handleFilters = async () => {
    let url = `${filterState.transactionType?.slug || "sale"}-${
      filterState.propertyType?.slug || "housing"
    }${filterState.category?.slug ? `-${filterState.category.slug}` : ""}/${
      filterState.city?.slug
        ? filterState.city.slug
        : filterState.province?.slug
        ? filterState.province.slug + "-province"
        : filterState.country?.slug
        ? filterState.country.slug + "-country"
        : countries?.results[0]?.slug + "-country"
    }${filterState.area?.slug ? `/${filterState.area.slug}` : ""}`;
    router.push(`${url}`);
  };
  useEffect(() => {
    setFilters(filterDispatch, {
      ...filterState,
      province: { title: "", slug: "" },
      city: { title: "", slug: "" },
      area: { title: "", slug: "" },
    });
  }, [filterState.country?.slug]);

  useEffect(() => {
    setFilters(filterDispatch, {
      ...filterState,
      city: { title: "", slug: "" },
      area: { title: "", slug: "" },
    });
  }, [filterState.province?.slug]);

  useEffect(() => {
    setFilters(filterDispatch, {
      ...filterState,
      area: { title: "", slug: "" },
    });
  }, [filterState.city?.slug]);

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

  const renderFilters = () => {
    return (
      <div className="max-w-[900px] mx-auto">
        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-center rounded-lg p-4 bg-primary md:px-5">
          <Tabs
            isVertical={isMdScreenOrLarger}
            className="flex flex-col md:flex-row rounded-lg p-1 justify-center w-full md:w-auto"
            color="primary"
            selectedKey={filterState.transactionType?.slug}
            onSelectionChange={(key) => {
              setFilters(filterDispatch, {
                ...filterState,
                transactionType: {
                  title: key === "sale" ? "فروش" : "اجاره",
                  slug: key as string,
                },
              });
            }}
          >
            <Tab
              key="sale"
              title={
                <div className="flex items-center space-x-2">
                  <FaHome className="ml-2" />
                  <span>فروش</span>
                </div>
              }
              className="w-full md:w-auto"
            />
            <Tab
              key="rent"
              title={
                <div className="flex items-center space-x-2">
                  <FaKey className="ml-2" />
                  <span>اجاره</span>
                </div>
              }
              className="w-full md:w-auto"
            />
          </Tabs>

          <div className="flex flex-col flex-auto w-full md:w-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full justify-items-center">
              {isMobile && (
                <CustomSelect
                  isDisabled={false}
                  placeholder="کاربری"
                  selectedKeys={
                    filterState.propertyType?.slug !== ""
                      ? [String(filterState.propertyType?.slug)]
                      : []
                  }
                  onChange={(value) => {
                    const selected = properties?.find(
                      (c: any) => c.slug === value
                    );
                    if (selected) {
                      setFilters(filterDispatch, {
                        ...filterState,
                        propertyType: {
                          title: selected.title,
                          slug: selected.slug,
                        },
                      });
                    }
                  }}
                  items={properties || []}
                  itemKey="slug"
                  itemLabel="title"
                />
              )}
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
                  if (selected) {
                    setFilters(filterDispatch, {
                      ...filterState,
                      category: {
                        title: selected.title,
                        slug: selected.slug,
                      },
                    });
                  }
                }}
                items={
                  categories?.[filterState.transactionType?.slug]?.subgroup ||
                  []
                }
                itemKey="slug"
                itemLabel="title"
              />
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
                    setFilters(filterDispatch, {
                      ...filterState,
                      country: {
                        title: selectedCountry.name,
                        slug: selectedCountry.slug,
                      },
                    });
                  }
                }}
                items={countries?.results || []}
                itemKey="slug"
                itemLabel="name"
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
                  const selected = provinces?.find(
                    (c: any) => c.slug === value
                  );

                  if (selected) {
                    setFilters(filterDispatch, {
                      ...filterState,
                      province: {
                        title: selected.name,
                        slug: selected.slug,
                      },
                    });
                  }
                }}
                items={provinces || []}
                itemKey="slug"
                itemLabel="name"
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
                    setFilters(filterDispatch, {
                      ...filterState,
                      city: {
                        title: selected.name,
                        slug: selected.slug,
                      },
                    });
                  }
                }}
                items={cities || []}
                itemKey="slug"
                itemLabel="name"
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
                    setFilters(filterDispatch, {
                      ...filterState,
                      area: {
                        title: selected.name,
                        slug: selected.slug,
                      },
                    });
                  }
                }}
                items={areas || []}
                itemKey="slug"
                itemLabel="name"
              />
            </div>

            {!isMobile && (
              <div className="flex flex-col flex-auto md:flex-row items-center gap-4 mt-4 px-auto">
                {/* فیلد جستجو */}
                <div className="relative w-full md:flex-1">
                  <MainSearch />
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                  <button
                    onClick={() => handleFilters()}
                    className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    اعمال فیلتر
                  </button>
                </div>
              </div>
            )}
            {isMobile && (
              <div className="flex flex-col flex-auto md:flex-row items-center gap-4 mt-4 px-auto">
                <div className="flex gap-4 w-full md:w-auto">
                  <button
                    onClick={() => handleFilters()}
                    className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    اعمال فیلتر
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-primary-light text-white px-8 py-24 shadow-lg text-center flex flex-col w-full">
      <h2 className="text-2xl font-bold mb-4">ملک ایده‌آل خود را پیدا کنید</h2>
      {isMobile ? (
        <>
          <div className="flex flex-col flex-auto md:flex-row items-center gap-4 mt-4 px-auto pb-2">
            {/* فیلد جستجو */}
            <div className="relative w-full md:flex-1">
              <MainSearch />
            </div>
          </div>
          {renderFilters()}
        </>
      ) : (
        <Tabs
          className="flex flex-wrap justify-center rounded-lg p-1"
          color="primary"
          selectedKey={filterState.propertyType?.slug}
          onSelectionChange={(key) => {
            const selected = properties?.find((c: any) => c.slug === key);
            if (selected) {
              setFilters(filterDispatch, {
                propertyType: {
                  title: selected.title,
                  slug: selected.slug,
                },
              });
            }
          }}
        >
          {properties.map((property) => (
            <Tab
              key={property.slug}
              title={
                <div className="flex items-center space-x-2">
                  {property.icon}
                  <span>{property.title}</span>
                </div>
              }
              className="w-full md:w-auto"
            >
              {renderFilters()}
            </Tab>
          ))}
        </Tabs>
      )}
    </div>
  );
}
