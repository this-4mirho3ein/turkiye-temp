"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Tabs, Tab } from "@heroui/react";
import Card, { CardBody } from "@/components/admin/ui/Card";
import { FaGlobe, FaMapMarkedAlt, FaCity, FaMapPin } from "react-icons/fa";
import RegionsList from "./RegionsList";
import { Region } from "@/components/admin/data/regions";
import { useApi } from "@/hooks/useApi";
import {
  getAdminCountries,
  getAdminProvinces,
  getAdminCities,
  getAdminAreas,
} from "@/controllers/makeRequest";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Reduce stale time to make refreshes more responsive
      staleTime: 10 * 1000, // 10 seconds
    },
  },
});

// API Response type
interface ApiRegion {
  _id: string;
  name: string;
  slug: string;
  enName?: string;
  code?: string;
  phoneCode?: string;
  parent?: {
    _id?: string;
    id?: string | number;
    name: string;
  };
  [key: string]: any; // For any other properties
}

const fetchers = {
  "admin-countries": getAdminCountries,
  "admin-provinces": getAdminProvinces,
  "admin-cities": getAdminCities,
  "admin-areas": getAdminAreas,
};

// Helper function to create a more stable numeric ID from a string ID
const createNumericId = (stringId: string): number => {
  // Try to parse as integer first
  const parsed = parseInt(stringId);
  if (!isNaN(parsed)) {
    return parsed;
  }

  // If can't parse, create a hash code
  return Math.abs(
    stringId.split("").reduce((a, b, i) => {
      // Use char code and position for more unique hashing
      a = (a << 5) - a + b.charCodeAt(0) * (i + 1);
      return a & a;
    }, 0)
  );
};

