"use server";

import users, { User, UserRole, roleGroups, RoleGroup, Role } from "./users";
import { getAdminUsers } from "@/controllers/makeRequest";
import { cookies } from "next/headers";
import axios from "axios";
import mainConfig from "@/configs/mainConfig";

// Server action to fetch all users
export async function getUsers(): Promise<User[]> {
  try {
    // For server component, we might not have access to localStorage
    // So either use cookies or directly make the API call
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    let apiUsers = [];

    if (token) {
      // Option 1: Call getAdminUsers with token parameter
      // This would require modifying the function to accept a token parameter

      // Option 2: Make a direct API call with the token
      const response = await axios.get(
        `${mainConfig.apiServer}/admin/user/get-users?limit=100`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      if (response.data?.data && Array.isArray(response.data.data)) {
        apiUsers = response.data.data;
      } else if (Array.isArray(response.data)) {
        apiUsers = response.data;
      }
    } else {
      console.warn(
        "No authentication token found in cookies for server action"
      );
      // Fallback to getAdminUsers, but it likely won't have token on server
      apiUsers = await getAdminUsers({ limit: 100 });
    }

    // Map API users to our User interface
    if (apiUsers && Array.isArray(apiUsers)) {
      return apiUsers.map((user: any) => {
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
            (r: string) => r === "admin" || r === "agency" || r === "consultant"
          );

          if (foundRole) {
            role = foundRole as UserRole;
          } else if (user.roles.includes("customer")) {
            role = "normal"; // Map "customer" to "normal"
          }
        }

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
    }

    // Fallback to mock data if API fails
    return users;
  } catch (error) {
    console.error("Error fetching users in server action:", error);

    // Fallback to mock data
    return users;
  }
}

// Server action to fetch role groups (without icon components)
export async function getRoleGroups(): Promise<RoleGroup[]> {
  return roleGroups;
}

// Server action to get a single user by ID
export async function getUserById(id: number): Promise<User | null> {
  const user = users.find((user) => user.id === id);
  return user || null;
}

// Server action to filter users by search term and role
export async function filterUsers(
  searchTerm: string = "",
  role: UserRole | "all" = "all"
): Promise<User[]> {
  let filtered = users;

  if (role !== "all") {
    filtered = filtered.filter((user) => user.role === role);
  }

  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (user) =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phone.includes(searchTerm)
    );
  }

  return filtered;
}

// Mock add/update/delete functions
// In a real app, these would interact with a database

export async function addUser(
  userData: Omit<User, "id" | "createdAt">
): Promise<User> {
  // In real app, this would be a database insert operation
  const newUser: User = {
    ...userData,
    id: Math.max(...users.map((u) => u.id), 0) + 1,
    createdAt: new Date().toLocaleDateString("fa-IR").replace(/\//g, "/"),
  };

  // This is just for mock data - don't mutate directly in real app
  users.push(newUser);

  return newUser;
}

export async function updateUser(userData: User): Promise<User> {
  // In real app, this would be a database update operation
  const index = users.findIndex((u) => u.id === userData.id);

  if (index !== -1) {
    // This is just for mock data - don't mutate directly in real app
    users[index] = userData;
    return userData;
  }

  throw new Error("User not found");
}

export async function deleteUser(id: number): Promise<boolean> {
  // In real app, this would be a database delete operation
  const index = users.findIndex((u) => u.id === id);

  if (index !== -1) {
    // This is just for mock data - don't mutate directly in real app
    users.splice(index, 1);
    return true;
  }

  return false;
}
