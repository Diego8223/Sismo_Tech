const API_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export async function apiRequest<T>(
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
    let message = `Error ${response.status}: no fue posible completar la solicitud.`;

    try {
      const errorData = await response.json();

      if (errorData?.message) {
        message = errorData.message;
      }
    } catch {
      // La respuesta no era JSON
    }

    throw new Error(message);
  }

  // Algunas respuestas pueden ser 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export { API_URL };