import { useQuery } from "@tanstack/react-query";
import { UserArraySchema, UserSchema, type User } from "../../models/User";
import { API_OPTIONS_GET, queryEndpoint } from "../../config/apiConfig";

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

export const useUser = (userId: string) => {
  return useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });
};
