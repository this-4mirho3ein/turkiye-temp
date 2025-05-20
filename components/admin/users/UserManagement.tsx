"use client";

import { useState, useEffect } from "react";
import UsersList from "./UsersList";
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
  const [showDeletedItems, setShowDeletedItems] = useState(false);
  const [hasErrorOccurred, setHasErrorOccurred] = useState(false);

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
    },
    true
  );

  // Function to map API users to our app's User interface
  const mapToUsers = (apiUsers: ApiUser[]): User[] => {
    if (!apiUsers || !Array.isArray(apiUsers)) {
      console.warn("Invalid users data, expected array:", apiUsers);
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
      };
    });
  };

  // Update users when API data changes
  useEffect(() => {
    if (apiUsers) {
      console.log("Raw API response:", apiUsers);

      // Check for new response structure
      let usersList: ApiUser[] = [];

      // Handle different possible response structures
      if (apiUsers.data && Array.isArray(apiUsers.data)) {
        // The data is directly in apiUsers.data array
        usersList = apiUsers.data;
        console.log("Found users in apiUsers.data array:", usersList.length);
      } else if (
        apiUsers.data &&
        typeof apiUsers.data === "object" &&
        apiUsers.data.data &&
        Array.isArray(apiUsers.data.data)
      ) {
        // The data is nested in apiUsers.data.data array
        usersList = apiUsers.data.data;
        console.log(
          "Found users in apiUsers.data.data array:",
          usersList.length
        );
      } else if (Array.isArray(apiUsers)) {
        // The data is directly in apiUsers array
        usersList = apiUsers as unknown as ApiUser[];
        console.log("Found users in apiUsers array:", usersList.length);
      } else {
        console.warn("Unexpected users response structure:", apiUsers);
      }

      if (usersList && usersList.length > 0) {
        const mappedUsers = mapToUsers(usersList);
        setUsers(mappedUsers);

        // Show success toast for testing purposes
        addToast({
          title: "بارگذاری موفق",
          description: `${mappedUsers.length} کاربر با موفقیت بارگذاری شد`,
          color: "success",
          icon: <FaCheck />,
          timeout: 3000,
        });

        console.log(
          `✅ Successfully loaded ${mappedUsers.length} users from API`
        );
      }
    }
  }, [apiUsers]);

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

  // Filter users based on deleted status
  // Always include all users in the data, but filter for display based on checkbox
  const allUsers = users.length > 0 ? users : initialUsers;

  // Filter users for display based on the checkbox state
  const displayUsers = showDeletedItems
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

      {/* فیلترها */}
      <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-purple-500">
        <div className="font-bold text-gray-700 mb-3 flex items-center">
          <FaFilter className="ml-2 text-purple-500" />
          فیلترها
        </div>
        <div className="flex items-center">
          <Checkbox
            id="show-deleted"
            checked={showDeletedItems}
            onChange={(e) => setShowDeletedItems(e.target.checked)}
            className="ml-2 text-purple-500"
          />
          <label htmlFor="show-deleted" className="mb-0 text-sm cursor-pointer">
            نمایش کاربران حذف شده
          </label>
        </div>
      </div>

      {/* Users List */}
      <Card shadow="sm">
        <CardBody>
          <UsersList
            initialUsers={displayUsers}
            isLoading={isLoading}
            refetchUsers={refetchUsers}
            showEmptyState={shouldShowEmptyState}
          />
        </CardBody>
      </Card>
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
