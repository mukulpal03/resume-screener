import { cn } from '../../lib/utils';
import type { BadgeProps, BadgeVariant } from '@repo/types';

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-muted text-muted-foreground border border-border',
    primary: 'bg-[#ECFDF5] text-primary border border-[#A7F3D0]',
    success: 'bg-[#ECFDF5] text-primary border border-[#A7F3D0]',
    outline: 'bg-transparent border border-primary/30 text-primary',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
