"use client";

import { useParams } from "next/navigation";
import AdDetailsPageClient from "@/components/admin/ads/AdDetailsPageClient";

export default function AdDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  return <AdDetailsPageClient id={id} />;
}
