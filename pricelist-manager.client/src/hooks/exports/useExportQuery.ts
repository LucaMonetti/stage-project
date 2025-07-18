import { useQuery } from "@tanstack/react-query";
import QueryEndpoint from "../../helpers/queryEndpoint";
import { apiConfig } from "../../helpers/ApiConfig";

// Fetch all products from the API
const fetchExportCSV = async (url: string): Promise<void> => {
  const response = await fetch(
    QueryEndpoint.buildUrl(`export/${url}`),
    apiConfig.get({
      contentType: "application/csv",
    })
  );
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const blob = await response.blob();

  // Simulate Download link
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute(
    "download",
    `${url.split("/").join("_")}_${Date.now()}.csv`
  );
  document.body.appendChild(link);

  // Download the file and remove link
  link.click();
  document.body.removeChild(link);
};

export const useExportCSV = (url: string, options?: { enabled?: boolean }) => {
  return useQuery<void>({
    queryKey: ["companies"],
    queryFn: () => fetchExportCSV(url),
    enabled: options?.enabled !== false && !!url,
  });
};
