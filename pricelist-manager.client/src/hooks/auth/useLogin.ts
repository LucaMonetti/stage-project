import { type UserLogin } from "../../models/UserLogin";
import {
  type AuthenticatedResponse,
  AuthenticatedResponseSchema,
} from "../../models/AuthenticatedResponse";
import { useMutation } from "@tanstack/react-query";
import { apiConfig } from "../../helpers/ApiConfig";
import QueryEndpoint from "../../helpers/queryEndpoint";

// Fetch all pricelists from the API
const login = async (
  userLoginData: UserLogin
): Promise<AuthenticatedResponse> => {
  console.log("Login request options:", apiConfig.post(userLoginData));

  const response = await fetch(
    QueryEndpoint.buildUrl("/auth/login"),
    apiConfig.post(userLoginData)
  );

  if (!response.ok) {
    throw new Error("Failed to login");
  }

  const rawData = await response.json();
  try {
    console.log(
      "Raw data received from login:",
      AuthenticatedResponseSchema.parse(rawData)
    );
  } catch (error) {
    console.error("Error parsing login response:", error);
  }

  return AuthenticatedResponseSchema.parse(rawData);
};

export const useLogin = (options?: {
  onSuccess?: (data: AuthenticatedResponse) => void;
  onError?: (error: Error) => void;
}) => {
  return useMutation<AuthenticatedResponse, Error, UserLogin>({
    mutationKey: ["auth", "login"],
    mutationFn: (data) => login(data),
    onSuccess: (data) => {
      console.log("Login successful, received data:", data);

      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};
