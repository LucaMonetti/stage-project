export interface IReturn<T> {
  createResponse(): T;
}

export interface FetchData<T> {
  isLoading: boolean;
  errorMsg?: string;
  data?: T;
  refetch: () => void;
}

export type AllowedColors = "blue" | "purple" | "yellow" | "green" | "red";

export const Status = {
  Edited: 0,
  Pending: 1,
} as const;

export const StatusLabel: Record<Status, string> = {
  "0": "Completata",
  "1": "In Corso",
};

export type Status = (typeof Status)[keyof typeof Status];

export interface UseCreateOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export interface UseEditOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}
