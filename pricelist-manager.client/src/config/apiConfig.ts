export const API_BASE_URL = "/api";

export const API_DEFAULT_VERSION = "v1";

export const API_OPTIONS_GET = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

export const API_OPTIONS_POST = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
};
export const API_OPTIONS_PUT = {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
};
export const API_OPTIONS_DELETE = {
  method: "DELETE",
  headers: {
    accept: "application/json",
  },
};

export const queryEndpoint = (
  endpotin: string,
  version: string = API_DEFAULT_VERSION
): string => {
  return `${API_BASE_URL}/${version}/${endpotin}`;
};
