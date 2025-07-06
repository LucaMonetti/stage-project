import { useEffect, useState } from "react";
import { ZodType, z } from "zod/v4";
import type { FetchData } from "../types";
import type {
  FieldErrors,
  FieldValues,
  FormState,
  UseFormSetError,
} from "react-hook-form";

const DEFAULT_API_VERSION = "v1";

interface BaseProps<T extends ZodType> {
  endpoint: string;
  schema: T;
  apiVersion?: string;
}

interface GETProps<T extends ZodType> extends BaseProps<T> {
  method: "GET";
}

interface POSTProps<T extends ZodType<any> & { _output: FieldValues }>
  extends BaseProps<T> {
  method: "POST" | "PUT" | "DELETE";
  body: z.infer<T>;
  setError: UseFormSetError<z.infer<T>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fieldErrors: FieldErrors<z.infer<T>>;
}

type FetchProps<T extends ZodType<any> & { _output: FieldValues }> =
  | GETProps<T>
  | POSTProps<T>;

export function useFetch<T extends ZodType<any> & { _output: FieldValues }>(
  props: FetchProps<T>
) {
  switch (props.method) {
    case "GET":
      return useGet<T>(props);
    case "POST":
    case "PUT":
      return usePost<T>(props);
  }
}

export function useGet<T extends ZodType>(props: GETProps<T>) {
  const [data, setData] = useState<z.infer<T>>();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>();

  const apiVersion = props.apiVersion ?? DEFAULT_API_VERSION;
  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/${apiVersion}/${props.endpoint}`,
        API_OPTIONS
      );

      if (!response.ok) {
        throw new Error("Failed to fetch API!");
      }

      const json = await response.json();
      const result = props.schema.safeParse(json);

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
  }, [props.endpoint]);

  const refetch = () => {
    fetchData();
  };

  return { isLoading, data, errorMsg, refetch } satisfies FetchData<z.infer<T>>;
}

export function usePost<T extends ZodType<any> & { _output: FieldValues }>(
  props: POSTProps<T>
) {
  const apiVersion = props.apiVersion ?? DEFAULT_API_VERSION;
  const API_OPTIONS = {
    method: props.method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(props.body),
  };

  const handleBackendErrors = (errorData: any) => {
    // Handle field-specific errors
    if (errorData.errors) {
      Object.keys(errorData.errors).forEach((field) => {
        props.setError(field as any, {
          message: errorData.errors[field][0],
        });
      });
    }

    // Handle general/root errors
    if (errorData.message) {
      props.setError("root", { message: errorData.message });
    }

    if (props.fieldErrors.root) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const fetchData = async () => {
    try {
      props.setIsLoading(true);

      const response = await fetch(
        `/api/${apiVersion}/${props.endpoint}`,
        API_OPTIONS
      );

      // More explicit status checking
      if (response.status >= 400) {
        const errorData = await response.json();
        handleBackendErrors(errorData);
        return;
      }

      const res = await response.json();

      console.log(res);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      props.setIsLoading(false);
    }
  };

  fetchData();
}
