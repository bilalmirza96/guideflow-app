import { ReactNode } from 'react';

interface PanelHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PanelHeader({ title, subtitle, action }: PanelHeaderProps) {
  return (
    <div className="px-[22px] pt-4 pb-[14px] flex items-center justify-between">
      <div className="flex-1">
        <h3 className="text-[14px] font-semibold text-[var(--text-1)]">
          {title}
        </h3>
        {subtitle && (
          <p className="text-[12px] text-[var(--text-3)] mt-1">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
