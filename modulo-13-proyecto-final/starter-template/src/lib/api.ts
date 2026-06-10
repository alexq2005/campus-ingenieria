/**
 * Cliente HTTP tipado.
 * Reemplazá `BASE_URL` por la URL de tu API real o usá `import.meta.env.VITE_API_URL`.
 */

const BASE_URL = import.meta.env.VITE_API_URL ?? '';

class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

type RequestOptions = RequestInit & { signal?: AbortSignal };

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const r = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  if (!r.ok) {
    let body: unknown;
    try {
      body = await r.json();
    } catch {
      body = await r.text();
    }
    throw new HttpError(`HTTP ${r.status} en ${url}`, r.status, body);
  }

  if (r.status === 204) return undefined as T;
  return (await r.json()) as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) => request<T>(path, { ...options, method: 'GET' }),

  post: <T, B = unknown>(path: string, body: B, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body: JSON.stringify(body) }),

  put: <T, B = unknown>(path: string, body: B, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body: JSON.stringify(body) }),

  patch: <T, B = unknown>(path: string, body: B, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body: JSON.stringify(body) }),

  delete: <T = void>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};

export { HttpError };
