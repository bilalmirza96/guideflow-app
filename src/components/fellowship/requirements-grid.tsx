'use client';

interface Requirement {
  title: string;
  metric: string;
  current: number;
  target: number;
}

const REQUIREMENTS: Requirement[] = [
  { title: 'Research', metric: 'Publications', current: 2, target: 3 },
  { title: 'Case Volume', metric: 'HPB cases', current: 18, target: 30 },
  { title: 'Letters', metric: 'Recommendation letters', current: 1, target: 3 },
  { title: 'Presentations', metric: 'Conference talks', current: 2, target: 4 },
  { title: 'Away Rotations', metric: 'Completed', current: 0, target: 2 },
];

export function RequirementsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {REQUIREMENTS.map((req, index) => {
        const percentage = Math.min(Math.round((req.current / req.target) * 100), 100);

        return (
          <div
            key={index}
            className="bg-[var(--bg-raised)] rounded-lg p-4 border border-[var(--gf-border)]"
          >
            {/* Metric in Lora serif */}
            <div
              className="text-3xl font-bold text-[var(--text-1)] mb-2"
              style={{ fontFamily: 'Lora' }}
            >
              {req.current}/{req.target}
            </div>

            {/* Title and label */}
            <h3 className="text-sm font-medium text-[var(--text-1)] mb-1">{req.title}</h3>
            <p className="text-xs text-[var(--text-3)] mb-3">{req.metric}</p>

            {/* Progress bar */}
            <div className="w-full bg-[var(--bg)] rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-[var(--ac-orange)] rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
