import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TagProps {
  children: ReactNode;
  className?: string;
}

export function Tag({ children, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center bg-[var(--accent-dim)] text-[var(--text-3)] border border-[var(--gf-border-hi)] text-[11px] font-medium px-2 py-[3px] rounded-[6px] whitespace-nowrap',
        className
      )}
    >
      {children}
    </span>
  );
}
