'use client';

import { UserButton, useAuth } from '@clerk/nextjs';
import { Sparkles } from 'lucide-react';
import type { NavbarProps } from '@repo/types';
import Link from 'next/link';

export default function WebNavbar({ links = [] }: NavbarProps) {
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">ResumeAI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[13.5px] text-muted-foreground hover:text-foreground transition-colors duration-150 no-underline"
            >
              {link.label}
            </Link>
          ))}
          {isSignedIn && (
            <Link
              href="/results"
              className="text-[13.5px] text-muted-foreground hover:text-foreground transition-colors duration-150 no-underline"
            >
              My Results
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {!isSignedIn && (
            <Link
              href="/sign-in"
              className="text-[13.5px] text-muted-foreground hover:text-foreground transition-colors duration-150 px-3 py-1.5 no-underline"
            >
              Sign in
            </Link>
          )}

          {isSignedIn && (
            <div className="flex items-center gap-4">
              <Link
                href="/results"
                className="text-[13.5px] font-medium text-primary hover:text-primary/80 transition-colors duration-150 px-3 py-1.5 no-underline md:hidden"
              >
                My Results
              </Link>
              <UserButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
