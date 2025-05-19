"use client";

import {
  FaTrash,
  FaCheckCircle,
  FaList,
  FaMapMarkerAlt,
  FaUsers,
  FaBuilding,
} from "react-icons/fa";
import StatsCard from "../StatsCard";
import { StatItem } from "../data/stats";

export interface ReportStatsProps {
  stats: StatItem[];
}

export default function ReportsStats({ stats }: ReportStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          trend={stat.trend}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  );
}
