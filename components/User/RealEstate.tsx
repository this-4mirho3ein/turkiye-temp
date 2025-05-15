"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getUser } from "@/controllers/makeRequest";
import { setLoading } from "@/context/AuthContext";

// Import role-based components
import RegionManager from "./realestate/RegionManager";
import RealEstateAgent from "./realestate/RealEstateAgent";
import AccessDenied from "./realestate/AccessDenied";
import AgencySettings from "./realestate/AgencySettings";
import AgencyFinance from "./realestate/AgencyFinance";
import AgencyTeam from "./realestate/AgencyTeam";
import AgencyListings from "./realestate/AgencyListings";

export default function PishkhanComponent() {
  const { state, dispatch } = useAuth();
  const [role, setRole] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(dispatch, true);
      try {
        const response: any = await getUser(state.accessToken);
        console.log("User data response:", response);
        if (response.status === 200) {
          setUserData(response);

          // Check for role in different possible locations
          if (response.role && response.role.title_new) {
            setRole(response.role.title_new);
          } else if (response.role && typeof response.role === "string") {
            setRole(response.role);
          } else if (response.user_role) {
            setRole(response.user_role);
          }

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoading(false);
      } finally {
        setLoading(dispatch, false);
      }
    };

    if (state.accessToken) {
      fetchUserDetails();
    } else {
      setIsLoading(false);
    }
  }, [state.accessToken, dispatch]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="col-span-12 lg:col-span-9 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Render content based on role
  const renderRoleBasedContent = () => {
    switch (role) {
      case "مدیر اژانس":
        return (
          <>
            <AgencyTeam userData={userData} />
            <AgencyFinance userData={userData} />
            <AgencySettings userData={userData} />
            <AgencyListings userData={userData} />
          </>
        );
      case "مدیر منطقه":
        return <RegionManager userData={userData} />;
      case "مشاور املاک":
        return <RealEstateAgent userData={userData} />;
      default:
        return <AccessDenied />;
    }
  };
  // const renderRoleBasedContent = () => {
  //   switch (role) {
  //     case "مدیر اژانس":
  //       return <AgencyManager userData={userData} />;
  //     case "مدیر منطقه":
  //       return <RegionManager userData={userData} />;
  //     case "مشاور املاک":
  //       return <RealEstateAgent userData={userData} />;
  //     default:
  //       return <AccessDenied  />;
  //   }
  // };

  return (
    <div className="col-span-12 lg:col-span-9 p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        پنل املاک و آژانس
      </h1>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
        {renderRoleBasedContent()}
      </div>
    </div>
  );
}
