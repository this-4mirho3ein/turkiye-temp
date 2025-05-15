import PropertyDetail from "@/components/Advertisement/PropertyDetail";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default function AdDetailPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PropertyDetail />
    </Suspense>
  );
}
