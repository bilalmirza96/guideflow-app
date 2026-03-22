'use client';

interface TimelineMilestone {
  label: string;
  date: string;
  status: 'current' | 'future' | 'match';
}

export function Timeline() {
  const milestones: TimelineMilestone[] = [
    { label: 'Current', date: 'Now', status: 'current' },
    { label: 'Research deadline', date: 'Jun 2026', status: 'future' },
    { label: 'Abstract submission', date: 'Aug 2026', status: 'future' },
    { label: 'Application opens', date: 'Sep 2027', status: 'future' },
    { label: 'Match', date: 'Nov 2027', status: 'match' },
  ];

  return (
    <div className="w-full bg-[var(--bg-raised)] rounded-lg p-6">
      {/* Timeline Container */}
      <div className="relative">
        {/* Line behind dots */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-[var(--gf-border)]" style={{ transform: 'translateY(-50%)' }} />

        {/* Dots and labels */}
        <div className="flex justify-between items-start">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              {/* Dot */}
              <div
                className="w-4 h-4 rounded-full relative z-10 mb-3 border-2"
                style={{
                  backgroundColor:
                    milestone.status === 'current'
                      ? 'var(--ac-orange)'
                      : milestone.status === 'match'
                        ? 'var(--ac-green)'
                        : 'transparent',
                  borderColor:
                    milestone.status === 'current'
                      ? 'var(--ac-orange)'
                      : milestone.status === 'match'
                        ? 'var(--ac-green)'
                        : 'var(--gf-border)',
                }}
              />

              {/* Labels */}
              <div className="text-center">
                <p className="text-sm font-medium text-[var(--text-1)]">{milestone.label}</p>
                <p className="text-xs text-[var(--text-3)]">{milestone.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
