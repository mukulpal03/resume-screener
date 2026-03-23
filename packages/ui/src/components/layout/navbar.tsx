import { Sparkles } from 'lucide-react';
import type { NavbarProps } from '@repo/types';

export default function Navbar({ links = [] }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2 no-underline">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">ResumeAI</span>
        </a>

        <nav className="hidden md:flex items-center gap-7">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[13.5px] text-muted-foreground hover:text-foreground transition-colors duration-150 no-underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="/sign-in"
            className="text-[13.5px] text-muted-foreground hover:text-foreground transition-colors duration-150 px-3 py-1.5 no-underline"
          >
            Sign in
          </a>
          <a
            href="/sign-up"
            className="text-[13.5px] font-medium bg-primary text-primary-foreground px-4 py-1.5 rounded-lg transition-all duration-150 hover:opacity-90 no-underline"
          >
            Get started free
          </a>
        </div>
      </div>
    </header>
  );
}
