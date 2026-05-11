import { cn } from '../../lib/utils';
import type { StarRatingProps } from '@repo/types';

export default function StarRating({ count = 5, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 1L8.8 5.1L13.3 5.5L10 8.4L11 12.8L7 10.4L3 12.8L4 8.4L0.7 5.5L5.2 5.1L7 1Z"
            fill="#F59E0B"
            stroke="#F59E0B"
            strokeWidth="0.5"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  );
}
