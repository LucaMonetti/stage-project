import {
  type ChangePassword,
  ChangePasswordSchema,
  type CreateUser,
  CreateUserSchema,
  type EditUser,
  EditUserSchema,
} from "../../models/FormUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserSchema, type User } from "../../models/User";
import type { UseEditOptions } from "../../types";
import QueryEndpoint from "../../helpers/queryEndpoint";
import { apiConfig } from "../../helpers/ApiConfig";

interface UseCreateUserOptions {
  onSuccess?: (data: User) => void;
  onError?: (error: Error) => void;
}
const createUser = async (createUserData: CreateUser): Promise<User> => {
  const parsedData = CreateUserSchema.safeParse(createUserData);

  if (!parsedData.success) {
    throw new Error("Invalid user data");
  }

  const response = await fetch(
    QueryEndpoint.buildUrl(`auth/register`),
    apiConfig.post(parsedData.data)
  );

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

// Edit user function
const editUser = async (id: string, updateData: EditUser): Promise<User> => {
  const parsedData = EditUserSchema.safeParse(updateData);

  if (!parsedData.success) {
    throw new Error("Invalid updatelist data for update");
  }

  const response = await fetch(
    QueryEndpoint.buildUrl(`accounts/${id}`),
    apiConfig.put(parsedData.data)
  );

  if (!response.ok) {
    throw new Error(`Failed to update user with ID: ${id}`);
  }

  const rawData = await response.json();
  return UserSchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for editing updatelist
export const useEditUser = (options?: UseEditOptions<User>) => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, EditUser>({
    mutationFn: (data) => editUser(data.id, data),
    onSuccess: (data) => {
      // Invalidate queries to ensure the cache is updated
      queryClient.invalidateQueries({ queryKey: ["users", data.id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};

// Edit user password
const editUserPassword = async (
  id: string,
  updateData: ChangePassword
): Promise<User> => {
  const parsedData = ChangePasswordSchema.safeParse(updateData);

  if (!parsedData.success) {
    throw new Error("Invalid user password data for update");
  }

  const response = await fetch(
    QueryEndpoint.buildUrl(`accounts/${id}/password`),
    apiConfig.put(parsedData.data)
  );

  if (!response.ok) {
    throw new Error(`Failed to change password for user with ID: ${id}`);
  }

  const rawData = await response.json();
  return UserSchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for editing user password
export const useEditUserPassword = (options?: UseEditOptions<User>) => {
  const queryClient = useQueryClient();

  return useMutation<User, Error, ChangePassword>({
    mutationFn: (data) => editUserPassword(data.id, data),
    onSuccess: (data) => {
      // Invalidate queries to ensure the cache is updated
      queryClient.invalidateQueries({ queryKey: ["users", data.id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};
