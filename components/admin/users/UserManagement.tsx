"use client";

import { useState, useEffect } from "react";
import UsersList from "./UsersList";
import { User, UserRole } from "../data/users";
import { getAdminUsers } from "@/controllers/makeRequest";
import { useApi } from "@/hooks/useApi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Checkbox } from "@heroui/react";
import {
  FaSync,
  FaFilter,
  FaUsers,
  FaExclamationTriangle,
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
  const fetchers = {
    "admin-users": getAdminUsers,
  };

  // Fetch users with React Query
  const {
    data: apiUsers = [],
    isLoading,
    error,
    refetch: refetchUsers,
  } = useApi<ApiUser[]>(
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
    if (apiUsers && apiUsers.length > 0) {
      const mappedUsers = mapToUsers(apiUsers);
      setUsers(mappedUsers);
    }
  }, [apiUsers]);

  // Handle errors
  useEffect(() => {
    if (error) {
      console.error("Error fetching users:", error);
      setHasErrorOccurred(true);
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
        <Button
          variant="solid"
          color="primary"
          startContent={<FaSync className={isLoading ? "animate-spin" : ""} />}
          onPress={refreshAllData}
          isDisabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "در حال بروزرسانی..." : "بروزرسانی"}
        </Button>
      </div>

      {/* Filters */}
      <Card shadow="sm">
        <CardBody className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-500" />
            <span className="font-medium text-gray-700">فیلترها</span>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="show-deleted"
              checked={showDeletedItems}
              onChange={(e) => setShowDeletedItems(e.target.checked)}
            />
            <label
              htmlFor="show-deleted"
              className="text-sm font-medium cursor-pointer"
            >
              نمایش کاربران حذف شده
            </label>
          </div>
        </CardBody>
      </Card>

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
