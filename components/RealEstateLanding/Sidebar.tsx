"use client";
import Image from "next/image";
import { useState } from "react";

interface MemberData {
  id: string;
  name: string;
  role: string;
  profileImage: string;
  yearsOfService: number;
}
interface SidebarProps {
  memberData: MemberData[];
}

export default function Sidebar({ memberData }: SidebarProps) {
  // State for Load More functionality
  const [visibleMembers, setVisibleMembers] = useState(4); // Show initial 3 members

  // Function to load more members
  const handleLoadMore = () => {
    setVisibleMembers((prev) => prev + 3); // Show 3 more members
  };

  return (
    <div className="px-6 pb-4 max-h-screen overflow-y-auto">
      <h3 className="font-bold text-2xl mb-6 text-gray-800">تیم ما </h3>
      <div className="flex flex-col gap-2">
        {memberData.map((member) => (
          <div
            key={member.id}
            className="flex items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-lg transition-shadow select-none"
          >
            {/* Left Section: Member Info */}
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-gray-800">
                {member.name}
              </h4>
              <p className="text-sm text-gray-600">{member.role}</p>
              <p className="text-xs text-gray-500 mt-1">
                {member.yearsOfService} years with us
              </p>
            </div>

            {/* Right Section: Member Image */}
            <div className="w-16 h-16 rounded-full overflow-hidden relative shadow-sm">
              <Image
                src={member.profileImage}
                alt={member.name}
                width={100}
                height={100}
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleMembers < memberData.length && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
