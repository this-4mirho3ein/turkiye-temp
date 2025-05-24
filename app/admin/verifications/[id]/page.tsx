import React from 'react';
import { getAgencyVerificationDocuments } from '@/controllers/makeRequest';
import VerificationDetailClient from '@/components/admin/verifications/detail/VerificationDetailClient';

// This is a Server Component
async function getVerificationData(id: string) {
  try {
    // Fetch verification details from the API
    const response = await getAgencyVerificationDocuments(id);
    
    if (response.success && response.data) {
      return {
        data: response.data
      };
    }
    
    // Return empty data if API call fails
    return {
      data: null,
      error: 'درخواست تأیید یافت نشد'
    };
  } catch (error) {
    console.error("Error fetching verification details:", error);
    
    // Return error in case of exception
    return {
      data: null,
      error: 'خطا در دریافت اطلاعات'
    };
  }
}

interface VerificationDetailPageProps {
  params: {
    id: string;
  };
}

export default async function VerificationDetailPage({ params }: VerificationDetailPageProps) {
  const { id } = params;
  
  // Fetch data on the server
  const data = await getVerificationData(id);
  
  return (
    <VerificationDetailClient initialData={data} verificationId={id} />
  );
}