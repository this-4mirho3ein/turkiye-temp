export interface Region {
  id: number;
  name: string;
  slug: string;
  parent?: {
    id: number;
    name: string;
    originalId?: string; // Original string ID from API
  };
  enName?: string; // English name (mainly for countries)
  code?: string; // Country code
  phoneCode?: string; // Country phone code
  originalId?: string; // Original string ID from API
  isDeleted: boolean; // Whether the region is deleted
}

// Mock data for regions
const sampleRegions: {
  countries: Region[];
  provinces: Region[];
  cities: Region[];
  areas: Region[];
} = {
  countries: [
    {
      id: 1,
      name: "ایران",
      slug: "iran",
      code: "IR",
      phoneCode: "+98",
      isDeleted: false,
    },
    {
      id: 2,
      name: "ترکیه",
      slug: "turkey",
      code: "TR",
      phoneCode: "+90",
      isDeleted: false,
    },
  ],
  provinces: [
    {
      id: 1,
      name: "تهران",
      slug: "tehran",
      parent: { id: 1, name: "ایران" },
      isDeleted: false,
    },
    {
      id: 2,
      name: "استانبول",
      slug: "istanbul",
      parent: { id: 2, name: "ترکیه" },
      isDeleted: false,
    },
  ],
  cities: [
    {
      id: 1,
      name: "تهران",
      slug: "tehran-city",
      parent: { id: 1, name: "تهران" },
      isDeleted: false,
    },
    {
      id: 2,
      name: "اسلامشهر",
      slug: "eslamshahr",
      parent: { id: 1, name: "تهران" },
      isDeleted: false,
    },
  ],
  areas: [
    {
      id: 1,
      name: "منطقه ۱",
      slug: "district-1",
      parent: { id: 1, name: "تهران" },
      isDeleted: false,
    },
    {
      id: 2,
      name: "منطقه ۲",
      slug: "district-2",
      parent: { id: 1, name: "تهران" },
      isDeleted: false,
    },
  ],
};

export default sampleRegions;
