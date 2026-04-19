import { ApiError } from './api-error';

export async function fetchFromApi(endpoint: string, init: RequestInit = {}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...init,
    headers: {
      ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init.headers ?? {}),
    },
    credentials: 'include',
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      // Fallback if response is not JSON
      throw new ApiError(response.statusText || 'Fetch failed', response.status);
    }

    // Extract message from standard backend error format: { success, error: { message, code } }
    const message =
      errorData?.error?.message || response.statusText || 'An unexpected error occurred';
    const code = errorData?.error?.code;

    throw new ApiError(message, response.status, code);
  }

  // Handle empty responses (like 204 No Content)
  if (response.status === 204) {
    return {};
  }

  return response.json();
}
