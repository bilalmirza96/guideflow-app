import { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className }: PanelProps) {
  return (
    <div
      className={`bg-[var(--bg-raised)] border border-[var(--gf-border)] rounded-2xl relative z-[2] overflow-hidden ${className || ''}`}
      style={{ transition: 'all 0.35s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
    >
      {children}
    </div>
  );
}
