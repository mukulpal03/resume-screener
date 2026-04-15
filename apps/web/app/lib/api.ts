import { auth } from '@clerk/nextjs/server';
import { ApiError } from './api-error';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchFromApi<T = any>(endpoint: string, init: RequestInit = {}): Promise<T> {
  const { getToken } = await auth();
  const token = await getToken();

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...init,
    headers: {
      ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!response.ok) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let errorData: any;
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
    return {} as T;
  }

  return response.json();
}
