const API_URL = (
  (import.meta as any).env?.VITE_API_URL ??
  "http://localhost:3000/api"
).replace(/\/$/, "");

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Error ${response.status}`;

    try {
      const errorData = await response.json();
      message = errorData?.detail ?? errorData?.message ?? message;
    } catch {
      // Mantener mensaje por defecto
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const apiFetch = apiRequest;

export { API_URL };