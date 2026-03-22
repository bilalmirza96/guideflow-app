import { Tag } from '@/components/shared/tag';

interface GuidelineItem {
  name: string;
  specialty: string;
  date: string;
}

const GUIDELINES: GuidelineItem[] = [
  {
    name: 'Sepsis Management Protocol',
    specialty: 'Emergency',
    date: 'Mar 10, 2026',
  },
  {
    name: 'Anticoagulation Bridging Guidelines',
    specialty: 'Pharmacy',
    date: 'Mar 8, 2026',
  },
  {
    name: 'Acute Stroke Pathway',
    specialty: 'Neurology',
    date: 'Mar 5, 2026',
  },
  {
    name: 'Neonatal Resuscitation Protocol',
    specialty: 'NICU',
    date: 'Mar 3, 2026',
  },
  {
    name: 'DVT Prophylaxis Algorithm',
    specialty: 'Surgery',
    date: 'Mar 1, 2026',
  },
];

export function GuidelinesList() {
  return (
    <div className="bg-[var(--bg-raised)] rounded-xl shadow-[var(--shadow-sm)]">
      {GUIDELINES.map((guideline, index) => (
        <div
          key={index}
          className={`flex items-center px-5 py-3.5 hover:bg-[var(--bg-hover)] transition-colors ${
            index < GUIDELINES.length - 1 ? 'border-b border-[var(--gf-border)]' : ''
          }`}
        >
          <div className="flex-1">
            <div className="text-[16px] text-[var(--text-1)] font-medium mb-1">
              {guideline.name}
            </div>
            <div className="text-[12px] text-[var(--text-3)] flex items-center gap-3">
              <Tag>{guideline.specialty}</Tag>
              <span>{guideline.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
