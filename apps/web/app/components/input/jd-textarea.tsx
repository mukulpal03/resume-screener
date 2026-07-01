'use client';

import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import Text from '../typography/text';
import type { JDTextareaProps } from '@repo/types';
import { toast } from 'sonner';

export default function JDTextarea({
  label = 'Job Description',
  placeholder = 'Paste the job description here...',
  value,
  onChange,
  maxLength = 2000,
  className,
}: JDTextareaProps) {
  const [copied, setCopied] = useState(false);
  const charCount = value.length;
  const isNearLimit = charCount > maxLength * 0.85;

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success('Job description copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy text');
    }
  };

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
        {/* Copy button top right */}
        <div className="absolute top-3 right-3 z-10">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!value}
            className={cn(
              'w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20',
              value.length > 0
                ? 'bg-primary/10 text-primary hover:bg-primary/20 active:scale-95 cursor-pointer'
                : 'bg-muted text-muted-foreground/30 cursor-not-allowed'
            )}
            title={value.length > 0 ? 'Copy Job Description' : 'No text to copy'}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-600 transition-all duration-150 scale-110" />
            ) : (
              <Copy className="h-3.5 w-3.5 transition-colors" />
            )}
          </button>
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
