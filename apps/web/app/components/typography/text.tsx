import { cn } from '../../lib/utils';
import type { TextProps, TextSize, FontWeight } from '@repo/types';

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
  style,
}: TextProps) {
  return (
    <Component className={cn(sizeStyles[size], weightStyles[weight], className)} style={style}>
      {children}
    </Component>
  );
}
