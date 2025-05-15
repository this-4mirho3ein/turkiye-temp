"use server";

import users, { User, UserRole, roleGroups, RoleGroup, Role } from "./users";

// Server action to fetch all users
export async function getUsers(): Promise<User[]> {
  // This simulates a database fetch
  // In a real app, this would be an actual database query
  return users;
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
