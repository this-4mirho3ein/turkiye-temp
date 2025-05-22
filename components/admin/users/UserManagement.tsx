"use client";

import { useState, useEffect } from "react";
import UsersList from "./UsersList";
import UserFilters, { UserFilterOptions } from "./UserFilters";
import { User, UserRole } from "../data/users";
import { getAdminUsers } from "@/controllers/makeRequest";
import { useApi } from "@/hooks/useApi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Checkbox, addToast } from "@heroui/react";
import {
  FaSync,
  FaFilter,
  FaUsers,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import Button from "../ui/Button";
import Card, { CardBody } from "../ui/Card";

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000, // 10 seconds
    },
  },
});

interface UserManagementProps {
  initialUsers: User[];
}

// API User type based on the response structure
interface ApiUser {
  _id: string;
  phone: string;
  countryCode: string;
  roles: string[];
  isActive: boolean;
  isBanned: boolean;
  isCompleteProfile: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  gender?: string;
  nationalCode?: string;
  agency?: string;
  displayMobile?: boolean;
  displayEmail?: boolean;
  // Add other fields as needed
}

// API response structure
interface ApiResponse {
  status?: number;
  data?: ApiUser[] | any;
  message?: string;
  success?: boolean;
}

// API error type
interface ApiError extends Error {
  response?: {
    status: number;
    statusText: string;
    data: any;
    headers: any;
  };
}

