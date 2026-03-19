import type { ReactNode, ButtonHTMLAttributes, CSSProperties } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'outline';
export type Alignment = 'left' | 'center';
export type AppButtonVariant = 'primary' | 'secondary' | 'outline';
export type AppButtonSize = 'sm' | 'md' | 'lg';
export type TextSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl';
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextElement = 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export interface SectionHeaderProps {
  label?: string;
  heading: string;
  subtext?: string;
  align?: Alignment;
  className?: string;
}

export interface StarRatingProps {
  count?: number;
  className?: string;
}

export interface AppButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  loading?: boolean;
  icon?: ReactNode;
}

export interface SpinnerProps {
  className?: string;
}

export interface TextProps {
  children: ReactNode;
  size?: TextSize;
  weight?: FontWeight;
  as?: TextElement;
  className?: string;
  style?: CSSProperties;
}

export interface UploadResumeCardProps {
  onUpload: (_: File) => Promise<void>;
}

export interface JDTextareaProps {
  value: string;
  onChange: (_: string) => void;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}
