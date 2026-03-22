import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number;
  denominator?: number;
  percentage?: number;
  barColor?: 'orange' | 'blue' | 'green' | 'neutral';
}

export function StatCard({
  label,
  value,
  denominator,
  percentage = 0,
  barColor = 'neutral',
}: StatCardProps) {
  const colorMap = {
    orange: 'bg-[var(--ac-orange-soft)]',
    blue: 'bg-[var(--ac-blue-soft)]',
    green: 'bg-[var(--ac-green-soft)]',
    neutral: 'bg-[var(--prog-fill)]',
  };

  return (
    <div
      className="bg-[var(--bg-raised)] border border-[var(--gf-border)] rounded-2xl px-6 py-6 relative z-[2] hover:border-[var(--gf-border-hi)]"
      style={{ transition: 'all 0.35s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
    >
      <div className="block text-[10px] font-semibold tracking-[0.08em] uppercase text-[var(--text-3)] mb-2.5">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <div className="font-serif text-[28px] font-medium text-[var(--text-1)] tracking-[-1px] leading-[1]">
          {value}
        </div>
        {denominator && (
          <div className="text-[14px] font-light text-[var(--text-3)]">
            /{denominator}
          </div>
        )}
      </div>
      {percentage !== undefined && percentage > 0 && (
        <div className="mt-3">
          <div className="h-[3px] bg-[var(--prog-bg)] rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full', colorMap[barColor])}
              style={{
                width: `${Math.min(percentage, 100)}%`,
                transition: 'width 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
