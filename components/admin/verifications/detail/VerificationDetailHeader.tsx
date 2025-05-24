"use client";

import React from 'react';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Button } from '@heroui/react';

interface VerificationDetailHeaderProps {
  agencyName: string;
}

const VerificationDetailHeader: React.FC<VerificationDetailHeaderProps> = ({ agencyName }) => {
  return (
    <motion.div 
      className="mb-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link href="/admin/verifications">
        <Button 
          variant="bordered"
          color="primary"
          size="sm"
          className="mb-4 group flex items-center gap-2"
        >
          <FaArrowRight className="transition-transform group-hover:translate-x-1" />
          <span>بازگشت به لیست</span>
        </Button>
      </Link>
      
      <div className="border-b pb-4 mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          بررسی مدارک آژانس
        </h1>
        <p className="text-lg text-indigo-600 font-medium mt-1">{agencyName}</p>
      </div>
    </motion.div>
  );
};

export default VerificationDetailHeader;
