interface ApiConfig {
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers: Record<string, string>;
  body?: string;
}

interface ApiConfigOptions {
  body?: any;
  token?: string;
  contentType?: string;
}

class ApiConfigFactory {
  private getToken(): string | null {
    return localStorage.getItem("jwtToken");
  }

  private createConfig(
    method: string,
    options: ApiConfigOptions = {}
  ): ApiConfig {
    const { body, token, contentType = "application/json" } = options;

    const config: ApiConfig = {
      method: method as ApiConfig["method"],
      headers: {
        "Content-Type": contentType,
      },
    };

    // Add authorization header
    const authToken = token || this.getToken();
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }

    // Add body for POST and PUT requests
    if (body && (method === "POST" || method === "PUT")) {
      config.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    return config;
  }

  get(options?: Omit<ApiConfigOptions, "body">): ApiConfig {
    return this.createConfig("GET", options);
  }

  post(body: any, options?: Omit<ApiConfigOptions, "body">): ApiConfig {
    return this.createConfig("POST", { ...options, body });
  }

  put(body: any, options?: Omit<ApiConfigOptions, "body">): ApiConfig {
    return this.createConfig("PUT", { ...options, body });
  }

  delete(options?: Omit<ApiConfigOptions, "body">): ApiConfig {
    return this.createConfig("DELETE", options);
  }
}

export const apiConfig = new ApiConfigFactory();
export type { ApiConfig, ApiConfigOptions };
