"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getAgencyVerifications } from "@/controllers/makeRequest";
import PageHeader from "./PageHeader";
import LoadingSpinner from "./LoadingSpinner";
import VerificationList from "./VerificationList";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { opacity: 0, y: 20 }
};

interface Agency {
  _id: string;
  name: string;
  ownerName: string;
  ownerPhone: string;
  isVerified: boolean;
  status: string;
  submittedAt: string;
  daysSinceSubmission: number;
}

interface VerificationData {
  agencies: Agency[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface VerificationsClientProps {
  initialData?: {
    data: {
      agencies: Agency[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

const VerificationsClient: React.FC<VerificationsClientProps> = ({ initialData }) => {
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [data, setData] = useState<VerificationData>(initialData?.data || {
    agencies: [],
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [status, setStatus] = useState<string>("pending");
  const [currentPage, setCurrentPage] = useState<number>(1);
  
  const fetchVerifications = async (status: string, page: number) => {
    setLoading(true);
    try {
      const response = await getAgencyVerifications(status, page);
      if (response.success && response.data && response.data.data) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching verifications:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Always fetch data when component mounts, even if we have initialData
    // This ensures we always have the latest data and fixes the issue with
    // needing to change status to see data
    fetchVerifications(status, currentPage);
  }, []);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchVerifications(status, page);
  };
  
  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setCurrentPage(1);
    fetchVerifications(newStatus, 1);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="container mx-auto px-4 py-8"
    >
      <PageHeader 
        title="تأییدیه‌ها"
        breadcrumbs={[
          { label: "داشبورد", href: "/admin" },
          { label: "تأییدیه‌ها", active: true }
        ]}
      />

      {!initialData && loading ? (
        <LoadingSpinner />
      ) : (
        <VerificationList 
          agencies={data.agencies}
          page={data.page}
          limit={data.limit}
          total={data.total}
          totalPages={data.totalPages}
          onPageChange={handlePageChange}
          onStatusChange={handleStatusChange}
          currentStatus={status}
          loading={loading}
        />
      )}
    </motion.div>
  );
};

export default VerificationsClient;
