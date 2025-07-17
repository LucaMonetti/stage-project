interface QueryEndpointConfig {
  baseUrl?: string;
  version?: string;
  endpoints?: Record<string, string>;
}

class QueryEndpoint {
  static getEndpoint(
    name: string,
    config: QueryEndpointConfig = {},
    params?: Record<string, string | number>
  ): string {
    const baseUrl = config.baseUrl || "/api";
    const version = config.version || "v1";
    const endpoints = config.endpoints || {};

    const path = endpoints[name];
    if (!path) {
      throw new Error(`Endpoint '${name}' not found`);
    }

    let url = `${baseUrl}/${version}/${path}`;

    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
      url += `?${queryString}`;
    }

    return url;
  }

  static getBaseUrl(config: QueryEndpointConfig = {}): string {
    const baseUrl = config.baseUrl || "/api";
    const version = config.version || "v1";
    return `${baseUrl}/${version}`;
  }

  static buildUrl(
    path: string,
    config: QueryEndpointConfig = {},
    params?: Record<string, string | number>
  ): string {
    const baseUrl = config.baseUrl || "/api";
    const version = config.version || "v1";

    let url = `${baseUrl}/${version}/${path}`;

    if (params) {
      const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");
      url += `?${queryString}`;
    }

    return url;
  }
}

export default QueryEndpoint;
