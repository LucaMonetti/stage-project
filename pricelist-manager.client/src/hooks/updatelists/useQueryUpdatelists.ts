import { useQuery } from "@tanstack/react-query";
import {
  UpdateListArraySchema,
  UpdateListSchema,
  type UpdateList,
} from "../../models/UpdateList";
import { API_OPTIONS_GET, queryEndpoint } from "../../config/apiConfig";
import { Status } from "../../types";
import {
  UpdateListProductArraySchema,
  type UpdateListProduct,
} from "../../models/UpdateListProduct";

// Fetch all updatelists from the API
const fetchAllUpdateLists = async (): Promise<UpdateList[]> => {
  const response = await fetch(queryEndpoint("updatelists"), API_OPTIONS_GET);
  if (!response.ok) {
    throw new Error("Failed to fetch updatelists");
  }
  const rawData = await response.json();
  return UpdateListArraySchema.parse(rawData);
};

export const useAllUpdateLists = () => {
  return useQuery<UpdateList[]>({
    queryKey: ["updatelists"],
    queryFn: fetchAllUpdateLists,
  });
};

// Fetch a single updatelist by ID from the API
const fetchUpdateList = async (updatelistId: string): Promise<UpdateList> => {
  const response = await fetch(
    queryEndpoint(`updatelists/${updatelistId}`),
    API_OPTIONS_GET
  );
  if (!response.ok) {
    throw new Error("Failed to fetch updatelist");
  }
  const rawData = await response.json();
  return UpdateListSchema.parse(rawData);
};

export const useUpdateList = (updatelistId: string) => {
  return useQuery<UpdateList>({
    queryKey: ["updatelists", updatelistId],
    queryFn: () => fetchUpdateList(updatelistId),
  });
};

// Fetch a single updatelist by ID from the API
const fetchProductToUpdatelistByStatus = async (
  updatelistId: string,
  status: Status
): Promise<UpdateListProduct[]> => {
  const response = await fetch(
    queryEndpoint(`updatelists/${updatelistId}/products?status=${status}`),
    API_OPTIONS_GET
  );
  if (!response.ok) {
    throw new Error("Failed to fetch updatelist");
  }
  const rawData = await response.json();
  return UpdateListProductArraySchema.parse(rawData);
};

export const useProductsByStatus = (updatelistId: string, status: Status) => {
  return useQuery<UpdateListProduct[]>({
    queryKey: ["updatelists", updatelistId, "products-to-updatelist", status],
    queryFn: () => fetchProductToUpdatelistByStatus(updatelistId, status),
  });
};
