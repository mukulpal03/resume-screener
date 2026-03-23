import { cn } from '../../lib/utils';
import type { SpinnerProps } from '@repo/types';

export function Spinner({ className }: SpinnerProps) {
  return (
    <div className={cn('relative flex-shrink-0', className)}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-[3px] border-primary/20" />
      {/* Spinning ring */}
      <div className="absolute inset-0 rounded-full border-[3px] border-primary border-t-transparent animate-spin" />
      {/* Inner dot */}
      <div className="absolute inset-[30%] rounded-full bg-primary/30" />
    </div>
  );
}
