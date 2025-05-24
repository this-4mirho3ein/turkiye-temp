"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import VerificationDetailClient from '@/components/admin/verifications/detail/VerificationDetailClient';

// Define types for our data
type VerificationData = {
  data: any;
  error?: string;
};

// Client component for verification detail page
export default function VerificationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerificationData>({ data: null });
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { getAgencyVerificationDocuments } = await import('@/controllers/makeRequest');
        const response = await getAgencyVerificationDocuments(id);
        
        if (response.success && response.data) {
          setData({ data: response.data });
        } else {
          setData({ data: null, error: 'درخواست تأیید یافت نشد' });
        }
      } catch (error) {
        console.error("Error fetching verification details:", error);
        setData({ data: null, error: 'خطا در دریافت اطلاعات' });
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchData();
    }
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  
  return (
    <VerificationDetailClient initialData={data} verificationId={id} />
  );
}