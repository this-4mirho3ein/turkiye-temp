"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Tabs, Tab, Checkbox, addToast } from "@heroui/react";
import Card, { CardBody } from "@/components/admin/ui/Card";
import {
  FaGlobe,
  FaMapMarkedAlt,
  FaCity,
  FaMapPin,
  FaFilter,
  FaSync,
} from "react-icons/fa";
import RegionsList from "./RegionsList";
import { Region } from "@/components/admin/data/regions";
import { useApi } from "@/hooks/useApi";
import {
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
  province?:
    | string
    | {
        _id: string;
        name: string;
        enName?: string;
        code?: string;
        [key: string]: any;
      }; // Can be ID or full object
  city?: { _id: string; name: string; enName?: string; [key: string]: any }; // Full object
  parent?: {
    _id?: string;
    id?: string | number;
    name: string;
  };
  isActive?: boolean;
  isDeleted?: boolean;
  [key: string]: any; // For any other properties
}

const fetchers = {
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
  const [selectedTab, setSelectedTab] = useState("provinces");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const queryClient = useQueryClient();
  const [showDeletedItems, setShowDeletedItems] = useState(false);

  // Function to force refresh all data
  const refreshAllData = useCallback(async () => {
    // Invalidate all region caches
    await queryClient.invalidateQueries({ queryKey: ["admin-provinces"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-cities"] });
    await queryClient.invalidateQueries({ queryKey: ["admin-areas"] });

    // Also try direct API calls with force refresh
    try {
      await getAdminProvinces({ forceRefresh: true });
      await getAdminCities({ forceRefresh: true });
      await getAdminAreas({ forceRefresh: true });
    } catch (error) {
      console.error("Error during forced refresh:", error);
    }

    // Increment refresh trigger to cause re-render
    setRefreshTrigger((prev) => prev + 1);
  }, [queryClient]);

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
    if (provincesError) {
      console.error("Error fetching provinces:", provincesError);
    }
    if (citiesError) {
      console.error("Error fetching cities:", citiesError);
    }
    if (areasError) {
      console.error("Error fetching areas:", areasError);
    }
  }, [
    provincesData,
    citiesData,
    areasData,
    provincesError,
    citiesError,
    areasError,
    refreshTrigger,
  ]);

  // Convert API response to match Region interface
  const mapToRegions = (items: ApiRegion[] = [], type?: string): Region[] => {
    return items.map((item) => {
      const result: Region = {
        id: createNumericId(item._id), // Create stable numeric ID
        name: item.name,
        slug: item.slug,
        originalId: item._id, // Store original string ID
        isDeleted: !!item.isDeleted, // Ensure boolean conversion with double negation
        enName: item.enName || "", // Add enName for all types
      };

      // Helper function to get parent name by ID
      const getParentNameById = (
        parentId: string,
        parentType: string
      ): string => {
        try {
          let parentData: ApiRegion[] = [];

          if (parentType === "provinces") {
            parentData = provincesData || [];
          } else if (parentType === "cities") {
            parentData = citiesData || [];
          }

          // Find parent by ID
          const parent = parentData.find((p) => p._id === parentId);
          return parent?.name || "";
        } catch (error) {
          console.error("Error getting parent name:", error);
          return "";
        }
      };

      if (type === "cities") {
        // For cities, the parent is the province object (full object included in response)
        if (item.province) {
          if (typeof item.province === "object" && item.province._id) {
            // Province is a full object
            result.parent = {
              id: createNumericId(item.province._id.toString()),
              name: item.province.name || "",
              originalId: item.province._id.toString(),
            };
          } else if (typeof item.province === "string") {
            // Province is just an ID, look it up
            const parentName = getParentNameById(
              item.province.toString(),
              "provinces"
            );
            result.parent = {
              id: createNumericId(item.province.toString()),
              name: parentName,
              originalId: item.province.toString(),
            };
          }
        }
      } else if (type === "areas") {
        // For areas, the parent is the city object
        if (item.city && item.city._id) {
          result.parent = {
            id: createNumericId(item.city._id.toString()),
            name: item.city.name || "",
            originalId: item.city._id.toString(),
          };
        }
      } else if (item.parent) {
        // Fallback for any other parent structure
        const parentId = item.parent.id || item.parent._id;
        if (parentId) {
          result.parent = {
            id: createNumericId(parentId.toString()),
            name: item.parent.name || "",
            originalId: parentId.toString(),
          };
        }
      }

      return result;
    });
  };


  const mappedProvinces = useMemo(
    () => mapToRegions(provincesData, "provinces"),
    [provincesData]
  );

  const mappedCities = useMemo(
    () => mapToRegions(citiesData, "cities"),
    [citiesData, provincesData]
  );

  const mappedAreas = useMemo(
    () => mapToRegions(areasData, "areas"),
    [areasData, citiesData]
  );

  // Refetch all data when tab changes to ensure fresh data
  useEffect(() => {
    const refetchCurrentTabData = async () => {
      switch (selectedTab) {
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
  }, [selectedTab, refetchProvinces, refetchCities, refetchAreas]);


  // For provinces
  const totalProvincesCount = provincesData.length;
  const activeProvincesCount = provincesData.filter(
    (item) => !item.isDeleted
  ).length;
  const deletedProvincesCount = provincesData.filter(
    (item) => item.isDeleted
  ).length;

  // For cities
  const totalCitiesCount = citiesData.length;
  const activeCitiesCount = citiesData.filter((item) => !item.isDeleted).length;
  const deletedCitiesCount = citiesData.filter((item) => item.isDeleted).length;

  // For areas
  const totalAreasCount = areasData.length;
  const activeAreasCount = areasData.filter((item) => !item.isDeleted).length;
  const deletedAreasCount = areasData.filter((item) => item.isDeleted).length;

  // Get the current tab stats
  const getCurrentTabStats = () => {
    switch (selectedTab) {
      case "provinces":
        return {
          total: totalProvincesCount,
          active: activeProvincesCount,
          deleted: deletedProvincesCount,
        };
      case "cities":
        return {
          total: totalCitiesCount,
          active: activeCitiesCount,
          deleted: deletedCitiesCount,
        };
      case "areas":
        return {
          total: totalAreasCount,
          active: activeAreasCount,
          deleted: deletedAreasCount,
        };
      default:
        return { total: 0, active: 0, deleted: 0 };
    }
  };

  const currentStats = getCurrentTabStats();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {/* Header with title and refresh button */}
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center">
            <FaMapMarkedAlt className="text-primary ml-3 text-xl" />
            <h1 className="text-xl md:text-2xl font-bold">مدیریت مناطق</h1>
          </div>
          <button
            onClick={refreshAllData}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
          >
            <FaSync className="text-primary" />
            <span className="hidden md:inline">به‌روزرسانی</span>
          </button>
        </div>

        {/* فیلترها */}
        <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-purple-500">
          <div className="font-bold text-gray-700 mb-3 flex items-center">
            <FaFilter className="ml-2 text-purple-500" />
            فیلترها
          </div>
          <div className="flex items-center">
            <Checkbox
              checked={showDeletedItems}
              onChange={(e) => setShowDeletedItems(e.target.checked)}
              className="ml-2 text-purple-500"
            />
            <label className="mb-0 text-sm cursor-pointer">
              نمایش موارد حذف شده
            </label>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
          className="bg-white rounded-lg shadow-sm p-4"
        >
        
          <Tab
            key="provinces"
            title={
              <div className="flex items-center gap-2">
                <FaMapMarkedAlt />
                <span>استان‌ها</span>
                {deletedProvincesCount > 0 && showDeletedItems && (
                  <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full">
                    {deletedProvincesCount}
                  </span>
                )}
              </div>
            }
          >
            <Card shadow="sm" className="mt-4">
              <CardBody>
                <RegionsList
                  type="provinces"
                  initialRegions={mappedProvinces}
                  parentRegions={[]}
                  isLoading={isProvincesLoading}
                  onDataChange={refreshAllData}
                  showDeletedItems={showDeletedItems}
                />
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="cities"
            title={
              <div className="flex items-center gap-2">
                <FaCity />
                <span>شهرها</span>
                {deletedCitiesCount > 0 && showDeletedItems && (
                  <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full">
                    {deletedCitiesCount}
                  </span>
                )}
              </div>
            }
          >
            <Card shadow="sm" className="mt-4">
              <CardBody>
                <RegionsList
                  type="cities"
                  initialRegions={mappedCities}
                  parentRegions={mappedProvinces}
                  isLoading={isCitiesLoading}
                  onDataChange={refreshAllData}
                  showDeletedItems={showDeletedItems}
                />
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="areas"
            title={
              <div className="flex items-center gap-2">
                <FaMapPin />
                <span>محله‌ها</span>
                {deletedAreasCount > 0 && showDeletedItems && (
                  <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full">
                    {deletedAreasCount}
                  </span>
                )}
              </div>
            }
          >
            <Card shadow="sm" className="mt-4">
              <CardBody>
                <RegionsList
                  type="areas"
                  initialRegions={mappedAreas}
                  parentRegions={mappedCities}
                  isLoading={isAreasLoading}
                  onDataChange={refreshAllData}
                  showDeletedItems={showDeletedItems}
                />
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
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
