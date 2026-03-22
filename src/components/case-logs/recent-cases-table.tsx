'use client';

import { Panel } from '@/components/shared/panel';
import { PanelHeader } from '@/components/shared/panel-header';
import { RoleBadge } from '@/components/shared/role-badge';
import { MOCK_CASES } from '@/data/mock-cases';

export function RecentCasesTable() {
  return (
    <Panel>
      <PanelHeader 
        title="Recent Cases" 
        subtitle="127 logged"
      />
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-[var(--gf-border)]">
              <th className="px-[22px] py-3 text-left text-[10px] font-semibold tracking-[0.07em] uppercase text-[var(--text-3)]">
                Procedure
              </th>
              <th className="px-[22px] py-3 text-left text-[10px] font-semibold tracking-[0.07em] uppercase text-[var(--text-3)]">
                Date
              </th>
              <th className="px-[22px] py-3 text-left text-[10px] font-semibold tracking-[0.07em] uppercase text-[var(--text-3)]">
                Role
              </th>
              <th className="px-[22px] py-3 text-left text-[10px] font-semibold tracking-[0.07em] uppercase text-[var(--text-3)]">
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CASES.map((caseEntry, index) => (
              <tr
                key={index}
                className="border-t border-[var(--gf-border)] hover:bg-[var(--accent-dim)] transition-colors"
              >
                <td className="px-[22px] py-3 text-[13px] text-[var(--text-1)] font-medium">
                  {caseEntry.procedure}
                </td>
                <td className="px-[22px] py-3 text-[13px] text-[var(--text-2)]">
                  {caseEntry.date}
                </td>
                <td className="px-[22px] py-3">
                  <RoleBadge role={caseEntry.role} />
                </td>
                <td className="px-[22px] py-3 text-[13px] text-[var(--text-2)]">
                  {caseEntry.category}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
