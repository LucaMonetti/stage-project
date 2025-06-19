import { useEffect, useState } from "react";
import type { FetchData } from "../types";
import type { z, ZodType } from "zod/v4";

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

export function useFetch<TSchema extends ZodType>(
  endpoint: string,
  schema: TSchema
): FetchData<z.infer<TSchema>> {
  const [data, setData] = useState<z.infer<TSchema>>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch API!");
      }

      const json = await response.json();
      const result = schema.safeParse(json);

      if (result.success) {
        setData(result.data);
      } else {
        console.error(result.error);
        setErrorMsg("Validation failed.");
      }
    } catch (error) {
      console.error(`Error fetching API: ${error}`);
      setErrorMsg("Fetch error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [endpoint]);

  return { isLoading, data, errorMsg } satisfies FetchData<z.infer<TSchema>>;
}
