export interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: unknown;
  errors?: unknown[];
}

/*
Prepare the request body based on its type.

- FormData is sent directly.
- Normal objects are converted to JSON.
*/
function prepareBody(
  body?: unknown
): BodyInit | undefined {
  if (body === undefined) {
    return undefined;
  }

  if (body instanceof FormData) {
    return body;
  }

  return JSON.stringify(body);
}

async function request(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse> {
  const isFormData =
    options.body instanceof FormData;

  const headers =
    new Headers(options.headers);

  /*
  Do not manually set Content-Type for FormData.

  The browser must add:
  multipart/form-data; boundary=...
  */
  if (
    options.body !== undefined &&
    !isFormData &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json"
    );
  }

  const response = await fetch(url, {
    ...options,
    credentials: "include",
    cache: "no-store",
    headers,
  });

  const result =
    (await response.json()) as ApiResponse;

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Something went wrong"
    );
  }

  return result;
}

export const api = {
  get(url: string) {
    return request(url, {
      method: "GET",
    });
  },

  post(
    url: string,
    body?: unknown
  ) {
    return request(url, {
      method: "POST",
      body: prepareBody(body),
    });
  },

  patch(
    url: string,
    body?: unknown
  ) {
    return request(url, {
      method: "PATCH",
      body: prepareBody(body),
    });
  },

  delete(
    url: string,
    body?: unknown
  ) {
    return request(url, {
      method: "DELETE",
      body: prepareBody(body),
    });
  },
};
