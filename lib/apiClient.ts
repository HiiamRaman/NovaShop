export interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: unknown;
  errors?: unknown[];
}

async function request(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse> {
  const response = await fetch(url, {
    ...options,

    // Send authentication cookies with every request.
    credentials: "include",

    // Always fetch current data.
    cache: "no-store",

    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = (await response.json()) as ApiResponse;

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong");
  }

  return result;
}

export const api = {
  get(url: string) {
    return request(url, {
      method: "GET",
    });
  },

  post(url: string, body?: unknown) {
    return request(url, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  patch(url: string, body?: unknown) {
    return request(url, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete(url: string, body?: unknown) {
    return request(url, {
      method: "DELETE",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },
};
