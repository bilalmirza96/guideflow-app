import { Panel } from '@/components/shared/panel';
import { PanelHeader } from '@/components/shared/panel-header';
import { MOCK_ONCALL } from '@/data/mock-oncall';

export function OnCallPanel() {
  return (
    <Panel>
      <PanelHeader title="On-Call Now" />
      <div className="divide-y divide-[var(--gf-border)]">
        {MOCK_ONCALL.map((entry, index) => (
          <div
            key={index}
            className="px-[22px] py-3 flex items-center justify-between hover:bg-[var(--bg-hover)] transition-colors"
          >
            <div className="flex-1">
              <div className="text-[13px] font-medium text-[var(--text-1)] mb-1">
                {entry.service}
              </div>
              <div className="text-[12px] text-[var(--text-3)]">
                {entry.name}
              </div>
            </div>
            <div className="flex-shrink-0 text-right ml-4">
              <div className="text-[12px] font-mono text-[var(--text-2)] mb-1">
                {entry.phone}
              </div>
              <div className="text-[11px] text-[var(--text-3)]">
                Pager: {entry.pager}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
