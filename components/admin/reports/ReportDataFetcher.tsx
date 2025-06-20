"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import {
  getAdminUsers,
  getAdminCategories,
  getAdminCountries,
  getAdminProvinces,
  getAdminCities,
  getAdminAreas,
  getAdminPropertyTypes,
} from "@/controllers/makeRequest";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Interface for the fetched data structure
export interface ReportData {
  users: {
    total: number;
    active: number;
    deleted: number;
  };
  categories: {
    total: number;
    active: number;
    deleted: number;
  };
  regions: {
    total: number;
    active: number;
    deleted: number;
  };
  propertyTypes: {
    total: number;
    active: number;
    deleted: number;
  };
}

interface ReportDataFetcherProps {
  onDataLoaded: (data: ReportData) => void;
  forceRefresh: boolean;
}

export default function ReportDataFetcher({
  onDataLoaded,
  forceRefresh,
}: ReportDataFetcherProps) {
  const queryClient = useQueryClient();

  // Define fetchers for all needed data
  const fetchers = {
    "admin-users": getAdminUsers,
    "admin-categories": getAdminCategories,
    "admin-countries": getAdminCountries,
    "admin-provinces": getAdminProvinces,
    "admin-cities": getAdminCities,
    "admin-areas": getAdminAreas,
    "admin-property-types": getAdminPropertyTypes,
  };

  // Common query options to reduce refetching
  const commonQueryOptions = {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (previously cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  };

  // Define proper interfaces for our API responses
  interface ApiResponseData {
    data?: any[] | { data?: any[] };
    [key: string]: any;
  }

  // Fetch all data using React Query with proper caching
  const { data: users = [], isLoading: usersLoading } = useQuery<
    any[] | ApiResponseData
  >({
    queryKey: ["admin-users"],
    queryFn: () =>
      fetchers["admin-users"]({ page: 1, limit: 100, forceRefresh }),
    ...commonQueryOptions,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    any[] | ApiResponseData
  >({
    queryKey: ["admin-categories"],
    queryFn: () =>
      fetchers["admin-categories"]({ page: 1, limit: 100, forceRefresh }),
    ...commonQueryOptions,
  });

  const { data: countries = [], isLoading: countriesLoading } = useQuery<
    any[] | ApiResponseData
  >({
    queryKey: ["admin-countries"],
    queryFn: () =>
      fetchers["admin-countries"]({ page: 1, limit: 100, forceRefresh }),
    ...commonQueryOptions,
  });

  const { data: provinces = [], isLoading: provincesLoading } = useQuery<
    any[] | ApiResponseData
  >({
    queryKey: ["admin-provinces"],
    queryFn: () =>
      fetchers["admin-provinces"]({ page: 1, limit: 100, forceRefresh }),
    ...commonQueryOptions,
  });

  const { data: cities = [], isLoading: citiesLoading } = useQuery<
    any[] | ApiResponseData
  >({
    queryKey: ["admin-cities"],
    queryFn: () =>
      fetchers["admin-cities"]({ page: 1, limit: 100, forceRefresh }),
    ...commonQueryOptions,
  });

  const { data: areas = [], isLoading: areasLoading } = useQuery<
    any[] | ApiResponseData
  >({
    queryKey: ["admin-areas"],
    queryFn: () =>
      fetchers["admin-areas"]({ page: 1, limit: 100, forceRefresh }),
    ...commonQueryOptions,
  });

  const { data: propertyTypes = [], isLoading: propertyTypesLoading } =
    useQuery<any[] | ApiResponseData>({
      queryKey: ["admin-property-types"],
      queryFn: () =>
        fetchers["admin-property-types"]({ page: 1, limit: 100, forceRefresh }),
      ...commonQueryOptions,
    });

  // Monitor loading states
  const isLoading =
    usersLoading ||
    categoriesLoading ||
    countriesLoading ||
    provincesLoading ||
    citiesLoading ||
    areasLoading ||
    propertyTypesLoading;

  useEffect(() => {
    if (isLoading) return;

    // Helper function to safely extract array data from potentially nested responses
    const extractArray = (data: any): any[] => {
      if (Array.isArray(data)) {
        return data;
      }

      if (data && typeof data === "object") {
        if (data.data && Array.isArray(data.data)) {
          return data.data;
        }

        if (
          data.data &&
          typeof data.data === "object" &&
          data.data.data &&
          Array.isArray(data.data.data)
        ) {
          return data.data.data;
        }
      }

      console.warn("Unexpected data structure:", data);
      return [];
    };

    // Extract arrays using the helper function
    const usersArray = extractArray(users);
    const categoriesArray = extractArray(categories);
    const countriesArray = extractArray(countries);
    const provincesArray = extractArray(provinces);
    const citiesArray = extractArray(cities);
    const areasArray = extractArray(areas);
    const propertyTypesArray = extractArray(propertyTypes);

    // Process users data
    const totalUsers = usersArray.length;
    const activeUsers = usersArray.filter(
      (user: any) => !user.isDeleted
    ).length;
    const deletedUsers = usersArray.filter(
      (user: any) => user.isDeleted
    ).length;

    // Process categories data
    const totalCategories = categoriesArray.length;
    const activeCategories = categoriesArray.filter(
      (cat: any) => !cat.isDeleted
    ).length;
    const deletedCategories = categoriesArray.filter(
      (cat: any) => cat.isDeleted
    ).length;

    // Process regions data (combine countries, provinces, cities, areas)
    const allRegions = [
      ...countriesArray,
      ...provincesArray,
      ...citiesArray,
      ...areasArray,
    ];
    const totalRegions = allRegions.length;
    const activeRegions = allRegions.filter(
      (region: any) => !region.isDeleted
    ).length;
    const deletedRegions = allRegions.filter(
      (region: any) => region.isDeleted
    ).length;

    // Process property types data
    const totalPropertyTypes = propertyTypesArray.length;
    const activePropertyTypes = propertyTypesArray.filter(
      (type: any) => !type.isDeleted
    ).length;
    const deletedPropertyTypes = propertyTypesArray.filter(
      (type: any) => type.isDeleted
    ).length;

    // Create the report data object
    const reportData: ReportData = {
      users: {
        total: totalUsers,
        active: activeUsers,
        deleted: deletedUsers,
      },
      categories: {
        total: totalCategories,
        active: activeCategories,
        deleted: deletedCategories,
      },
      regions: {
        total: totalRegions,
        active: activeRegions,
        deleted: deletedRegions,
      },
      propertyTypes: {
        total: totalPropertyTypes,
        active: activePropertyTypes,
        deleted: deletedPropertyTypes,
      },
    };

    // Pass the data to the parent component
    onDataLoaded(reportData);
  }, [
    users,
    categories,
    countries,
    provinces,
    cities,
    areas,
    propertyTypes,
    isLoading,
    onDataLoaded,
  ]);

  // Handle forced refresh
  useEffect(() => {
    if (forceRefresh) {
      // Invalidate all queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      queryClient.invalidateQueries({ queryKey: ["admin-countries"] });
      queryClient.invalidateQueries({ queryKey: ["admin-provinces"] });
      queryClient.invalidateQueries({ queryKey: ["admin-cities"] });
      queryClient.invalidateQueries({ queryKey: ["admin-areas"] });
      queryClient.invalidateQueries({ queryKey: ["admin-property-types"] });
    }
  }, [forceRefresh, queryClient]);

  // This component doesn't render anything, it just fetches data
  return null;
}
