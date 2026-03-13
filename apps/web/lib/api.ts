import { auth } from '@clerk/nextjs/server';

// TODO: replace fetch with axios when implementing the APIs

export async function fetchFromApi(endpoint: string) {
  const { getToken } = await auth();
  const token = await getToken();

  return fetch(`${process.env.API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
