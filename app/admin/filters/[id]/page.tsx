import React from "react";
import FilterDetail from "@/components/admin/filters/FilterDetail";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return (
    <div className="p-6">
      <FilterDetail filterId={params.id} />
    </div>
  );
} 