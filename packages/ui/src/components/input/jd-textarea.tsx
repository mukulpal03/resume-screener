'use client';

import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { FileText } from 'lucide-react';
import { cn } from '../../lib/utils';

interface JDTextareaProps {
  label?: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export default function JDTextarea({
  label = 'Job Description',
  placeholder = 'Paste the job description here...',
  maxLength = 2000,
  className,
}: JDTextareaProps) {
  const [value, setValue] = useState('');

  return (
    <Card className="w-full border-dashed border-2">
      <CardHeader className="items-center text-center">
        <FileText className="h-8 w-8 text-muted-foreground" />

        <CardTitle className="mt-2 text-lg">{label}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={cn('min-h-[160px] resize-none', className)}
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Paste the job description to analyze your resume</span>

          <span>
            {value.length}/{maxLength}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
