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
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaTag,
  FaMapMarkedAlt,
  FaCity,
  FaBuilding,
} from "react-icons/fa";
import { StatItem } from "../data/stats";
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
  onDataLoaded: (data: ReportData, stats: StatItem[]) => void;
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

  // Fetch all data using React Query with proper caching
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: () =>
      fetchers["admin-users"]({ page: 1, limit: 100, forceRefresh }),
    ...commonQueryOptions,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () =>
      fetchers["admin-categories"]({ page: 1, limit: 100, forceRefresh }),
    ...commonQueryOptions,
  });

  const { data: countries = [], isLoading: countriesLoading } = useQuery({
    queryKey: ["admin-countries"],
    queryFn: () =>
      fetchers["admin-countries"]({ page: 1, limit: 100, forceRefresh }),
    ...commonQueryOptions,
  });

  const { data: provinces = [], isLoading: provincesLoading } = useQuery({
    queryKey: ["admin-provinces"],
    queryFn: () =>
      fetchers["admin-provinces"]({ page: 1, limit: 100, forceRefresh }),
    ...commonQueryOptions,
  });

  const { data: cities = [], isLoading: citiesLoading } = useQuery({
    queryKey: ["admin-cities"],
    queryFn: () =>
      fetchers["admin-cities"]({ page: 1, limit: 100, forceRefresh }),
    ...commonQueryOptions,
  });

  const { data: areas = [], isLoading: areasLoading } = useQuery({
    queryKey: ["admin-areas"],
    queryFn: () =>
      fetchers["admin-areas"]({ page: 1, limit: 100, forceRefresh }),
    ...commonQueryOptions,
  });

  const { data: propertyTypes = [], isLoading: propertyTypesLoading } =
    useQuery({
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

    // Process users data
    const totalUsers = users.length;
    const activeUsers = users.filter((user: any) => !user.isDeleted).length;
    const deletedUsers = users.filter((user: any) => user.isDeleted).length;

    // Process categories data
    const totalCategories = categories.length;
    const activeCategories = categories.filter(
      (cat: any) => !cat.isDeleted
    ).length;
    const deletedCategories = categories.filter(
      (cat: any) => cat.isDeleted
    ).length;

    // Process regions data (combine countries, provinces, cities, areas)
    const allRegions = [...countries, ...provinces, ...cities, ...areas];
    const totalRegions = allRegions.length;
    const activeRegions = allRegions.filter(
      (region: any) => !region.isDeleted
    ).length;
    const deletedRegions = allRegions.filter(
      (region: any) => region.isDeleted
    ).length;

    // Process property types data
    const totalPropertyTypes = propertyTypes.length;
    const activePropertyTypes = propertyTypes.filter(
      (type: any) => !type.isDeleted
    ).length;
    const deletedPropertyTypes = propertyTypes.filter(
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

    // Create stats items for display
    const stats: StatItem[] = [
      {
        title: "موارد حذف شده",
        value: (
          deletedUsers +
          deletedCategories +
          deletedRegions +
          deletedPropertyTypes
        ).toLocaleString("fa-IR"),
        change: "+۵%",
        trend: "up",
        icon: FaUserTimes,
        color: "danger",
      },
      {
        title: "موارد فعال",
        value: (
          activeUsers +
          activeCategories +
          activeRegions +
          activePropertyTypes
        ).toLocaleString("fa-IR"),
        change: "+۸%",
        trend: "up",
        icon: FaUserCheck,
        color: "success",
      },
      {
        title: "کل کاربران",
        value: totalUsers.toLocaleString("fa-IR"),
        change: "+۳%",
        trend: "up",
        icon: FaUsers,
        color: "secondary",
      },
      {
        title: "کل دسته‌بندی‌ها",
        value: totalCategories.toLocaleString("fa-IR"),
        change: "+۲%",
        trend: "up",
        icon: FaTag,
        color: "primary",
      },
      {
        title: "کل مناطق",
        value: totalRegions.toLocaleString("fa-IR"),
        change: "+۴%",
        trend: "up",
        icon: FaMapMarkedAlt,
        color: "warning",
      },
      {
        title: "انواع ملک",
        value: totalPropertyTypes.toLocaleString("fa-IR"),
        change: "+۰%",
        trend: "up",
        icon: FaBuilding,
        color: "primary",
      },
    ];

    // Pass the data to the parent component
    onDataLoaded(reportData, stats);
  }, [
    users,
    categories,
    countries,
    provinces,
    cities,
    areas,
    propertyTypes,
    isLoading,
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
