"use client";

import React from 'react';
import DocumentCard from './DocumentCard';
import { motion } from 'framer-motion';
import { Card, Divider } from '@heroui/react';

interface DocumentFile {
  _id: string;
  url: string;
  fileName: string;
  size: number;
}

interface Document {
  _id: string;
  documentType: string;
  name: string;
  description: string;
  status: string;
  uploadedAt: string;
  verificationNotes: string;
  file: DocumentFile;
}

interface DocumentsListProps {
  documents: Document[];
  agencyId: string;
  onRefresh?: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const DocumentsList: React.FC<DocumentsListProps> = ({ documents, agencyId, onRefresh }) => {
  if (!documents || documents.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="flex flex-col items-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg">هیچ مدرکی برای بررسی وجود ندارد.</p>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex justify-between items-center mb-6 pb-3 border-b">
        <h2 className="text-xl font-bold text-gray-900">مدارک ارسال شده</h2>
        <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
          {documents.length} مدرک
        </span>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {documents.map(document => (
          <motion.div
            key={document._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DocumentCard
              _id={document._id}
              documentType={document.documentType}
              name={document.name}
              description={document.description}
              status={document.status}
              uploadedAt={document.uploadedAt}
              verificationNotes={document.verificationNotes}
              file={document.file}
              agencyId={agencyId}
              onReviewComplete={onRefresh}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DocumentsList;
