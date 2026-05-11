'use client';

import { Textarea } from '../ui/textarea';
import { FileText } from 'lucide-react';
import { cn } from '../../lib/utils';
import Text from '../typography/text';
import type { JDTextareaProps } from '@repo/types';

export default function JDTextarea({
  label = 'Job Description',
  placeholder = 'Paste the job description here...',
  value,
  onChange,
  maxLength = 2000,
  className,
}: JDTextareaProps) {
  const charCount = value.length;
  const isNearLimit = charCount > maxLength * 0.85;

  return (
    <div className="flex flex-col gap-2">
      <Text size="sm" weight="medium" className="text-foreground">
        {label}
      </Text>

      <div
        className={cn(
          'relative rounded-xl border-2 border-dashed transition-all duration-200',
          value.length > 0
            ? 'border-primary/40 bg-primary/5'
            : 'border-border bg-muted/30 focus-within:border-primary/40 focus-within:bg-primary/5'
        )}
      >
        {/* Icon top right */}
        <div className="absolute top-3 right-3 z-10">
          <div
            className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
              value.length > 0 ? 'bg-primary/10' : 'bg-muted'
            )}
          >
            <FileText
              className={cn(
                'h-3.5 w-3.5 transition-colors',
                value.length > 0 ? 'text-primary' : 'text-muted-foreground'
              )}
            />
          </div>
        </div>

        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={cn(
            'min-h-[180px] resize-none border-0 bg-transparent',
            'focus-visible:ring-0 focus-visible:ring-offset-0',
            'text-sm placeholder:text-muted-foreground/50',
            'pt-4 pr-12',
            className
          )}
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-3 pb-3">
          <Text size="xs" className="text-muted-foreground/60">
            Paste the full job description for best results
          </Text>
          <Text
            as="span"
            size="xs"
            className={cn(
              'tabular-nums transition-colors',
              isNearLimit ? 'text-amber-500' : 'text-muted-foreground/60'
            )}
          >
            {charCount}/{maxLength}
          </Text>
        </div>
      </div>
    </div>
  );
}
