import { JSX } from "react";
import { HeroUiColors, Premium, Roles } from "./enums";

//#region auth
export interface LoginTypes {
  status: number;
  data: any;
}

export interface RegisterTypes {
  action: string;
  email: string;
  password: string;
  countryCode?: string;
  username: string;
  referrer: string;
}
//#endregion
//#region locations
export interface Country {
  name: string;
  id: number;
}

export interface Province {
  name: string;
  id: number;
}

export interface City {
  name: string;
  id: number;
}

export interface Area {
  name: string;
  id: number;
}

export type Location = {
  name: string;
  slug: string;
  type: string;
};
//#endregion

//#region categories
export interface Category {
  slug: string;
  title: string;
}
//#endregion

//#region Filters
export interface CustomSelectProps<T> {
  isDisabled?: boolean;
  placeholder: string;
  color?: HeroUiColors;
  selectedKeys: string[];
  onChange: (value: string) => void;
  items: any[];
  itemKey: keyof T;
  itemLabel: keyof T;
  classNames?: string;
}
export interface Filter {
  id: string;
  title: string;
  slug: string;
  values: { id: string; value_title: string; slug: string | null }[];
  typeFeature: { id: number; title: string };
  min?: number;
  max?: number;
}
export interface DynamicFiltersProps {
  filters: Filter[];
  selectedFilters: Record<string, string | string[] | number | number[]>;
  onChange: (
    slug: string,
    value: string | string[] | number | number[],
    isMobileView: boolean
  ) => void;
  onFilterClick: () => void;
  onResetFilterClick?: () => void;
  isMobileView?: boolean;
}
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
//#endregion

//#region Context
export interface FilterState {
  transactionType: { title: string; slug: string };
  propertyType: { title: string; slug: string };
  category: { title: string; slug: string };
  country: { title: string; slug: string };
  province: { title: string; slug: string };
  city: { title: string; slug: string };
  area: { title: string; slug: string };
}
export interface UserState {
  authenticated: boolean;
  id: string;
  role: Roles | null;
  accessToken: string;
  refreshToken: string;
  wallet: number;
  loading?: boolean;
}
export type Action =
  | { type: "LOADING"; value: boolean }
  | {
      type: "login";
      value: {
        id: string;
        role: Roles | null;
        accessToken: string;
        refreshToken: string;
        wallet: number;
      };
    }
  | { type: "logout" }
  | { type: "token"; value: { accessToken: string; refreshToken: string } }
  | { type: "filters"; value: Partial<FilterState> };

export type AuthDispatch = (action: Action) => void;

export interface AuthContextType {
  state: UserState;
  dispatch: AuthDispatch;
}
//#endregion

//#region Api
export interface Fetchers<T> {
  [key: string]: (params?: any) => Promise<T>;
}
//#endregion

//#region Ads

interface PropDetail {
  slug: string;
  title: string;
}
interface featureDetail {
  slug: string;
  title: string;
  value: string | number;
  type_value: string;
}
interface LocationDetail {
  slug: string;
  name: string;
}
export interface ConsultantDetail {
  id: string;
  name: string;
  email: string;
  mobile: string[];
  city: string;
  logo: string;
  siteExperience: string;
  agency: {
    id: string;
    name: string;
  };
}
export interface AgencyDetail {
  name: string;
  bio: string;
  logo: string;
  managerLogo: string;
  managerName: string;
  city: string;
  address: string;
  activityExperience: string;
  mobiles: string[];
  emails: string[];
  consultants: ConsultantDetail[];
}
export interface Ads {
  id: string;
  transactionType: PropDetail;
  category: PropDetail;
  title: string;
  image_name: string;
  price: string;
  city: PropDetail;
  neighborhood: PropDetail;
  created_at: string;
  update_date: string;
  propertyType: PropDetail;
  agency?: { id: string; name: string; logo: string };
  consulting?: { id: string; name: string; logo: string };
  createdUser: {
    role: Roles; // "agency", "consultor","user",
    mobile: string;
    email?: string;
    name?: string;
  };
  premium: Premium[];
  mainFeature: featureDetail[];
  is_bookmarked: boolean;
}

export type SearchAdvertisement = {
  id: string;
  title: string;
  image_name: string | null;
  transactionType: string;
  propertyType: string;
  category: string;
  country: string;
  province: string;
  city: PropDetail;
  area: PropDetail;
};

export type Property = {
  id: string;
  premium: Premium[]; // "ladder","special","urgent",
  view: number;
  description: string;
  price: number;
  created_at: string;
  update_date: string;
  adv_type: PropDetail; //{ slug: string;title: string;}
  property_type: PropDetail;
  category: PropDetail;
  country: LocationDetail;
  province?: LocationDetail;
  city: LocationDetail;
  neighborhood?: LocationDetail;
  title: string;
  image_name: string[];
  agency?: { id: string; name: string; logo: string };
  consulting?: { id: string; name: string; logo: string };
  createdUser: {
    role: Roles; // "agency", "consultor","user",
    mobile: string;
    email?: string;
    name?: string;
  };
  mainFeature: featureDetail[];
  additionalFilters: featureDetail[];
  amenities: featureDetail[];
};

export type AdNavbarProps = {
  url: string;
  title: string;
  count: number;
  isSingle?: boolean;
};
//#endregion

