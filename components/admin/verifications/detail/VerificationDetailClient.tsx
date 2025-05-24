"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAgencyVerificationDocuments } from '@/controllers/makeRequest';
import { Card, Spinner, Button } from '@heroui/react';
import VerificationDetailHeader from './VerificationDetailHeader';
import AgencyInfo from './AgencyInfo';
import DocumentsList from './DocumentsList';

interface VerificationDetailClientProps {
  initialData: any;
  verificationId: string;
}

const VerificationDetailClient: React.FC<VerificationDetailClientProps> = ({
  initialData,
  verificationId
}) => {
  const [loading, setLoading] = useState<boolean>(!initialData?.data);
  const [data, setData] = useState(initialData?.data || null);
  const [error, setError] = useState<string | null>(initialData?.error || null);

  const fetchVerificationDetails = async () => {
    setLoading(true);
    try {
      const response = await getAgencyVerificationDocuments(verificationId);
      
      if (response.success && response.data) {
        setData(response.data.data);
        setError(null);
      } else {
        setError(response.message || 'خطا در دریافت اطلاعات');
        console.error('API Error:', response.message || 'خطا در دریافت اطلاعات');
      }
    } catch (err) {
      console.error('Error fetching verification details:', err);
      setError('خطا در دریافت اطلاعات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Always fetch fresh data when component mounts
    fetchVerificationDetails();
  }, [verificationId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] py-20">
        <Spinner size="lg" color="primary" className="mb-4" />
        <p className="text-indigo-600 font-medium">در حال بارگذاری اطلاعات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto mt-8">
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-500 mb-6 text-lg">{error || 'خطا در دریافت اطلاعات'}</p>
          <Button
            onClick={fetchVerificationDetails}
            color="primary"
            size="md"
            className="min-w-[150px]"
          >
            تلاش مجدد
          </Button>
        </div>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto mt-8">
        <div className="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-500 mb-6 text-lg">خطا در دریافت اطلاعات</p>
          <Button
            onClick={fetchVerificationDetails}
            color="primary"
            size="md"
            className="min-w-[150px]"
          >
            تلاش مجدد
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-6 max-w-7xl mx-auto"
    >
      <Card className="mb-6 p-4 md:p-6 shadow-md">
        <VerificationDetailHeader agencyName={data.agencyName} />
      </Card>
      
      <Card className="mb-6 p-4 md:p-6 shadow-md overflow-hidden">
        <AgencyInfo
          agencyName={data.agencyName}
          ownerInfo={data.ownerInfo}
          status={data.status}
          submittedAt={data.submittedAt}
        />
      </Card>
      
      <Card className="p-4 md:p-6 shadow-md overflow-hidden">
        <DocumentsList 
          documents={data.documents} 
          agencyId={data.agencyId || verificationId} 
          onRefresh={fetchVerificationDetails} 
        />
      </Card>
    </motion.div>
  );
};

export default VerificationDetailClient;
