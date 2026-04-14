import { auth } from '@clerk/nextjs/server';

// TODO: replace fetch with axios when implementing the APIs

export async function fetchFromApi(endpoint: string, init: RequestInit = {}) {
  const { getToken } = await auth();
  const token = await getToken();

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
