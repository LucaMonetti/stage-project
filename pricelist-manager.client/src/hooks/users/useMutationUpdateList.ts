import { type CreateUser, CreateUserSchema } from "../../models/FormUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserSchema, type User } from "../../models/User";
import { API_OPTIONS_POST, queryEndpoint } from "../../config/apiConfig";

interface UseCreateUserOptions {
  onSuccess?: (data: User) => void;
  onError?: (error: Error) => void;
}
const createUser = async (createUserData: CreateUser): Promise<User> => {
  const parsedData = CreateUserSchema.safeParse(createUserData);

  if (!parsedData.success) {
    throw new Error("Invalid user data");
  }

  const options = {
    ...API_OPTIONS_POST,
    body: JSON.stringify(parsedData.data),
  };

  const response = await fetch(queryEndpoint(`accounts/register`), options);

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const rawData = await response.json();
  return UserSchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for creating posts
export const useCreateUser = (options?: UseCreateUserOptions) => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, CreateUser>({
    mutationFn: createUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};