// Inner component that uses React Query hooks
function RegionsPageClientInner() {
  const [selectedTab, setSelectedTab] = useState("countries");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const queryClient = useQueryClient();

  // Function to force refresh all data
  const refreshAllData = useCallback(async () => {
    console.log("🔄 Forcing refresh of all region data...");

    // Invalidate all region caches
    await queryClient.invalidateQueries({ queryKey: ["admin-countries"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-provinces"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-cities"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-areas"] });

    // Also try direct API calls with force refresh
    try {
      await getAdminCountries({ forceRefresh: true });
      await getAdminProvinces({ forceRefresh: true });
      await getAdminCities({ forceRefresh: true });
      await getAdminAreas({ forceRefresh: true });
    } catch (error) {
      console.error("Error during forced refresh:", error);
    }

    // Increment refresh trigger to cause re-render
    setRefreshTrigger((prev) => prev + 1);

    console.log("🔄 Refresh complete!");
  }, [queryClient]);

  // Fetch and cache all data on first load with useApi hook
  const {
    data: countriesData = [],
    isLoading: isCountriesLoading,
    error: countriesError,
    refetch: refetchCountries,
  } = useApi<ApiRegion[]>(
    "admin-countries",
    fetchers,
    { page: 1, limit: 100, forceRefresh: refreshTrigger > 0 },
    true
  );

  const {
    data: provincesData = [],
    isLoading: isProvincesLoading,
    error: provincesError,
    refetch: refetchProvinces,
  } = useApi<ApiRegion[]>(
    "admin-provinces",
    fetchers,
    { page: 1, limit: 100, forceRefresh: refreshTrigger > 0 },
    true
  );

  const {
    data: citiesData = [],
    isLoading: isCitiesLoading,
    error: citiesError,
    refetch: refetchCities,
  } = useApi<ApiRegion[]>(
    "admin-cities",
    fetchers,
    { page: 1, limit: 100, forceRefresh: refreshTrigger > 0 },
    true
  );

  const {
    data: areasData = [],
    isLoading: isAreasLoading,
    error: areasError,
    refetch: refetchAreas,
  } = useApi<ApiRegion[]>(
    "admin-areas",
    fetchers,
    { page: 1, limit: 100, forceRefresh: refreshTrigger > 0 },
    true
  );

  // Log any errors or data issues
  useEffect(() => {
    if (countriesError) {
      console.error("Error fetching countries:", countriesError);
    }
    if (provincesError) {
      console.error("Error fetching provinces:", provincesError);
    }
    if (citiesError) {
      console.error("Error fetching cities:", citiesError);
    }
    if (areasError) {
      console.error("Error fetching areas:", areasError);
    }

    // Log raw data for debugging
    console.log(
      `Raw countries data (refresh #${refreshTrigger}):`,
      countriesData?.length || 0,
      "items"
    );
    console.log(
      `Raw provinces data (refresh #${refreshTrigger}):`,
      provincesData?.length || 0,
      "items"
    );
    console.log(
      `Raw cities data (refresh #${refreshTrigger}):`,
      citiesData?.length || 0,
      "items"
    );
    console.log(
      `Raw areas data (refresh #${refreshTrigger}):`,
      areasData?.length || 0,
      "items"
    );
  }, [
    countriesData,
    provincesData,
    citiesData,
    areasData,
    countriesError,
    provincesError,
    citiesError,
    areasError,
    refreshTrigger,
  ]);

  // Convert API response to match Region interface
  const mapToRegions = (items: ApiRegion[] = [], type?: string): Region[] => {
    // Make sure items is actually an array
    if (!items || !Array.isArray(items)) {
      console.warn(`Invalid data for ${type}, expected array but got:`, items);
      return [];
    }

    console.log(
      `Mapping ${items.length} ${type || "items"} to Region interface...`
    );

    return items.map((item) => {
      try {
        if (!item || typeof item !== "object") {
          console.warn(`Invalid item in ${type} data:`, item);
          return {
            id: Math.floor(Math.random() * 10000),
            name: "Unknown",
            slug: "unknown",
          };
        }

        // Log a sample item to see its structure
        if (items.indexOf(item) === 0) {
          console.log(`Sample ${type} item structure:`, item);
        }

        // Try to extract ID - handle both string IDs and numeric IDs
        let id: number;

        // Store the original string ID for reference
        const originalId = item._id || item.id || "";

        if (item._id) {
          // For MongoDB ObjectIDs or other string IDs
          id = createNumericId(item._id);
          // Log ID conversion for debugging
          if (items.indexOf(item) === 0) {
            console.log(`ID conversion: "${item._id}" -> ${id}`);
          }
        } else if (item.id) {
          // For existing numeric IDs
          id = typeof item.id === "string" ? createNumericId(item.id) : item.id;
        } else {
          // Fallback to random ID
          id = Math.floor(Math.random() * 10000);
        }

        // Create base region object
        const region: Region = {
          id,
          name: item.name || "",
          slug: item.slug || "",
          originalId: originalId, // Store original ID for API operations
        };

        // Add English name for all region types if it exists
        if (item.enName) region.enName = item.enName;

        // For countries, add additional fields if they exist
        if (type === "countries") {
          if (item.code) region.code = item.code;
          if (item.phoneCode) region.phoneCode = item.phoneCode;
        }

        // Add parent if exists in API response
        if (item.parent) {
          let parentId: number;

          if (typeof item.parent === "object") {
            const parentOriginalId =
              item.parent._id || (item.parent as any).id || "";

            if (item.parent._id) {
              parentId = createNumericId(item.parent._id);
            } else if ("id" in item.parent && (item.parent as any).id) {
              parentId =
                typeof (item.parent as any).id === "string"
                  ? createNumericId((item.parent as any).id)
                  : (item.parent as any).id;
            } else {
              parentId = 0;
            }

            region.parent = {
              id: parentId,
              name: item.parent.name || "",
              originalId: parentOriginalId,
            };
          } else if (typeof item.parent === "string") {
            parentId = createNumericId(item.parent);
            region.parent = {
              id: parentId,
              name: "", // We don't have the name from a string reference
              originalId: item.parent,
            };
          }
        }

        return region;
      } catch (error) {
        console.error(`Error mapping ${type} item:`, error, item);
        // Return a default region to avoid breaking the UI
        return {
          id: Math.floor(Math.random() * 10000),
          name: item?.name || "Unknown",
          slug: item?.slug || "unknown",
        };
      }
    });
  };

  // Calculate the final data to use
  const mappedCountries = useMemo(() => {
    if (countriesData && countriesData.length > 0) {
      return mapToRegions(countriesData, "countries");
    }
    return [];
  }, [countriesData]);

  const mappedProvinces = useMemo(
    () => mapToRegions(provincesData, "provinces"),
    [provincesData]
  );

  const mappedCities = useMemo(
    () => mapToRegions(citiesData, "cities"),
    [citiesData]
  );

  const mappedAreas = useMemo(
    () => mapToRegions(areasData, "areas"),
    [areasData]
  );

  // Refetch all data when tab changes to ensure fresh data
  useEffect(() => {
    const refetchCurrentTabData = async () => {
      switch (selectedTab) {
        case "countries":
          await refetchCountries();
          break;
        case "provinces":
          await refetchProvinces();
          break;
        case "cities":
          await refetchCities();
          break;
        case "areas":
          await refetchAreas();
          break;
      }
    };

    refetchCurrentTabData();
  }, [
    selectedTab,
    refetchCountries,
    refetchProvinces,
    refetchCities,
    refetchAreas,
  ]);

  return (
    <Card>
      <CardBody className="p-0">
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          color="primary"
          variant="bordered"
          classNames={{
            base: "w-full",
            tabList: "p-0 bg-gray-50 border-b border-gray-200 rounded-t-lg",
            tab: "py-3 px-6",
          }}
        >
          <Tab
            key="countries"
            title={
              <div className="flex items-center gap-2">
                <FaGlobe />
                <span>کشورها</span>
              </div>
            }
          >
            <div className="p-6">
              <RegionsList
                type="countries"
                initialRegions={mappedCountries}
                parentRegions={[]}
                isLoading={isCountriesLoading}
                onDataChange={refreshAllData}
              />
              {!isCountriesLoading && mappedCountries.length === 0 && (
                <div className="text-center text-gray-500 mt-4"></div>
              )}
            </div>
          </Tab>
          <Tab
            key="provinces"
            title={
              <div className="flex items-center gap-2">
                <FaMapMarkedAlt />
                <span>استان‌ها</span>
              </div>
            }
          >
            <div className="p-6">
              <RegionsList
                type="provinces"
                initialRegions={mappedProvinces}
                parentRegions={mappedCountries}
                isLoading={isProvincesLoading}
                onDataChange={refreshAllData}
              />
              {!isProvincesLoading && mappedProvinces.length === 0 && (
                <div className="text-center text-gray-500 mt-4"></div>
              )}
            </div>
          </Tab>
          <Tab
            key="cities"
            title={
              <div className="flex items-center gap-2">
                <FaCity />
                <span>شهرها</span>
              </div>
            }
          >
            <div className="p-6">
              <RegionsList
                type="cities"
                initialRegions={mappedCities}
                parentRegions={mappedProvinces}
                isLoading={isCitiesLoading}
                onDataChange={refreshAllData}
              />
              {!isCitiesLoading && mappedCities.length === 0 && (
                <div className="text-center text-gray-500 mt-4"></div>
              )}
            </div>
          </Tab>
          <Tab
            key="areas"
            title={
              <div className="flex items-center gap-2">
                <FaMapPin />
                <span>محله‌ها</span>
              </div>
            }
          >
            <div className="p-6">
              <RegionsList
                type="areas"
                initialRegions={mappedAreas}
                parentRegions={mappedCities}
                isLoading={isAreasLoading}
                onDataChange={refreshAllData}
              />
              {!isAreasLoading && mappedAreas.length === 0 && (
                <div className="text-center text-gray-500 mt-4"></div>
              )}
            </div>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}

// Wrapper component that provides React Query context
export default function RegionsPageClient() {
  return (
    <QueryClientProvider client={queryClient}>
      <RegionsPageClientInner />
    </QueryClientProvider>
  );
}
