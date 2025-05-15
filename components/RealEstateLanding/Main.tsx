"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import PropertyListing from "@/components/RealEstateLanding/PropertyListing";
import {
  getCompanyHeader,
  getCompanyMembers,
  getCompanyProperties,
} from "@/controllers/makeRequest";

export interface MemberData {
  id: string;
  name: string;
  role: string;
  profileImage: string;
  yearsOfService: number;
}

export interface HeaderData {
  companyName: string;
  profileImage: string;
  alt?: string;
  logo?: string;
  logoalt?: string;
  rating: number;
  reviews: number;
  location: string;
  establishedYear: string;
  stats: {
    experience: string;
    activeProperties: string;
    satisfiedClients: string;
    cities: string;
  };
}
export interface Property {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  price: number;
  location: string;
}

const RealestateLanding = () => {
  const pathname = usePathname();
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);
  const [memberData, setMemberData] = useState<MemberData[] | null>(null);
  const [isLoading, setIsLoading] = useState({
    header: true,
    members: true,
    properties: true,
  });
  const [error, setError] = useState({
    header: null as string | null,
    members: null as string | null,
    properties: null as string | null,
  });

  // Fetch header data
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await getCompanyHeader();
        if (response.status !== 200)
          throw new Error("Failed to fetch header data");
        setHeaderData(response.data);
      } catch (err) {
        setError((prev) => ({
          ...prev,
          header:
            err instanceof Error ? err.message : "Failed to fetch header data",
        }));
      } finally {
        setIsLoading((prev) => ({ ...prev, header: false }));
      }
    };

    fetchHeaderData();
  }, []);

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await getCompanyMembers();
        if (response.status !== 200)
          throw new Error("Failed to fetch members data");
        setMemberData(response.data);
      } catch (err) {
        setError((prev) => ({
          ...prev,
          members:
            err instanceof Error ? err.message : "Failed to fetch members data",
        }));
      } finally {
        setIsLoading((prev) => ({ ...prev, members: false }));
      }
    };

    fetchMemberData();
  }, []);

  return (
    <div className="font-sans bg-gray-50 lg:mt-4">
      <div className="relative mx-auto max-w-7xl w-full bg-white rounded-md overflow-hidden shadow-sm">
        {isLoading.header ? (
          <div className="h-64 bg-gray-100 animate-pulse"></div>
        ) : error.header ? (
          <div className="p-4 text-red-500">{error.header}</div>
        ) : (
          headerData && <Header headerData={headerData} />
        )}

        {/* Split screen layout */}
        <div className="flex flex-col lg:flex-row h-[calc(100vh-10%)]">
          {/* Sidebar */}
          <div className="lg:w-1/4 w-full p-4 border-b lg:border-b-0 lg:border-l border-gray-200 overflow-y-auto">
            {isLoading.members ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-gray-100 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            ) : error.members ? (
              <div className="p-4 text-red-500">{error.members}</div>
            ) : (
              memberData && <Sidebar memberData={memberData} />
            )}
          </div>

          {/* Main content */}
          <div className="lg:w-3/4 w-full p-4 overflow-y-auto">
            <PropertyListing />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealestateLanding;
