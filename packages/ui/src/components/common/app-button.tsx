'use client';

import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import type { AppButtonProps, AppButtonVariant, AppButtonSize } from '@repo/types';

export default function AppButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className,
  ...props
}: AppButtonProps) {
  const baseStyles = [
    'inline-flex items-center justify-center gap-2',
    'font-medium rounded-xl',
    'transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
    'cursor-pointer select-none',
    'active:scale-[0.98]',
  ].join(' ');

  const variantStyles: Record<AppButtonVariant, string> = {
    primary: [
      'bg-primary text-primary-foreground',
      'hover:opacity-90',
      'shadow-[0_2px_12px_rgba(5,150,105,0.25)]',
      'hover:shadow-[0_4px_20px_rgba(5,150,105,0.35)]',
    ].join(' '),

    secondary: ['bg-[#ECFDF5] text-primary border border-[#A7F3D0]', 'hover:bg-[#D1FAE5]'].join(
      ' '
    ),

    outline: [
      'bg-transparent text-foreground',
      'border border-border',
      'hover:bg-muted hover:border-primary/30',
    ].join(' '),
  };

  const sizeStyles: Record<AppButtonSize, string> = {
    sm: 'h-8 px-4 text-xs',
    md: 'h-10 px-5 text-sm',
    lg: 'h-11 px-7 text-[15px]',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
}
