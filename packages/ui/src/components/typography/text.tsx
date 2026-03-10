import { cn } from '../../lib/utils';
import React from 'react';

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

interface TextProps {
  children: React.ReactNode;
  size?: TextSize;
  className?: string;
}

const sizeStyles: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl font-semibold',
  '5xl': 'text-5xl font-semibold',
  '6xl': 'text-6xl font-semibold',
  '7xl': 'text-7xl font-semibold',
};

export default function Text({ children, size = 'base', className }: TextProps) {
  return <p className={cn(sizeStyles[size], className)}>{children}</p>;
}
