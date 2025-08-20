"use client";

import { Roles } from "@/types/enums";
import {
  Action,
  AuthContextType,
  AuthDispatch,
  UserState,
  FilterState,
} from "@/types/interfaces";
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  ReactNode,
} from "react";

// Create User Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create Filters Context
const FiltersContext = createContext<
  { filterState: FilterState; filterDispatch: AuthDispatch } | undefined
>(undefined);

// Reducer Function for Auth
function authReducer(state: UserState, action: Action): UserState {
  try {
    switch (action.type) {
      case "LOADING":
        return { ...state, loading: action.value };
      case "login": {
        const newState: UserState = {
          ...state,
          authenticated: true,
          ...action.value,
        };
        localStorage.setItem("@user", JSON.stringify(newState));
        return newState;
      }
      case "token": {
        const newState = {
          ...state,
          accessToken: action.value.accessToken,
          refreshToken: action.value.refreshToken,
        };
        localStorage.setItem("@user", JSON.stringify(newState));
        return newState;
      }
      case "logout": {
        localStorage.removeItem("@user");
        return {
          authenticated: false,
          id: "",
          role: null,
          accessToken: "",
          refreshToken: "",
          wallet: 0,
        };
      }
      default:
        throw new Error(`Unhandled action type: ${action}`);
    }
  } catch (err) {
    return state;
  }
}

// Reducer Function for Filters
function filtersReducer(state: FilterState, action: Action): FilterState {
  switch (action.type) {
    case "filters": {
      const newState = { ...state, ...action.value };
      localStorage.setItem("@filters", JSON.stringify(newState));
      return newState;
    }
    default:
      throw new Error(`Unhandled action type: ${action}`);
  }
}

// Load initial state from localStorage (Only in client)
const initialState: UserState =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("@user") || "{}") || {
        authenticated: false,
        id: "",
        role: null,
        accessToken: "",
        refreshToken: "",
        wallet: 0,
      }
    : {
        authenticated: false,
        id: "",
        role: null,
        accessToken: "",
        refreshToken: "",
        wallet: 0,
      };

const initialFiltersState: FilterState =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("@filters") || "{}") || {
        transactionType: { title: "فروش", slug: "فروش" },
        propertyType: { title: "مسکونی", slug: "housing" },
        category: { title: "آپارتمان", slug: "apartment" },
        province: { title: "", slug: "" },
        city: { title: "", slug: "" },
        area: { title: "", slug: "" },
      }
    : {
        transactionType: { title: "فروش", slug: "فروش" },
        propertyType: { title: "مسکونی", slug: "housing" },
        category: { title: "آپارتمان", slug: "apartment" },
        province: { title: "", slug: "" },
        city: { title: "", slug: "" },
        area: { title: "", slug: "" },
      };

// Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filterState, filterDispatch] = useReducer(
    filtersReducer,
    initialFiltersState
  );
  const value = useMemo(
    () => ({ filterState, filterDispatch }),
    [filterState, filterDispatch]
  );

  return (
    <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>
  );
}

// Custom Hooks
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }
  return context;
}

// Actions
export const setLoading = (dispatch: AuthDispatch, value: boolean) =>
  dispatch({ type: "LOADING", value });

export const setLogin = (
  dispatch: AuthDispatch,
  value: {
    id: string;
    role: Roles;
    accessToken: string;
    refreshToken: string;
    wallet: number;
  }
) => dispatch({ type: "login", value });

export const setLogOut = (dispatch: AuthDispatch) =>
  dispatch({ type: "logout" });

export const setToken = (
  dispatch: AuthDispatch,
  value: { accessToken: string; refreshToken: string }
) => dispatch({ type: "token", value });

export const setFilters = (
  dispatch: AuthDispatch,
  value: Partial<FilterState>
) => {
  dispatch({
    type: "filters",
    value: {
      transactionType: value.transactionType ?? { title: "فروش", slug: "sale" },
      propertyType: value.propertyType ?? { title: "مسکونی", slug: "housing" },
      category: value.category ?? { title: "", slug: "" },
      province: value.province ?? { title: "", slug: "" },
      city: value.city ?? { title: "", slug: "" },
      area: value.area ?? { title: "", slug: "" },
    },
  });
};
