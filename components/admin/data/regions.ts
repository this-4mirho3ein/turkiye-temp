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
}
