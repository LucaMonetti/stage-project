// Define filter configuration
export type FilterConfig<T extends Record<string, any>> = {
  [key in keyof T]: {
    paramName: string;
    transform?: (value: T[key]) => string;
  };
};

// Generic filter parser
export const ParseFiltersSearchParams = <T extends Record<string, any>>(
  filters: T | undefined,
  searchParams: URLSearchParams,
  config: FilterConfig<T>
) => {
  if (!filters) return;

  Object.entries(filters).forEach(([key, value]) => {
    if (value != null && value !== "" && config[key]) {
      const { paramName, transform } = config[key];
      const paramValue = transform ? transform(value) : String(value);
      searchParams.append(paramName, paramValue);
    }
  });
};
