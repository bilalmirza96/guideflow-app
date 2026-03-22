'use client';

import { PageHeader } from '@/components/shared/page-header';
import { LegendStrip } from '@/components/heatmap/legend-strip';
import { AutonomyGrid } from '@/components/heatmap/autonomy-grid';
import { DivergenceAlerts } from '@/components/heatmap/divergence-alerts';

export default function HeatmapPage() {
  return (
    <main className="space-y-8 animate-fade-up">
      <PageHeader
        eyebrow="PGY-1 · General Surgery"
        title="Operative Autonomy Map"
        subtitle="Visual assessment of your competency level and autonomy given across procedures"
      />

      <div className="space-y-8">
        {/* Legend */}
        <div>
          <LegendStrip />
        </div>

        {/* Grid */}
        <div>
          <AutonomyGrid />
        </div>

        {/* Divergence Alerts */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-1)] mb-4">DIVERGENCE SIGNALS</h2>
          <DivergenceAlerts />
        </div>
      </div>
    </main>
  );
}
