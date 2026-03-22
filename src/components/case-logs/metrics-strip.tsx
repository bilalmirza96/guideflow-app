'use client';

import { StatCard } from '@/components/shared/stat-card';

export function MetricsStrip() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        label="Chief Year (SC)"
        value={0}
        denominator={200}
        percentage={0}
        barColor="orange"
      />
      <StatCard
        label="PGY-3 Cutoff"
        value={127}
        denominator={250}
        percentage={50.8}
        barColor="blue"
      />
      <StatCard
        label="Teaching Asst"
        value={4}
        denominator={25}
        percentage={16}
        barColor="green"
      />
      <StatCard
        label="This Month"
        value={14}
        denominator={undefined}
        percentage={70}
        barColor="neutral"
      />
    </div>
  );
}
