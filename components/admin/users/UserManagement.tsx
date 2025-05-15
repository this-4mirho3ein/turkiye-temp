"use client";

import UsersList from "./UsersList";
import { User } from "../data/users";

interface UserManagementProps {
  initialUsers: User[];
}

export default function UserManagement({ initialUsers }: UserManagementProps) {
  return <UsersList initialUsers={initialUsers} />;
}
