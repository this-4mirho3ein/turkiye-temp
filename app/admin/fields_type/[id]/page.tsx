"use client";

import { useParams } from "next/navigation";
import PropertyTypeDetail from "@/components/admin/fields_type/PropertyTypeDetail";

export default function PropertyTypeDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id || "";

  return (
    <div className="p-6">
      <PropertyTypeDetail id={id} />
    </div>
  );
}
