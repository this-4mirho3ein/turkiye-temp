"use server";

import sampleRegions, { Region } from "./regions";

// Server action to get regions by type
export async function getRegionsByType(
  type: "countries" | "provinces" | "cities" | "areas"
): Promise<Region[]> {
  // In a real app, this would fetch from a database
  return sampleRegions[type] || [];
}

// Server action to filter regions by search term
export async function filterRegions(
  type: "countries" | "provinces" | "cities" | "areas",
  searchTerm: string = ""
): Promise<Region[]> {
  const regions = sampleRegions[type] || [];

  if (!searchTerm) {
    return regions;
  }

  const searchLower = searchTerm.toLowerCase();
  return regions.filter(
    (region) =>
      region.name.toLowerCase().includes(searchLower) ||
      region.slug.toLowerCase().includes(searchLower)
  );
}

// Mock add/update/delete functions for regions
export async function addRegion(
  type: "countries" | "provinces" | "cities" | "areas",
  regionData: Omit<Region, "id">
): Promise<Region> {
  // In real app, this would be a database insert operation
  const regions = sampleRegions[type] || [];

  const newRegion: Region = {
    ...regionData,
    id: Math.max(...regions.map((r) => r.id), 0) + 1,
  };

  // This is just for mock data - don't mutate directly in real app
  regions.push(newRegion);

  return newRegion;
}

export async function updateRegion(
  type: "countries" | "provinces" | "cities" | "areas",
  regionData: Region
): Promise<Region> {
  // In real app, this would be a database update operation
  const regions = sampleRegions[type] || [];
  const index = regions.findIndex((r) => r.id === regionData.id);

  if (index !== -1) {
    // This is just for mock data - don't mutate directly in real app
    regions[index] = regionData;
    return regionData;
  }

  throw new Error("Region not found");
}

export async function deleteRegion(
  type: "countries" | "provinces" | "cities" | "areas",
  id: number
): Promise<boolean> {
  // In real app, this would be a database delete operation
  const regions = sampleRegions[type] || [];
  const index = regions.findIndex((r) => r.id === id);

  if (index !== -1) {
    // This is just for mock data - don't mutate directly in real app
    regions.splice(index, 1);
    return true;
  }

  return false;
}
