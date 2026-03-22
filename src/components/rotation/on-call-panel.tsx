import { Panel } from '@/components/shared/panel';
import { PanelHeader } from '@/components/shared/panel-header';

interface OnCallDoctor {
  service: string;
  name: string;
  role: string;
  phone: string;
  pager: string;
}

const ONCALL_DOCTORS: OnCallDoctor[] = [
  {
    service: 'General Surgery',
    name: 'Dr. Faisal Jehan',
    role: 'Attending',
    phone: '(555) 234-5678',
    pager: '4401',
  },
  {
    service: 'Trauma Surgery',
    name: 'Dr. Sarah Okoye',
    role: 'Attending',
    phone: '(555) 345-6789',
    pager: '4402',
  },
  {
    service: 'Vascular Surgery',
    name: 'Dr. James Patel',
    role: 'Fellow',
    phone: '(555) 456-7890',
    pager: '4403',
  },
];

export function OnCallPanel() {
  return (
    <Panel>
      <PanelHeader title="On-Call Now" subtitle="3 attendings on service" />
      <div className="divide-y divide-[var(--gf-border)]">
        {ONCALL_DOCTORS.map((doc, index) => (
          <div
            key={index}
            className="px-[22px] py-3.5 flex items-center justify-between hover:bg-[var(--bg-hover)]"
            style={{ transition: 'background 0.12s ease' }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-[32px] h-[32px] rounded-full bg-[var(--accent-dim2)] flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] font-semibold text-[var(--text-2)]">
                  {doc.name.split(' ').slice(1).map(n => n[0]).join('')}
                </span>
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-medium text-[var(--text-1)] truncate">
                  {doc.name}
                </div>
                <div className="text-[12px] text-[var(--text-3)]">
                  {doc.service} · {doc.role}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-3">
              <a
                href={`tel:${doc.phone}`}
                className="w-[28px] h-[28px] rounded-lg border border-[var(--gf-border)] flex items-center justify-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:border-[var(--gf-border-hi)] hover:bg-[var(--accent-dim2)]"
                style={{ transition: 'all 0.14s ease' }}
                title={doc.phone}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.85a16 16 0 0 0 5.36 5.36l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 15.92z"/>
                </svg>
              </a>
              <div className="text-[11px] font-mono text-[var(--text-3)]">
                #{doc.pager}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
