export interface IReturn<T> {
  createResponse(): T;
}

export interface FetchData<T> {
  isLoading: boolean;
  errorMsg?: string;
  data?: T;
}

export type AllowedColors = "blue" | "purple" | "yellow" | "green";
