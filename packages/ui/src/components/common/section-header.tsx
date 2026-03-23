import { cn } from '../../lib/utils';
import type { SectionHeaderProps } from '@repo/types';

const serifStyle = { fontFamily: 'var(--font-serif)' };

export default function SectionHeader({
  label,
  heading,
  subtext,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col',
        align === 'center' && 'items-center text-center mx-auto',
        className
      )}
    >
      {/* Label */}
      {label && (
        <div className="inline-flex items-center gap-2 mb-4 self-start">
          {align === 'center' && <div className="self-center" />}
          <span
            className={cn(
              'inline-flex items-center gap-1.5',
              'text-[11px] font-semibold uppercase tracking-[0.1em]',
              'text-primary',
              align === 'center' && 'mx-auto'
            )}
          >
            <span className="w-1 h-1 rounded-full bg-primary inline-block" />
            {label}
          </span>
        </div>
      )}

      {/* Heading */}
      <h2
        className={cn(
          'text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.025em]',
          'text-foreground font-bold mb-4',
          align === 'center' ? 'max-w-[640px] mx-auto' : 'max-w-[600px]'
        )}
        style={serifStyle}
      >
        {heading}
      </h2>

      {/* Subtext */}
      {subtext && (
        <p
          className={cn(
            'text-[15px] text-muted-foreground leading-[1.7] font-light',
            align === 'center' ? 'max-w-[480px] mx-auto' : 'max-w-[480px]'
          )}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
