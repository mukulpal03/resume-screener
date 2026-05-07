'use client';

import { ApiError } from './api-error';
import { useAuth } from '@clerk/nextjs';

export function useApi() {
  const { getToken } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const fetchFromApi = async <T = any>(endpoint: string, init: RequestInit = {}): Promise<T> => {
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
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        throw new ApiError(response.statusText || 'Fetch failed', response.status);
      }

      throw new ApiError(errorData?.error?.message || 'Request failed', response.status);
    }

    if (response.status === 204) return {} as T;

    return response.json();
  };

  return { fetchFromApi };
}
