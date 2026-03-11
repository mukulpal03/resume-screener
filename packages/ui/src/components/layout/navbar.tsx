import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2 font-semibold text-lg cursor-pointer">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="tracking-tight">ResumeAI</span>
        </div>

        {/* Center Menu */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Dashboard
          </a>

          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            History
          </a>

          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </a>
        </nav>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Login
          </Button>

          <Button size="sm">Signup</Button>
        </div>
      </div>
    </header>
  );
}
