import { Sparkles } from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#' },
    { label: 'How it works', href: '#' },
    { label: 'Pricing', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Top row */}
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-3 max-w-[240px]">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="tracking-tight">ResumeAI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered resume screening. Upload, analyze, and hire smarter — in seconds.
            </p>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-10">
            {Object.entries(FOOTER_LINKS).map(([group, links]) => (
              <div key={group} className="flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {group}
                </p>
                <ul className="flex flex-col gap-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 border-t pt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ResumeAI. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
