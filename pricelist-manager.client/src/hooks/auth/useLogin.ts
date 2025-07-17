import { type UserLogin } from "../../models/UserLogin";
import {
  type AuthenticatedResponse,
  AuthenticatedResponseSchema,
} from "../../models/AuthenticatedResponse";
import { API_OPTIONS_POST, queryEndpoint } from "../../config/apiConfig";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../components/Authentication/AuthenticationProvider";

// Fetch all pricelists from the API
const login = async (
  userLoginData: UserLogin
): Promise<AuthenticatedResponse> => {
  const options = {
    ...API_OPTIONS_POST,
    body: JSON.stringify(userLoginData),
  };

  console.log("Login request options:", options);

  const response = await fetch(queryEndpoint("auth/login"), options);

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
  const context = useAuth();

  return useMutation<AuthenticatedResponse, Error, UserLogin>({
    mutationKey: ["auth", "login"],
    mutationFn: (data) => login(data),
    onSuccess: (data) => {
      console.log("Login successful, received data:", data);

      context.login(data.token);
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};
