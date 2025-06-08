import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "secondary":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "destructive":
        return "bg-red-100 text-red-800 border-red-200";
      case "outline":
        return "bg-transparent text-gray-700 border-gray-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-md border ${getVariantClasses()} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
