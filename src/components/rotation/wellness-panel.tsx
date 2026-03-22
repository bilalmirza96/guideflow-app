import { Panel } from '@/components/shared/panel';
import { PanelHeader } from '@/components/shared/panel-header';

export function WellnessPanel() {
  return (
    <Panel>
      <PanelHeader title="Wellness Check-in" />
      <div className="px-[22px] py-4">
        <div className="text-[15px] text-[var(--text-1)] mb-2">
          How are you feeling today?
        </div>
        <div className="text-[12px] text-[var(--text-3)] mb-4">
          Last check-in: 3 days ago
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-[13px] font-medium text-[var(--text-1)] border border-[var(--gf-border)] hover:bg-[var(--bg-hover)] hover:border-[var(--gf-border-hi)] transition-all">
          Start Check-in
        </button>
      </div>
    </Panel>
  );
}
