import { Sparkles } from 'lucide-react';
import type { NavbarProps } from '@repo/types';
import Link from 'next/link';

export default function Navbar({ links = [] }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-[rgba(5,150,105,0.08)]" />

      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-[0_2px_8px_rgba(5,150,105,0.35)] transition-all duration-200 group-hover:shadow-[0_4px_12px_rgba(5,150,105,0.45)] group-hover:scale-105">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span
              className="text-[15px] font-bold tracking-tight text-foreground leading-none"
              style={{ fontFamily: 'var(--font-playfair)' }}
            >
              ResumeAI
            </span>
            <span className="text-[9px] font-medium text-primary tracking-[0.12em] uppercase leading-none mt-0.5">
              AI Screener
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative text-[13px] font-medium text-muted-foreground hover:text-foreground transition-all duration-150 no-underline px-3.5 py-2 rounded-lg hover:bg-primary/5 group"
            >
              {link.label}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-primary rounded-full transition-all duration-200 group-hover:w-4" />
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-all duration-150 px-3.5 py-2 rounded-lg hover:bg-muted no-underline"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="group relative inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary-foreground no-underline overflow-hidden rounded-xl px-4 py-2 transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              boxShadow: '0 2px 10px rgba(5,150,105,0.3)',
            }}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            <Sparkles className="h-3.5 w-3.5 relative z-10" />
            <span className="relative z-10">Sign up free</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
