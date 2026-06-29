import { Sparkles } from 'lucide-react';
import { FREE_MONTHLY_ANALYSES } from '../../constants/home';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Tech stack', href: '#tech-stack' },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="flex flex-col gap-3 max-w-[280px]">
            <div className="flex items-center gap-2 font-semibold text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="tracking-tight">ResumeAI</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered resume screening. Sign in to analyze a resume against any job description —{' '}
              {FREE_MONTHLY_ANALYSES} free runs per month, with saved history.
            </p>
          </div>

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

        <div className="mt-10 border-t pt-6">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ResumeAI. Open-source portfolio project.
          </p>
        </div>
      </div>
    </footer>
  );
}
