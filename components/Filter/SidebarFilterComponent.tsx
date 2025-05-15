import { Input } from "@heroui/react";
import CustomSelect from "../CustomSelect";
import { useState } from "react";
import { getAreas, getCategories, getCities, getCountries, getProvinces } from "@/controllers/makeRequest";
import { useApi } from "@/hooks/useApi";

const fetchers = {
  countries: getCountries,
  provinces: getProvinces,
  cities: getCities,
  areas: getAreas,
  categories: getCategories,
};
export function SidebarFilter({
  onFilterChange,
}: {
  onFilterChange: (filters: any) => void;
}) {
  const [filters, setFilters] = useState({
    transactionType: "sell",
    category: "apartment",
  });
  const [country, setCountry] = useState<string | null>(null);

    const { data: countries, isLoading: isCountriesLoading } = useApi(
      "countries",
      fetchers,
      null,
      true
    );

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <aside className="w-full sm:w-64 p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <CustomSelect
        isDisabled={isCountriesLoading}
        placeholder="کشور"
        selectedKeys={country !== null ? [String(country)] : []}
        onChange={(value) => {
          setCountry(value || null);
        }}
        items={countries?.results || []}
        itemKey="slug"
        itemLabel="name"
      />
      <Input
        placeholder="Search location..."
        className="mt-3"
        onChange={(e) => handleFilterChange("location", e.target.value)}
      />
    </aside>
  );
}
