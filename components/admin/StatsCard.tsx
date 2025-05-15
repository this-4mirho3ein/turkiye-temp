"use client";

import { ElementType } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import Card, { CardBody } from "./ui/Card";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: ElementType;
  color: "primary" | "secondary" | "success" | "warning" | "danger";
}

export default function StatsCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color,
}: StatsCardProps) {
  const colorClasses = {
    primary: {
      bg: "bg-primary-light/10",
      text: "text-primary",
      icon: "text-primary",
    },
    secondary: {
      bg: "bg-secondary-light/10",
      text: "text-secondary",
      icon: "text-secondary",
    },
    success: {
      bg: "bg-button/10",
      text: "text-button",
      icon: "text-button",
    },
    warning: {
      bg: "bg-secondary-bronze/10",
      text: "text-secondary-bronze",
      icon: "text-secondary-bronze",
    },
    danger: {
      bg: "bg-error/10",
      text: "text-error",
      icon: "text-error",
    },
  };

  const trendColors = {
    up: "text-button",
    down: "text-error",
  };

  return (
    <Card shadow="sm" className="border border-gray-100" radius="lg">
      <CardBody className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color].bg}`}>
            <Icon className={`text-lg ${colorClasses[color].icon}`} />
          </div>
        </div>

        <div className="flex items-center mt-4">
          {trend === "up" ? (
            <FaArrowUp className={`${trendColors.up} ml-1 text-xs`} />
          ) : (
            <FaArrowDown className={`${trendColors.down} ml-1 text-xs`} />
          )}
          <span
            className={`text-xs font-medium ${
              trend === "up" ? trendColors.up : trendColors.down
            }`}
          >
            {change} از ماه گذشته
          </span>
        </div>
      </CardBody>
    </Card>
  );
}
