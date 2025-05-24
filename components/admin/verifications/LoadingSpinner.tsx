"use client";

import React from "react";
import { motion } from "framer-motion";

const LoadingSpinner: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-center items-center h-64"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </motion.div>
  );
};

export default LoadingSpinner;
