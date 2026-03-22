'use client';

import { PageHeader } from '@/components/shared/page-header';
import { ReadinessScore } from '@/components/fellowship/readiness-score';
import { Timeline } from '@/components/fellowship/timeline';
import { RequirementsGrid } from '@/components/fellowship/requirements-grid';

export default function FellowshipPage() {
  return (
    <main className="space-y-8 animate-fade-up">
      <PageHeader
        eyebrow="Fellowship Tracking"
        title="HPB Surgery"
        subtitle="Track your progress toward fellowship readiness in hepatopancreaticobiliary surgery"
      />

      <div className="space-y-8">
        <div>
          <ReadinessScore />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[var(--text-1)] mb-4">Milestones</h2>
          <Timeline />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-[var(--text-1)] mb-4">Requirements</h2>
          <RequirementsGrid />
        </div>
      </div>
    </main>
  );
}
