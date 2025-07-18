interface ApiConfig {
  method: "GET" | "POST" | "PUT" | "DELETE";
  headers: Record<string, string>;
  body?: string;
}

interface ApiConfigOptions {
  body?: any;
  token?: string;
  contentType?: string | null;
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

    let config: Partial<ApiConfig> = {
      method: method as ApiConfig["method"],
    };

    if (contentType != null) {
      config.headers = {
        ...config.headers,
        "Content-Type": contentType,
      };
    }

    // Add authorization header
    const authToken = token || this.getToken();
    if (authToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${authToken}`,
      };
    }

    // Add body for POST and PUT requests
    if (body && (method === "POST" || method === "PUT")) {
      config.body = typeof body === "string" ? body : JSON.stringify(body);
    }

    return config as ApiConfig;
  }

  get(options?: Omit<ApiConfigOptions, "body">): ApiConfig {
    return this.createConfig("GET", options);
  }

  post(body: any, options?: Omit<ApiConfigOptions, "body">): ApiConfig {
    return this.createConfig("POST", { ...options, body });
  }

  postFormData(body: any): Partial<ApiConfig> {
    return {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: body,
    };
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
