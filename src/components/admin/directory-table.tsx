'use client';

import { Panel } from '@/components/shared/panel';
import { PanelHeader } from '@/components/shared/panel-header';

interface DirectoryEntry {
  id: string;
  name: string;
  role: string;
  phone: string;
  pager: string;
  service: string;
}

const MOCK_DIRECTORY: DirectoryEntry[] = [
  {
    id: '1',
    name: 'Dr. Faisal Jehan',
    role: 'Attending Surgeon',
    phone: 'ext. 8200',
    pager: '#4521',
    service: 'General Surgery',
  },
  {
    id: '2',
    name: 'Dr. Sarah Okoye',
    role: 'Trauma Chief',
    phone: 'ext. 8210',
    pager: '#4530',
    service: 'Trauma',
  },
  {
    id: '3',
    name: 'Dr. James Patel',
    role: 'Emergency Physician',
    phone: 'ext. 8220',
    pager: '#4102',
    service: 'Emergency',
  },
  {
    id: '4',
    name: 'Dr. Maria Reyes',
    role: 'Neurologist',
    phone: 'ext. 8230',
    pager: '#4605',
    service: 'Neurology',
  },
  {
    id: '5',
    name: 'Dr. Kevin Wu',
    role: 'NICU Attending',
    phone: 'ext. 8240',
    pager: '#4710',
    service: 'NICU',
  },
];

export function DirectoryTable() {
  return (
    <Panel>
      <PanelHeader title="On-Call Directory" subtitle={`${MOCK_DIRECTORY.length} contacts`} />
      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="px-6 py-3 text-left font-semibold text-[var(--text-1)]">Name</th>
              <th className="px-6 py-3 text-left font-semibold text-[var(--text-1)]">Role</th>
              <th className="px-6 py-3 text-left font-semibold text-[var(--text-1)]">Phone</th>
              <th className="px-6 py-3 text-left font-semibold text-[var(--text-1)]">Pager</th>
              <th className="px-6 py-3 text-left font-semibold text-[var(--text-1)]">Service</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_DIRECTORY.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-[var(--border)] hover:bg-[var(--bg-base)] transition-colors"
              >
                <td className="px-6 py-3 font-medium text-[var(--text-1)]">{entry.name}</td>
                <td className="px-6 py-3 text-[var(--text-2)]">{entry.role}</td>
                <td className="px-6 py-3 text-[var(--text-2)]">{entry.phone}</td>
                <td className="px-6 py-3 text-[var(--text-2)]">{entry.pager}</td>
                <td className="px-6 py-3 text-[var(--text-2)]">{entry.service}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
