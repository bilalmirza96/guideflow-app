import { QuickLinksGrid } from '@/components/rotation/quick-links-grid';
import { GuidelinesList } from '@/components/rotation/guidelines-list';
import { OnCallPanel } from '@/components/rotation/on-call-panel';
import { ListenPanel } from '@/components/rotation/listen-panel';
import { DeadlinesPanel } from '@/components/rotation/deadlines-panel';
import { WellnessPanel } from '@/components/rotation/wellness-panel';

export default function RotationPage() {
  return (
    <div className="animate-fade-up">
      <div className="mb-9">
        <div className="flex items-center justify-between mb-1">
          <span className="block text-xs font-medium tracking-[0.11em] uppercase text-[var(--text-3)]">
            General Surgery Rotation
          </span>
          <span className="text-xs text-[var(--text-3)]">Jan 6 – Mar 27, 2026</span>
        </div>
      </div>

      <QuickLinksGrid />

      <div className="mt-12 mb-3">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold tracking-[0.12em] uppercase text-[var(--text-3)]">
            Most Recent
          </span>
          <div className="flex-1 h-px bg-[var(--gf-border)]" />
        </div>
      </div>

      <GuidelinesList />

      <div className="grid grid-cols-2 gap-5 mt-5">
        <OnCallPanel />
        <ListenPanel />
      </div>

      <div className="grid grid-cols-2 gap-5 mt-5">
        <DeadlinesPanel />
        <WellnessPanel />
      </div>
    </div>
  );
}
