"use client";

import { FaUsers, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { User } from "../data/users";

interface UserStatsProps {
  users: User[];
}

export default function UserStats({ users }: UserStatsProps) {
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => !user.isDeleted).length;
  const deletedUsers = users.filter((user) => user.isDeleted).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* کل کاربران */}
      <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-blue-500">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500">کل کاربران</div>
            <div className="text-2xl font-bold mt-1">{totalUsers}</div>
          </div>
          <div className="p-3 rounded-full bg-blue-100">
            <FaUsers className="text-blue-600 text-lg" />
          </div>
        </div>
      </div>

      {/* کاربران فعال */}
      <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-green-500">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500">کاربران فعال</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {activeUsers}
            </div>
          </div>
          <div className="p-3 rounded-full bg-green-100">
            <FaUserCheck className="text-green-600 text-lg" />
          </div>
        </div>
      </div>

      {/* کاربران حذف شده */}
      <div className="bg-white p-4 rounded-lg shadow-sm border-t-4 border-red-500">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500">کاربران حذف شده</div>
            <div className="text-2xl font-bold text-red-600 mt-1">
              {deletedUsers}
            </div>
          </div>
          <div className="p-3 rounded-full bg-red-100">
            <FaUserTimes className="text-red-600 text-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
