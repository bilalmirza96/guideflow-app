import { Tag } from '@/components/shared/tag';

interface GuidelineItem {
  name: string;
  specialty: string;
  date: string;
  dotColor: string;
}

const GUIDELINES: GuidelineItem[] = [
  {
    name: 'Sepsis Management Protocol',
    specialty: 'Emergency',
    date: 'Updated Mar 10, 2026',
    dotColor: 'var(--ac-orange)',
  },
  {
    name: 'Anticoagulation Bridging Guidelines',
    specialty: 'Pharmacy',
    date: 'Updated Mar 8, 2026',
    dotColor: 'var(--ac-blue)',
  },
  {
    name: 'Acute Stroke Pathway',
    specialty: 'Neurology',
    date: 'Updated Mar 5, 2026',
    dotColor: 'var(--ac-green)',
  },
  {
    name: 'Neonatal Resuscitation Protocol',
    specialty: 'NICU',
    date: 'Updated Mar 3, 2026',
    dotColor: '#C4B098',
  },
  {
    name: 'DVT Prophylaxis Algorithm',
    specialty: 'Surgery',
    date: 'Updated Mar 1, 2026',
    dotColor: '#A090C0',
  },
];

export function GuidelinesList() {
  return (
    <div className="bg-[var(--bg-raised)] border border-[var(--gf-border)] rounded-2xl overflow-hidden relative z-[2]">
      {GUIDELINES.map((guideline, index) => (
        <div
          key={index}
          className={`flex items-center px-5 py-3.5 gap-3 hover:bg-[var(--bg-hover)] cursor-pointer ${
            index < GUIDELINES.length - 1 ? 'border-b border-[var(--gf-border)]' : ''
          }`}
          style={{ transition: 'all 0.15s ease' }}
        >
          <div
            className="w-[5px] h-[5px] rounded-full flex-shrink-0"
            style={{ background: guideline.dotColor }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-[15px] text-[var(--text-1)] font-normal mb-0.5">
              {guideline.name}
            </div>
            <div className="text-[12px] text-[var(--text-3)]">
              {guideline.date}
            </div>
          </div>
          <Tag>{guideline.specialty}</Tag>
        </div>
      ))}
    </div>
  );
}