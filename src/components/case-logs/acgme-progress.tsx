'use client';

import { Panel } from '@/components/shared/panel';
import { PanelHeader } from '@/components/shared/panel-header';
import { ACGME_DATA } from '@/data/acgme-categories';
import { Download } from 'lucide-react';

export function ACGMEProgress() {
  const handleExport = () => {
    // Export logic would go here
    console.log('Export clicked');
  };

  return (
    <Panel>
      <PanelHeader
        title="ACGME Category Progress"
        action={
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--ac-blue)] hover:opacity-80 transition-opacity"
          >
            Export <Download size={12} />
          </button>
        }
      />
      <div className="px-[22px] pb-5 space-y-3">
        {ACGME_DATA.map((category) => {
          const percentage = (category.logged / category.min) * 100;
          const delta = category.logged - category.benchmark;
          const isBehind = delta < 0;
          
          let barColor = 'bg-[var(--ac-orange-soft)]';
          if (percentage >= 100) {
            barColor = 'bg-[var(--ac-green)]';
          } else if (percentage >= 50) {
            barColor = 'bg-[var(--ac-blue-soft)]';
          }

          return (
            <div key={category.name} className="flex items-center gap-3">
              <div style={{ width: '130px' }}>
                <p className="text-[13px] font-medium text-[var(--text-1)]">
                  {category.name}
                </p>
              </div>
              <div className="flex-1 h-[6px] bg-[var(--gf-border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${barColor}`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              <div className="text-[12px] text-[var(--text-3)] font-light" style={{ width: '60px', textAlign: 'right' }}>
                {category.logged} / {category.min}
              </div>
              <div className="text-[11px] text-[var(--text-3)] font-light" style={{ width: '50px', textAlign: 'right' }}>
                {Math.round(percentage)}%
              </div>
              <div
                className={`text-[11px] font-medium whitespace-nowrap ${isBehind ? 'text-[var(--ac-orange)]' : 'text-[var(--ac-green)]'}`}
                style={{ width: '90px', textAlign: 'right' }}
              >
                {isBehind ? `${Math.abs(delta)} behind` : `+${delta} ahead`}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
