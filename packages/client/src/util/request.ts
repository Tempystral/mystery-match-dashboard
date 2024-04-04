// Referenced from https://douglasmoura.dev/en-US/using-fetch-with-typescript

class HTTPError extends Error {
  // eslint-disable-next-line tseslint/no-explicit-any
  readonly response: any;
  readonly status: number;
  readonly statusText: string;

  // eslint-disable-next-line tseslint/no-explicit-any
  constructor(status: number, statusText: string, response: any) {
    super(statusText);
    this.status = status;
    this.statusText = statusText;
    this.response = response;
  }
}

const createQuery = (baseUrl: RequestInfo | URL = "", baseConfig?: RequestInit) => {
  return <T = unknown>(url: RequestInfo | URL, config: RequestInit) => {
    return fetch(`${baseUrl}${url}`, { ...baseConfig, ...config }).then(async (res) => {
      const response = await res.json();

      if (!res.ok) {
        throw new HTTPError(res.status, res.statusText, response);
      }
      return response as T;
    });
  };
};

const query = createQuery(import.meta.env.VITE_BACKEND_URL, {
  mode: "cors",
  headers: {
    "Content-Type": "application/json",
  },
});

const makeRequest = (method: RequestInit["method"]) => {
  return <TResponse = unknown, TBody = Record<string, unknown>>(url: RequestInfo | URL, body: TBody) => {
    return query<TResponse>(url, { method, body: JSON.stringify(body) });
  };
};

export const api = {
  get: query,
  post: makeRequest("POST"),
  delete: makeRequest("DELETE"),
  put: makeRequest("PUT"),
  patch: makeRequest("PATCH"),
};
