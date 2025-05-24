import React from "react";
import { getAgencyVerifications } from "@/controllers/makeRequest";
import VerificationsClient from "@/components/admin/verifications/VerificationsClient";

// This is a Server Component
async function getVerificationsData() {
  try {
    // Fetch verifications from the API
    const response = await getAgencyVerifications('pending', 1, 10);
    
    if (response.success && response.data) {
      return {
        data: response.data.data
      };
    }
    
    // Return empty data if API call fails
    return {
      data: {
        agencies: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    };
  } catch (error) {
    console.error("Error fetching verifications:", error);
    
    // Return empty data in case of error
    return {
      data: {
        agencies: [],
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    };
  }
}

export default async function VerificationsPage() {
  // Fetch data on the server
  const data = await getVerificationsData();
  
  return (
    <VerificationsClient initialData={data} />
  );
}
