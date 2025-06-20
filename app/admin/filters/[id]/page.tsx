import React from "react";
import FilterDetail from "@/components/admin/filters/FilterDetail";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <FilterDetail filterId={id} />;
}
