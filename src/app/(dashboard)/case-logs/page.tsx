import { PageHeader } from '@/components/shared/page-header';
import { DonutChart } from '@/components/case-logs/donut-chart';
import { TrendChart } from '@/components/case-logs/trend-chart';
import { MetricsStrip } from '@/components/case-logs/metrics-strip';
import { RoleChart } from '@/components/case-logs/role-chart';
import { ACGMEProgress } from '@/components/case-logs/acgme-progress';
import { CaseLogForm } from '@/components/case-logs/case-log-form';
import { RecentCasesTable } from '@/components/case-logs/recent-cases-table';

export default function CaseLogsPage() {
  return (
    <div className="animate-fade-up">
      {/* Page Header */}
      <div className="mb-9">
        <PageHeader
          eyebrow="General Surgery Residency · PGY-1"
          title="Case Log"
          subtitle="Log operative cases and track progress toward ACGME graduation requirements."
        />
      </div>

      {/* Hero Row: Donut and Trend Charts */}
      <div className="grid grid-cols-[240px_1fr] gap-4 h-[260px] mb-5">
        <DonutChart />
        <TrendChart />
      </div>

      {/* Metrics Strip */}
      <div className="mb-5">
        <MetricsStrip />
      </div>

      {/* Charts Row: Role Chart and ACGME Progress */}
      <div className="grid grid-cols-[220px_1fr] gap-4 mb-5">
        <RoleChart />
        <ACGMEProgress />
      </div>

      {/* Form and Recent Cases */}
      <div className="grid grid-cols-2 gap-5">
        <CaseLogForm />
        <RecentCasesTable />
      </div>
    </div>
  );
}
