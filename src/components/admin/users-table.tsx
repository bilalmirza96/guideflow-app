'use client';

import { useState } from 'react';
import { Panel } from '@/components/shared/panel';
import { PanelHeader } from '@/components/shared/panel-header';

interface User {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: 'Admin' | 'Professional';
  lastActive: string;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    initials: 'FJ',
    name: 'Dr. Faisal Jehan',
    email: 'faisal.jehan@stmichaels.org',
    role: 'Admin',
    lastActive: 'Today',
  },
  {
    id: '2',
    initials: 'SO',
    name: 'Dr. Sarah Okoye',
    email: 'sarah.okoye@stmichaels.org',
    role: 'Admin',
    lastActive: 'Today',
  },
  {
    id: '3',
    initials: 'JP',
    name: 'Dr. James Patel',
    email: 'james.patel@stmichaels.org',
    role: 'Professional',
    lastActive: 'Yesterday',
  },
  {
    id: '4',
    initials: 'MR',
    name: 'Dr. Maria Reyes',
    email: 'maria.reyes@stmichaels.org',
    role: 'Professional',
    lastActive: 'Mar 12',
  },
  {
    id: '5',
    initials: 'KW',
    name: 'Dr. Kevin Wu',
    email: 'kevin.wu@stmichaels.org',
    role: 'Professional',
    lastActive: 'Mar 10',
  },
];

export function UsersTable() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Healthcare Professional');
  const [users] = useState<User[]>(MOCK_USERS);

  const handleSendInvite = () => {
    if (!inviteEmail.trim()) {
      alert('Please enter an email address');
      return;
    }
    alert(`Invite sent to ${inviteEmail}`);
    setInviteEmail('');
    setInviteRole('Healthcare Professional');
  };

  const getRoleColor = (role: string) => {
    return role === 'Admin'
      ? 'bg-[rgba(232,149,111,0.1)] text-[var(--ac-orange)]'
      : 'bg-[rgba(139,184,122,0.1)] text-[var(--ac-green)]';
  };

  return (
    <div className="space-y-6">
      {/* Invite Form */}
      <Panel>
        <PanelHeader title="Invite User" />
        <div className="px-6 py-6">
          <div className="flex gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="email@stmichaels.org"
              className="flex-1 px-3 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-[var(--ac-orange)]"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="px-3 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-[var(--ac-orange)]"
            >
              <option>Healthcare Professional</option>
              <option>Hospital Admin</option>
            </select>
            <button
              onClick={handleSendInvite}
              className="px-4 py-2 bg-[var(--ac-orange)] text-white font-medium text-[14px] rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Send Invite
            </button>
          </div>
        </div>
      </Panel>

      {/* Users Table */}
      <Panel>
        <PanelHeader title="Active Users" subtitle={`${users.length} users`} />
        <div className="overflow-x-auto">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="px-6 py-3 text-left font-semibold text-[var(--text-1)]">User</th>
                <th className="px-6 py-3 text-left font-semibold text-[var(--text-1)]">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-[var(--text-1)]">Role</th>
                <th className="px-6 py-3 text-left font-semibold text-[var(--text-1)]">Last Active</th>
                <th className="px-6 py-3 text-left font-semibold text-[var(--text-1)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-[var(--border)] hover:bg-[var(--bg-base)] transition-colors"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--ac-blue-dim)] text-[var(--ac-blue)] flex items-center justify-center text-[11px] font-bold">
                        {user.initials}
                      </div>
                      <span className="font-medium text-[var(--text-1)]">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-[var(--text-2)]">{user.email}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md ${getRoleColor(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-[var(--text-2)]">{user.lastActive}</td>
                  <td className="px-6 py-3">
                    <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md bg-[rgba(139,184,122,0.1)] text-[var(--ac-green)]">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
