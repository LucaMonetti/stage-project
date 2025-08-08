import {
  type CreateCompany,
  CreateCompanySchema,
  type EditCompany,
  EditCompanySchema,
} from "../../models/FormCompany";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CompanySchema, type Company } from "../../models/Company";
import type { UseEditOptions } from "../../types";
import QueryEndpoint from "../../helpers/queryEndpoint";
import { apiConfig } from "../../helpers/ApiConfig";

interface UseCreateCompanyOptions {
  onSuccess?: (data: Company) => void;
  onError?: (error: Error) => void;
}
const createCompany = async (
  createCompanyData: CreateCompany
): Promise<Company> => {
  const parsedData = CreateCompanySchema.safeParse(createCompanyData);

  const formData = new FormData();
  formData.append("id", parsedData.data?.id || "");
  formData.append("name", parsedData.data?.name || "");
  formData.append("postalCode", parsedData.data?.postalCode || "");
  formData.append("address", parsedData.data?.address || "");
  formData.append("province", parsedData.data?.province || "");
  formData.append("phone", parsedData.data?.phone || "");
  formData.append("logo", parsedData.data?.logo[0] || new Blob());
  formData.append("interfaceColor", parsedData.data?.interfaceColor || "");

  if (!parsedData.success) {
    console.error("Invalid company data", parsedData);
    throw new Error("Invalid company data");
  }

  const response = await fetch(
    QueryEndpoint.buildUrl("companies"),
    apiConfig.postFormData(formData)
  );

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

// Edit company function
const editCompany = async (
  id: string,
  updateData: EditCompany
): Promise<Company> => {
  const parsedData = EditCompanySchema.safeParse(updateData);

  if (!parsedData.success) {
    throw new Error("Invalid company data for update");
  }

  const response = await fetch(
    QueryEndpoint.buildUrl(`companies/${id}`),
    apiConfig.put(parsedData.data)
  );

  if (!response.ok) {
    throw new Error(`Failed to update compay with ID: ${id}`);
  }

  const rawData = await response.json();
  return CompanySchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for editing company
export const useEditCompany = (options?: UseEditOptions<Company>) => {
  const queryClient = useQueryClient();

  return useMutation<Company, Error, EditCompany>({
    mutationFn: (data) => editCompany(data.id, data),
    onSuccess: (data) => {
      // Invalidate queries to ensure the cache is updated
      queryClient.invalidateQueries({ queryKey: ["companies", data.id] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};
