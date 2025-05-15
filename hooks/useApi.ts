import { Fetchers } from "@/types/interfaces";
import { useQuery } from "@tanstack/react-query";

// Generic Fetch Hook with enhanced caching options
export const useApi = <T>(
  type: string, // Type of data to fetch
  fetchers: Fetchers<T>, // Fetcher functions from parent
  params?: any, // Dynamic query parameters
  enabled?: boolean, // Enable query conditionally
  options?: {
    staleTime?: number;
    cacheTime?: number;
    refetchOnWindowFocus?: boolean;
  }
) => {
  return useQuery<T>({
    queryKey: [type, params], // Ensure unique caching based on type and params
    queryFn: () => fetchers[type](params), // Call the appropriate API function with params
    enabled: enabled !== undefined ? enabled : !!params, // Use parent-provided enabled flag or default logic
    staleTime: options?.staleTime || 60 * 60 * 1000, // Cache for 1 hour by default
    gcTime: options?.cacheTime || 5 * 60 * 1000, // Keep cache for 5 minutes after becoming inactive by default
    refetchOnWindowFocus: options?.refetchOnWindowFocus || false, // Don't refetch on window focus by default
  });
};
