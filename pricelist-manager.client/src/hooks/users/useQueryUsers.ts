import { useQuery } from "@tanstack/react-query";
import {
  UserArraySchema,
  UserSchema,
  type User,
  type UserFilter,
} from "../../models/User";
import { API_OPTIONS_GET, queryEndpoint } from "../../config/apiConfig";
import type {
  PaginatedResponse,
  PaginationParams,
} from "../../models/Pagination";
import {
  ParsePaginationHeader,
  ParsePaginationSearchParams,
} from "../../helpers/Pagination";
import { ParseFiltersSearchParams } from "../../helpers/Filters";

// Fetch all users from the API
const fetchAllUsers = async (): Promise<User[]> => {
  const response = await fetch(queryEndpoint("accounts"), API_OPTIONS_GET);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const rawData = await response.json();

  console.log("Raw data fetched:", rawData); // Debugging line
  console.log("Parser: ", UserArraySchema.parse(rawData)); // Debugging line

  return UserArraySchema.parse(rawData);
};

export const useAllUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });
};

const UserFilterConfig = {
  username: {
    paramName: "Filters.Username",
  },
  company_id: {
    paramName: "Filters.CompanyId",
  },
};

// Fetch all users from the API
const fetchAllUsersPaged = async (
  params: PaginationParams,
  filters?: UserFilter
): Promise<PaginatedResponse<User>> => {
  const searchParams = new URLSearchParams();
  ParsePaginationSearchParams(params, searchParams);
  ParseFiltersSearchParams(filters, searchParams, UserFilterConfig);

  const response = await fetch(
    queryEndpoint(
      "accounts" +
        (searchParams.toString() ? `?${searchParams.toString()}` : "")
    ),
    API_OPTIONS_GET
  );
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  const paginationInfo = ParsePaginationHeader(response);

  const rawData = await response.json();
  return {
    items: UserArraySchema.parse(rawData),
    pagination: paginationInfo,
  };
};

export const useAllUsersPaged = (
  params: PaginationParams,
  filters?: UserFilter
) => {
  return useQuery<PaginatedResponse<User>>({
    queryKey: ["users", params.CurrentPage ?? 1, params.PageSize ?? 0, filters],
    queryFn: () => fetchAllUsersPaged(params, filters),
  });
};

// Fetch a single user by ID from the API
const fetchUser = async (userId: string): Promise<User> => {
  const response = await fetch(
    queryEndpoint(`accounts/${userId}`),
    API_OPTIONS_GET
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }
  const rawData = await response.json();
  return UserSchema.parse(rawData);
};

export const useUser = (userId: string, options?: { enabled?: boolean }) => {
  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
    enabled: options?.enabled !== false && !!userId, // Only fetch if enabled and userId exists
  });
};
