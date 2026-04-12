'use client';

import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <main className="min-h-[calc(100vh-3.5rem)] px-6 py-14 flex items-center justify-center">
      <SignUp forceRedirectUrl="/" fallbackRedirectUrl="/" />
    </main>
  );
}