// Inner component that uses the API
function UserManagementInner({ initialUsers }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [hasErrorOccurred, setHasErrorOccurred] = useState(false);
  const [activeFilters, setActiveFilters] = useState<UserFilterOptions>({});
  const [searchTerm, setSearchTerm] = useState("");

  // Function to force refresh all data
  const refreshAllData = () => {
    console.log("🔄 Forcing refresh of user data...");
    setRefreshTrigger((prev) => prev + 1);
    setHasErrorOccurred(false); // Reset error state on refresh
  };

  // Setup API fetchers
  interface Fetchers {
    [key: string]: (params?: any) => Promise<any>;
  }

  const fetchers: Fetchers = {
    "admin-users": getAdminUsers as (params?: any) => Promise<ApiResponse>,
  };

  // Fetch users with React Query
  const {
    data: apiUsers,
    isLoading,
    error,
    refetch: refetchUsers,
  } = useApi<ApiResponse>(
    "admin-users",
    fetchers,
    {
      page: 1,
      limit: 100,
      forceRefresh: refreshTrigger > 0,
      // Add filter parameters
      ...(activeFilters.roles && { roles: activeFilters.roles.join(",") }),
      ...(activeFilters.isActive !== undefined && {
        isActive: activeFilters.isActive,
      }),
      ...(activeFilters.isBanned !== undefined && {
        isBanned: activeFilters.isBanned,
      }),
      ...(activeFilters.isProfileComplete !== undefined && {
        isProfileComplete: activeFilters.isProfileComplete,
      }),
      ...(activeFilters.searchTerm && { search: activeFilters.searchTerm }),
    },
    true
  );
  
  // Log the current filter parameters being sent to the API
  useEffect(() => {
    console.log("Current API filter parameters:", {
      roles: activeFilters.roles?.join(","),
      isActive: activeFilters.isActive,
      isBanned: activeFilters.isBanned,
      isProfileComplete: activeFilters.isProfileComplete,
      search: activeFilters.searchTerm,
    });
    
    // When filters change, force a refresh to get new filtered data from API
    if (Object.keys(activeFilters).length > 0) {
      console.log("Filters changed, refreshing data...");
      refetchUsers();
    }
  }, [activeFilters, refetchUsers]);

  // Function to map API users to our app's User interface
  const mapToUsers = (apiUsers: ApiUser[]): User[] => {
    if (!apiUsers || !Array.isArray(apiUsers)) {
      console.warn("Invalid users data, expected array:", apiUsers);
      return [];
    }
    
    // If the array is empty and we have filters applied, return an empty array
    // This will trigger the empty state UI
    if (apiUsers.length === 0) {
      console.log("No users found matching the current filters");
      return [];
    }

    return apiUsers.map((user) => {
      // Generate a numeric ID from the string ID
      const id =
        parseInt(user._id.substring(user._id.length - 6), 16) ||
        Math.floor(Math.random() * 10000);

      // Extract name
      const name =
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.phone;

      // Map API role to our UserRole type
      let role: UserRole = "normal"; // Default role
      if (user.roles && user.roles.length > 0) {
        // Find the first role that matches our UserRole type
        const foundRole = user.roles.find(
          (r) => r === "admin" || r === "agency" || r === "consultant"
        );

        if (foundRole) {
          role = foundRole as UserRole;
        } else if (user.roles.includes("customer")) {
          role = "normal"; // Map "customer" to "normal"
        }
      }

      // Convert to our app's User format
      return {
        id,
        name,
        email: user.email || "",
        phone: user.phone || "",
        role,
        status: user.isActive ? "active" : "inactive",
        createdAt: new Date(user.createdAt)
          .toLocaleDateString("fa-IR")
          .replace(/\//g, "/"),
        originalId: user._id, // Keep original ID for API calls
        isDeleted: user.isDeleted || false, // Add isDeleted flag with default
        displayMobile: user.displayMobile !== undefined ? user.displayMobile : true,
        displayEmail: user.displayEmail !== undefined ? user.displayEmail : true,
      };
    });
  };

  // Update users when API data changes
  useEffect(() => {
    if (apiUsers) {
      console.log("Raw API response:", apiUsers);

      // Based on the exact response structure you provided
      // We know that data is in apiUsers.data.data
      let usersList: ApiUser[] = [];
      let hasData = false;

      // Check if we have the expected response structure
      if (
        apiUsers.data && 
        typeof apiUsers.data === "object" && 
        apiUsers.data.data && 
        Array.isArray(apiUsers.data.data)
      ) {
        // This is the expected structure: response.data.data[]
        usersList = apiUsers.data.data;
        hasData = usersList.length > 0;
        console.log(`Found ${usersList.length} users in response.data.data array`);
        
        if (usersList.length === 0 && Object.keys(activeFilters).length > 0) {
          console.log("No users found matching the current filters");
        }
      } else if (apiUsers.data && Array.isArray(apiUsers.data)) {
        // Fallback for direct data array
        usersList = apiUsers.data;
        hasData = usersList.length > 0;
        console.log(`Found ${usersList.length} users in response.data array`);
      } else if (Array.isArray(apiUsers)) {
        // Fallback for direct array response
        usersList = apiUsers as unknown as ApiUser[];
        hasData = usersList.length > 0;
        console.log(`Found ${usersList.length} users in direct response array`);
      } else {
        console.warn("Unexpected response structure:", apiUsers);
      }

      // Map users to our format only if we have data
      const mappedUsers = hasData ? mapToUsers(usersList) : [];
      
      // Always update the users state, even if empty
      // This ensures we show the empty state when filters return no results
      setUsers(mappedUsers);
      setHasErrorOccurred(false);

      if (hasData) {
        console.log(`✅ Successfully loaded ${mappedUsers.length} users from API`);
        
        // Only show success toast if we actually have data
        addToast({
          title: "بارگذاری موفق",
          description: `${mappedUsers.length} کاربر با موفقیت بارگذاری شد`,
          color: "success",
          icon: <FaCheck />,
          timeout: 3000,
        });
      }
    }
  }, [apiUsers, activeFilters]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching users:", error);
      setHasErrorOccurred(true);

      // Check for authentication error (401)
      const apiError = error as ApiError;
      const isAuthError = apiError.response?.status === 401;

      addToast({
        title: isAuthError ? "خطای احراز هویت" : "خطا در بارگذاری",
        description: isAuthError
          ? "عدم دسترسی به API. لطفاً مجدداً وارد سیستم شوید."
          : "خطا در بارگذاری اطلاعات کاربران. لطفاً مجدداً تلاش کنید.",
        color: "danger",
        icon: <FaExclamationTriangle />,
        timeout: 5000,
      });

      // Log detailed error information for debugging
      if (apiError.response) {
        console.error("API Error Response:", {
          status: apiError.response.status,
          statusText: apiError.response.statusText,
          data: apiError.response.data,
          headers: apiError.response.headers,
        });
      }
    }
  }, [error]);

  // Check if we have users from API response based on the exact structure
  // We know the response is: { data: { data: [] } }
  const hasApiUsers = apiUsers && 
    apiUsers.data && 
    apiUsers.data.data && 
    Array.isArray(apiUsers.data.data) && 
    apiUsers.data.data.length > 0;
  
  // If filters are applied and API returned empty results in data.data array
  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const noMatchingUsers = hasActiveFilters && 
    apiUsers && 
    apiUsers.data && 
    apiUsers.data.data && 
    Array.isArray(apiUsers.data.data) && 
    apiUsers.data.data.length === 0 && 
    !isLoading;
  
  // Filter users based on deleted status
  const allUsers = users.length > 0 ? users : initialUsers;

  // Filter users for display based on the showDeleted filter
  const displayUsers = activeFilters.showDeleted
    ? allUsers
    : allUsers.filter((user) => !user.isDeleted);

  // Check if we should display "No users found" message
  const shouldShowEmptyState =
    !isLoading && displayUsers.length === 0 && !hasErrorOccurred;

  return (
    <div className="space-y-6">
      {/* Header with title and refresh button */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center">
          <FaUsers className="text-primary ml-3 text-xl" />
          <h1 className="text-xl md:text-2xl font-bold">مدیریت کاربران</h1>
        </div>
        <button
          onClick={refreshAllData}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
          disabled={isLoading}
        >
          <FaSync
            className={`text-primary ${isLoading ? "animate-spin" : ""}`}
          />
          <span className="hidden md:inline">
            {isLoading ? "در حال بروزرسانی..." : "به‌روزرسانی"}
          </span>
        </button>
      </div>

      {/* فیلترهای پیشرفته */}
      <UserFilters
        onApplyFilters={(filters) => {
          setActiveFilters(filters);
          setRefreshTrigger((prev) => prev + 1);
        }}
        onResetFilters={() => {
          setActiveFilters({});
          setRefreshTrigger((prev) => prev + 1);
        }}
        isLoading={isLoading}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* No matching users message */}
      {noMatchingUsers && (
        <Card shadow="sm">
          <CardBody>
            <div className="py-8 flex flex-col items-center justify-center text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <FaExclamationTriangle className="text-yellow-500 text-3xl" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                کاربری با فیلترهای انتخاب شده یافت نشد
              </h3>
              <p className="text-gray-500 mb-4">
                لطفاً فیلترهای خود را تغییر دهید یا برای مشاهده همه کاربران، فیلترها را پاک کنید.
              </p>
              <Button
                size="md"
                color="primary"
                variant="solid"
                onPress={() => {
                  setActiveFilters({});
                  setRefreshTrigger((prev) => prev + 1);
                }}
                startContent={<FaTimes className="ml-1" />}
              >
                پاک کردن فیلترها
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Users List - Only show if we don't have the no matching users message */}
      {!noMatchingUsers && (
        <Card shadow="sm">
          <CardBody>
            <UsersList
              initialUsers={displayUsers}
              isLoading={isLoading}
              refetchUsers={refetchUsers}
              showEmptyState={shouldShowEmptyState}
              searchTerm={searchTerm}
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
}

export default function UserManagement({ initialUsers }: UserManagementProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <UserManagementInner initialUsers={initialUsers} />
    </QueryClientProvider>
  );
}
