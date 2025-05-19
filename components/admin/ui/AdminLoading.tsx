"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaLayerGroup, FaCubes, FaBuilding } from "react-icons/fa";

interface AdminLoadingProps {
  message?: string;
  type?: "default" | "category" | "user" | "property";
  size?: "sm" | "md" | "lg";
}

const getIcon = (type: string) => {
  switch (type) {
    case "category":
      return <FaLayerGroup className="text-primary/70 w-5 h-5" />;
    case "user":
      return <FaBuilding className="text-indigo-500/70 w-5 h-5" />;
    case "property":
      return <FaCubes className="text-emerald-500/70 w-5 h-5" />;
    default:
      return <FaLayerGroup className="text-primary/70 w-5 h-5" />;
  }
};

const getSizeClass = (size: string) => {
  switch (size) {
    case "sm":
      return {
        container: "min-h-[40vh]",
        box: "max-w-sm",
        iconBox: "w-14 h-14",
        heading: "text-lg",
        text: "text-sm",
      };
    case "lg":
      return {
        container: "min-h-[90vh]",
        box: "max-w-lg",
        iconBox: "w-24 h-24",
        heading: "text-2xl",
        text: "text-lg",
      };
    default:
      return {
        container: "min-h-[70vh]",
        box: "max-w-md",
        iconBox: "w-20 h-20",
        heading: "text-xl",
        text: "text-base",
      };
  }
};

const getTypeClass = (type: string) => {
  switch (type) {
    case "category":
      return {
        gradientBg: "from-primary-50 via-indigo-50 to-blue-50",
        borderColor: "border-primary-100",
        spinnerColor: "border-primary",
        bgColor: "bg-primary/10",
      };
    case "user":
      return {
        gradientBg: "from-indigo-50 via-violet-50 to-purple-50",
        borderColor: "border-indigo-100",
        spinnerColor: "border-indigo-500",
        bgColor: "bg-indigo-500/10",
      };
    case "property":
      return {
        gradientBg: "from-emerald-50 via-teal-50 to-green-50",
        borderColor: "border-emerald-100",
        spinnerColor: "border-emerald-500",
        bgColor: "bg-emerald-500/10",
      };
    default:
      return {
        gradientBg: "from-primary-50 via-indigo-50 to-blue-50",
        borderColor: "border-primary-100",
        spinnerColor: "border-primary",
        bgColor: "bg-primary/10",
      };
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const boxVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const pulseVariants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const spinnerVariants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

const iconVariants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.3,
      duration: 0.5,
      type: "spring",
      stiffness: 200,
    },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.3,
      duration: 0.4,
    },
  },
};

const dotsContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const dotVariants = {
  hidden: { y: 0, opacity: 0 },
  visible: {
    y: [0, -10, 0],
    opacity: 1,
    transition: {
      y: {
        repeat: Infinity,
        duration: 0.6,
        ease: "easeInOut",
        repeatType: "reverse",
      },
    },
  },
};

export default function AdminLoading({
  message = "لطفاً کمی صبر کنید، در حال بارگذاری اطلاعات...",
  type = "default",
  size = "md",
}: AdminLoadingProps) {
  const sizeClasses = getSizeClass(size);
  const typeClasses = getTypeClass(type);
  const icon = getIcon(type);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`flex items-center justify-center ${sizeClasses.container} rtl`}
    >
      <motion.div
        variants={boxVariants}
        className={`bg-gradient-to-r ${typeClasses.gradientBg} p-8 rounded-2xl shadow-md border ${typeClasses.borderColor} text-center ${sizeClasses.box}`}
      >
        <motion.div
          variants={pulseVariants}
          initial="initial"
          animate="animate"
          className={`relative ${sizeClasses.iconBox} mx-auto mb-6`}
        >
          <div
            className={`absolute inset-0 ${typeClasses.bgColor} rounded-full`}
          ></div>
          <motion.div
            variants={spinnerVariants}
            initial="initial"
            animate="animate"
            className={`absolute inset-4 border-2 ${typeClasses.spinnerColor} border-t-transparent rounded-full`}
          ></motion.div>
          <motion.div
            variants={iconVariants}
            className="absolute inset-0 flex items-center justify-center"
          >
            {icon}
          </motion.div>
        </motion.div>

        <motion.h2
          variants={textVariants}
          className={`${sizeClasses.heading} font-bold text-gray-800 mb-3`}
        >
          در حال بارگذاری
        </motion.h2>

        <motion.p
          variants={textVariants}
          className={`${sizeClasses.text} text-gray-600 text-right mb-4`}
        >
          {message}
        </motion.p>

        <motion.div
          variants={dotsContainerVariants}
          className="flex justify-center space-x-2 rtl:space-x-reverse mt-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              variants={dotVariants}
              className="h-2 w-2 bg-primary/70 rounded-full"
              style={{
                originY: "50%",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
