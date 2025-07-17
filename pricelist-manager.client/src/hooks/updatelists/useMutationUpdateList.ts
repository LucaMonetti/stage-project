import {
  type AddProductsUpdateList,
  AddProductsUpdateListSchema,
  type CreateUpdateList,
  CreateUpdateListSchema,
  type EditUpdateList,
  EditUpdateListSchema,
} from "../../models/FormUpdateList";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateListSchema, type UpdateList } from "../../models/UpdateList";
import {
  API_OPTIONS_DELETE,
  API_OPTIONS_POST,
  API_OPTIONS_PUT,
  queryEndpoint,
} from "../../config/apiConfig";
import { Status, type UseEditOptions } from "../../types";
import z from "zod/v4";

interface UseCreateUpdateListOptions {
  onSuccess?: (
    data: UpdateList | { updatelistId: string; productId: string }
  ) => void;
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
    mutationKey: ["updatelists", "create"],
    mutationFn: createUpdateList,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["updatelists"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      console.error("Error creating updatelist:", err);
      options?.onError?.(err);
    },
  });
};

// Edit pricelist function
const editUpdateList = async (
  id: string,
  updateData: EditUpdateList
): Promise<UpdateList> => {
  const parsedData = EditUpdateListSchema.safeParse(updateData);

  if (!parsedData.success) {
    throw new Error("Invalid updatelist data for update");
  }

  const options = {
    ...API_OPTIONS_PUT,
    body: JSON.stringify(parsedData.data),
  };

  const response = await fetch(queryEndpoint(`updatelists/${id}`), options);

  if (!response.ok) {
    throw new Error(`Failed to update updatelist with ID: ${id}`);
  }

  const rawData = await response.json();
  return UpdateListSchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for editing updatelist
export const useEditUpdateList = (options?: UseEditOptions<UpdateList>) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateList, Error, EditUpdateList>({
    mutationKey: ["updatelists", "edit"],
    mutationFn: (data) => editUpdateList(data.id, data),
    onSuccess: (data) => {
      // Invalidate queries to ensure the cache is updated
      queryClient.invalidateQueries({ queryKey: ["updatelists", data.id] });
      queryClient.invalidateQueries({ queryKey: ["updatelists"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};

// Edit pricelist function
const editUpdateListProducts = async (
  id: string,
  updateData: AddProductsUpdateList
): Promise<UpdateList> => {
  const parsedData = AddProductsUpdateListSchema.safeParse(updateData);

  if (!parsedData.success) {
    throw new Error("Invalid updatelistProducts data for update");
  }

  const options = {
    ...API_OPTIONS_POST,
    body: JSON.stringify(parsedData.data),
  };

  const response = await fetch(
    queryEndpoint(`updatelists/${id}/products`),
    options
  );

  if (!response.ok) {
    throw new Error(`Failed to update updatelist products with ID: ${id}`);
  }

  const rawData = await response.json();
  return UpdateListSchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for editing updatelist
export const useEditUpdateListProducts = (
  options?: UseEditOptions<UpdateList>
) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateList, Error, AddProductsUpdateList>({
    mutationKey: ["updatelists", "edit-products"],
    mutationFn: (data) => editUpdateListProducts(data.id, data),
    onSuccess: (data) => {
      // Invalidate queries to ensure the cache is updated
      queryClient.invalidateQueries({
        queryKey: ["updatelists", data.id, "products"],
      });
      queryClient.invalidateQueries({ queryKey: ["updatelists"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};
// Edit pricelist function
const editUpdateListStatus = async (
  id: number,
  updateData: { id: number; status: Status }
): Promise<UpdateList> => {
  const parsedData = z
    .object({ id: z.number(), status: z.enum(Status) })
    .safeParse(updateData);

  if (!parsedData.success) {
    throw new Error("Invalid updatelist data for update");
  }

  const options = {
    ...API_OPTIONS_PUT,
    body: JSON.stringify(parsedData.data),
  };

  const response = await fetch(
    queryEndpoint(`updatelists/${id}/status`),
    options
  );

  if (!response.ok) {
    throw new Error(`Failed to update updatelist with ID: ${id}`);
  }

  const rawData = await response.json();
  return UpdateListSchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for editing updatelist
export const useEditUpdateListStatus = (
  options?: UseEditOptions<UpdateList>
) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateList, Error, { id: number; status: Status }>({
    mutationKey: ["updatelists", "edit-status"],
    mutationFn: (data) => editUpdateListStatus(data.id, data),
    onSuccess: (data) => {
      // Invalidate queries to ensure the cache is updated
      queryClient.invalidateQueries({
        queryKey: ["updatelists", data.id, "products"],
      });
      queryClient.invalidateQueries({ queryKey: ["updatelists"] });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};

// Delete updatelist
const deleteUpdateList = async (id: number): Promise<UpdateList> => {
  const response = await fetch(
    queryEndpoint(`updatelists/${id}`),
    API_OPTIONS_DELETE
  );

  if (!response.ok) {
    throw new Error(`Failed to DELETE updatelist with ID: ${id}`);
  }

  const rawData = await response.json();
  return UpdateListSchema.parse(rawData);
};

// Custom hook to encapsulate the useMutation logic for editing updatelist
export const useDeleteUpdateList = (options?: UseEditOptions<UpdateList>) => {
  const queryClient = useQueryClient();

  return useMutation<UpdateList, Error, number>({
    mutationKey: ["updatelists", "delete"],
    mutationFn: (data) => deleteUpdateList(data),
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ["updatelists", data.id] });
      queryClient.invalidateQueries({
        queryKey: ["updatelists"],
        refetchType: "all",
      });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};

// Delete updatelist
const deleteUpdateListProduct = async (
  updateListId: string,
  productId: string
): Promise<{ updatelistId: string; productId: string }> => {
  const searchParams = new URLSearchParams();
  if (productId) {
    searchParams.append("productId", productId);
  }

  const response = await fetch(
    queryEndpoint(
      `updatelists/${updateListId}/products${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`
    ),
    API_OPTIONS_DELETE
  );

  if (!response.ok) {
    throw new Error(
      `Failed to DELETE product ${productId} updatelist with ID: ${updateListId}`
    );
  }

  return { updatelistId: updateListId, productId: productId };
};

// Custom hook to encapsulate the useMutation logic for editing updatelist
export const useDeleteUpdatelistProduct = (
  options?: UseEditOptions<{ updatelistId: string; productId: string }>
) => {
  const queryClient = useQueryClient();

  return useMutation<
    { updatelistId: string; productId: string },
    Error,
    { updateListId: string; productId: string }
  >({
    mutationKey: ["updatelists", "delete", "products"],
    mutationFn: (data) =>
      deleteUpdateListProduct(data.updateListId, data.productId),
    onSuccess: (data) => {
      queryClient.removeQueries({
        queryKey: [
          "updatelists",
          data.updatelistId,
          "products-to-updatelist",
          data.productId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: ["updatelists"],
        refetchType: "all",
      });
      options?.onSuccess?.(data);
    },
    onError: (err) => {
      options?.onError?.(err);
    },
  });
};
