'use client';

import { Panel } from '@/components/shared/panel';
import { PanelHeader } from '@/components/shared/panel-header';
import { useDeadlines } from '@/hooks/use-deadlines';

interface DeadlinesBadgeProps {
  days: number;
  urgency: 'red' | 'orange' | 'green';
}

function DeadlinesBadge({ days, urgency }: DeadlinesBadgeProps) {
  let bgClass = '';
  let textClass = '';

  if (urgency === 'red') {
    bgClass = 'bg-red-500/10';
    textClass = 'text-red-400';
  } else if (urgency === 'orange') {
    bgClass = 'bg-[var(--ac-orange-dim)]';
    textClass = 'text-[var(--ac-orange)]';
  } else {
    bgClass = 'bg-[var(--ac-green-dim)]';
    textClass = 'text-[var(--ac-green)]';
  }

  return (
    <div className={`${bgClass} ${textClass} text-[11px] font-semibold px-2 py-1 rounded-md whitespace-nowrap`}>
      {days} days
    </div>
  );
}

export function DeadlinesPanel() {
  const deadlines = useDeadlines('HPB');

  return (
    <Panel>
      <PanelHeader title="Abstract Deadlines" subtitle="HPB Surgery" />
      <div className="divide-y divide-[var(--gf-border)]">
        {deadlines.map((deadline) => (
          <a
            key={deadline.id}
            href={deadline.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-[22px] py-3 hover:bg-[var(--bg-hover)] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-semibold text-[var(--text-3)] mb-1">
                {deadline.abbreviation}
              </div>
              <div className="text-[13px] text-[var(--text-1)] truncate">
                {deadline.name}
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
              {deadline.hasAwards && (
                <div className="text-xs text-[var(--ac-orange)] font-medium">
                  Award
                </div>
              )}
              <DeadlinesBadge days={deadline.daysUntil} urgency={deadline.urgency} />
            </div>
          </a>
        ))}
      </div>
    </Panel>
  );
}
