import React from 'react';
import { cn } from '../../lib/utils';

type TextSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl';

type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';

type TextElement = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface TextProps {
  children: React.ReactNode;
  size?: TextSize;
  weight?: FontWeight;
  as?: TextElement;
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
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
};

const weightStyles: Record<FontWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export default function Text({
  children,
  size = 'base',
  weight = 'normal',
  as: Component = 'p',
  className,
}: TextProps) {
  return (
    <Component className={cn(sizeStyles[size], weightStyles[weight], className)}>
      {children}
    </Component>
  );
}
