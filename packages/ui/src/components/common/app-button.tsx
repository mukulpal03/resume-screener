'use client';

import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface AppButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export default function AppButton({
  children,
  variant = 'primary',
  size = 'sm',
  loading = false,
  icon,
  className,
  ...props
}: AppButtonProps) {
  const baseStyles =
    'inline-flex  items-center justify-center gap-2 rounded-3xl font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variantStyles = {
    primary: 'bg-black text-white hover:bg-black/90 active:scale-[0.98] shadow-sm hover:shadow-md',
    secondary: 'bg-muted text-foreground hover:bg-muted/80',
    outline: 'border border-border hover:bg-muted',
  };

  const sizeStyles = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-10 px-6 text-sm',
    lg: 'h-12 px-8 text-base',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}

      {!loading && icon}

      {children}
    </button>
  );
}
