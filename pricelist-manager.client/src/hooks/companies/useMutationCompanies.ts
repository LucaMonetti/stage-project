import {
  type CreateCompany,
  CreateCompanySchema,
} from "../../models/FormCompany";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanySchema, type Company } from "../../models/Company";
import { API_OPTIONS_POST, queryEndpoint } from "../../config/apiConfig";

interface UseCreateCompanyOptions {
  onSuccess?: (data: Company) => void;
  onError?: (error: Error) => void;
}
const createCompany = async (
  createCompanyData: CreateCompany
): Promise<Company> => {
  const parsedData = CreateCompanySchema.safeParse(createCompanyData);

  if (!parsedData.success) {
    throw new Error("Invalid company data");
  }

  const options = {
    ...API_OPTIONS_POST,
    body: JSON.stringify(parsedData.data),
  };

  const response = await fetch(queryEndpoint(`companies`), options);

  if (!response.ok) {
    throw new Error("Failed to create company");
  }

  const rawData = await response.json();
  return CompanySchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for creating posts
export const useCreateCompany = (options?: UseCreateCompanyOptions) => {
  const queryClient = useQueryClient();

  return useMutation<Company, Error, CreateCompany>({
    mutationFn: createCompany,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};
