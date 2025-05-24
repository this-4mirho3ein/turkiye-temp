"use client";

import React from "react";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  breadcrumbs: {
    label: string;
    href?: string;
    active?: boolean;
  }[];
}

const itemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

const PageHeader: React.FC<PageHeaderProps> = ({ title, breadcrumbs }) => {
  return (
    <motion.div variants={itemVariants} className="mb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
      <div className="flex items-center text-sm text-gray-500">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="mx-2">/</span>}
            {item.href ? (
              <a 
                href={item.href} 
                className={`hover:text-purple-600 transition-colors ${item.active ? 'text-purple-600' : ''}`}
              >
                {item.label}
              </a>
            ) : (
              <span className={item.active ? 'text-purple-600' : ''}>{item.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
};

export default PageHeader;
