import { ReactNode } from 'react';

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PanelHeader({ title, subtitle, action }: PanelHeaderProps) {
  return (
    <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b border-[var(--gf-border)]">
      <div className="flex-1">
        <h3 className="text-[14px] font-semibold text-[var(--text-1)] tracking-[-0.2px]">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[12px] text-[var(--text-3)] mt-1.5">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
