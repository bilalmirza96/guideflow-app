'use client';

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabs = ['guidelines', 'directory', 'users'];
  const labels: Record<string, string> = {
    guidelines: 'Guidelines',
    directory: 'Directory',
    users: 'Users',
  };

  return (
    <div className="flex gap-1 border-b border-[var(--border)] pb-0 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`px-4 py-3 font-medium text-[14px] border-b-2 transition-colors ${
            activeTab === tab
              ? 'text-[var(--text-1)] border-b-[var(--ac-orange)]'
              : 'text-[var(--text-3)] border-b-transparent hover:text-[var(--text-2)]'
          }`}
        >
          {labels[tab]}
        </button>
      ))}
    </div>
  );
}
