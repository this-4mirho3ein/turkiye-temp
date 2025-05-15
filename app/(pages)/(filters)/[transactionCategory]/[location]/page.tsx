import FilterPageComponent from "@/components/Filter/FilterPageComponent";
import Loading from "@/components/Loading";
import { Suspense } from "react";

export default function LocationPage() {
  return (
    <Suspense fallback={<Loading />}>
      <FilterPageComponent />
    </Suspense>
  );
}
