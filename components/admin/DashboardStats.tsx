"use client";

import StatsCard from "./StatsCard";
import stats from "./data/stats";

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {stats.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          change={stat.change}
          trend={stat.trend as "up" | "down"}
          icon={stat.icon}
          color={stat.color as any}
        />
      ))}
    </div>
  );
}
