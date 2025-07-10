import {
  type CreateUpdateList,
  CreateUpdateListSchema,
} from "../../models/FormUpdateList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateListSchema, type UpdateList } from "../../models/UpdateList";
import { API_OPTIONS_POST, queryEndpoint } from "../../config/apiConfig";

interface UseCreateUpdateListOptions {
  onSuccess?: (data: UpdateList) => void;
  onError?: (error: Error) => void;
}
const createUpdateList = async (
  createUpdateListData: CreateUpdateList
): Promise<UpdateList> => {
  const parsedData = CreateUpdateListSchema.safeParse(createUpdateListData);

  if (!parsedData.success) {
    throw new Error("Invalid updatelist data");
  }

  const options = {
    ...API_OPTIONS_POST,
    body: JSON.stringify(parsedData.data),
  };

  const response = await fetch(queryEndpoint(`updatelists`), options);

  if (!response.ok) {
    throw new Error("Failed to create updatelist");
  }

  const rawData = await response.json();
  return UpdateListSchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for creating posts
export const useCreateUpdateList = (options?: UseCreateUpdateListOptions) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateList, Error, CreateUpdateList>({
    mutationFn: createUpdateList,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["updatelists"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};
