'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { fetchFromApi } from '../lib/api';

export default function ClerkUserSync() {
  const { isSignedIn } = useAuth();
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
        await fetchFromApi('/auth/sync', { method: 'POST' });
      } catch (err) {
        console.error('Clerk user sync failed:', err);
      }
    })();
  }, [isSignedIn]);

  return null;
}
