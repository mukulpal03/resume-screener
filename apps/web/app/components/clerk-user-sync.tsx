'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';

export default function ClerkUserSync() {
  const { isSignedIn, getToken } = useAuth();
  const didRun = useRef(false);

  useEffect(() => {
    if (!isSignedIn) {
      didRun.current = false;
      return;
    }

    if (didRun.current) return;
    didRun.current = true;

    (async () => {
      try {
        const token = await getToken();
        if (!token) return;

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sync`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch {
        // Intentionally no UI toast: sync failures shouldn't block the user.
      }
    })();
  }, [getToken, isSignedIn]);

  return null;
}
