'use client';

interface Procedure {
  name: string;
  level: number;
  autonomy: number;
  assessments: number;
}

const PROCEDURES: Procedure[] = [
  { name: 'Lap Cholecystectomy', level: 4, autonomy: 4, assessments: 12 },
  { name: 'Inguinal Hernia', level: 3, autonomy: 2, assessments: 8 },
  { name: 'Appendectomy', level: 4, autonomy: 4, assessments: 6 },
  { name: 'Sigmoid Colectomy', level: 2, autonomy: 2, assessments: 3 },
  { name: 'Right Hemicolectomy', level: 2, autonomy: 1, assessments: 2 },
  { name: 'Exploratory Lap', level: 3, autonomy: 3, assessments: 5 },
  { name: 'Thyroidectomy', level: 3, autonomy: 2, assessments: 4 },
  { name: 'Whipple', level: 1, autonomy: 1, assessments: 1 },
  { name: 'Liver Resection', level: 1, autonomy: 1, assessments: 1 },
  { name: 'Hartmann\'s', level: 2, autonomy: 2, assessments: 2 },
  { name: 'Nissen Fundoplication', level: 2, autonomy: 1, assessments: 1 },
  { name: 'TAPP Hernia', level: 3, autonomy: 3, assessments: 4 },
  { name: 'EGD', level: 4, autonomy: 4, assessments: 14 },
  { name: 'Colonoscopy', level: 3, autonomy: 3, assessments: 9 },
  { name: 'Central Line', level: 5, autonomy: 5, assessments: 22 },
  { name: 'Chest Tube', level: 4, autonomy: 3, assessments: 8 },
];

function getBackgroundClass(level: number): string {
  switch (level) {
    case 4:
    case 5:
      return 'bg-[var(--ac-green-dim)]';
    case 3:
      return 'bg-[var(--ac-blue-dim)]';
    case 2:
      return 'bg-[var(--ac-orange-dim)]';
    case 1:
    default:
      return 'bg-[rgba(220,80,60,0.08)]';
  }
}

function getBorderClass(level: number): string {
  switch (level) {
    case 4:
    case 5:
      return 'border-[rgba(76,175,80,0.2)]';
    case 3:
      return 'border-[rgba(33,150,243,0.2)]';
    case 2:
      return 'border-[rgba(255,152,0,0.2)]';
    case 1:
    default:
      return 'border-[rgba(220,80,60,0.2)]';
  }
}

function getDotColor(autonomy: number): string {
  switch (autonomy) {
    case 4:
    case 5:
      return 'var(--ac-green)';
    case 3:
      return 'var(--ac-blue-soft)';
    case 2:
      return 'var(--ac-orange-soft)';
    case 1:
    default:
      return 'var(--ac-orange)';
  }
}

export function AutonomyGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {PROCEDURES.map((proc, index) => (
        <div
          key={index}
          className={`relative rounded-lg p-4 border ${getBackgroundClass(proc.level)} ${getBorderClass(proc.level)} border-[1px]`}
        >
          {/* Procedure name */}
          <h3 className="text-sm font-medium text-[var(--text-1)] mb-2 pr-2">
            {proc.name}
          </h3>

          {/* Level and assessments */}
          <p className="text-xs text-[var(--text-3)]">
            Level {proc.level} · {proc.assessments} assessments
          </p>

          {/* Autonomy dot */}
          <div
            className="absolute bottom-3 right-3 w-2 h-2 rounded-full"
            style={{ backgroundColor: getDotColor(proc.autonomy) }}
          />
        </div>
      ))}
    </div>
  );
}
