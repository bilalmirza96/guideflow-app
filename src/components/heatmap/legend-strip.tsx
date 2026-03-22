'use client';

interface LegendItem {
  color: string;
  label: string;
}

export function LegendStrip() {
  const items: LegendItem[] = [
    { color: 'var(--ac-green)', label: 'Near independent' },
    { color: 'var(--ac-green-soft)', label: 'Minimal help' },
    { color: 'var(--ac-blue-soft)', label: 'Active help' },
    { color: 'var(--ac-orange-soft)', label: 'Early' },
    { color: 'rgba(220,80,60,0.3)', label: 'Not yet done' },
  ];

  return (
    <div className="bg-[var(--bg-raised)] rounded-lg p-4 border border-[var(--gf-border)]">
      <div className="flex flex-wrap gap-6 items-center">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-[var(--text-2)]">{item.label}</span>
          </div>
        ))}

        {/* Autonomy given indicator */}
        <div className="flex items-center gap-2 ml-4 pl-4 border-l border-[var(--gf-border)]">
          <span className="text-sm text-[var(--ac-green)] font-bold">●</span>
          <span className="text-sm text-[var(--text-2)]">Inner dot = Autonomy given</span>
        </div>
      </div>
    </div>
  );
}
