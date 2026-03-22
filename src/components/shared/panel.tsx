import { ReactNode } from 'react';

interface PanelProps {
  children: ReactNode;
}

export function Panel({ children }: PanelProps) {
  return (
    <div className="bg-[var(--bg-raised)] rounded-xl relative z-[2] overflow-hidden">
      {children}
    </div>
  );
}
