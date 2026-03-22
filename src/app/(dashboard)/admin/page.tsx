'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { AdminTabs } from '@/components/admin/admin-tabs';
import { GuidelineUpload } from '@/components/admin/guideline-upload';
import { DirectoryTable } from '@/components/admin/directory-table';
import { UsersTable } from '@/components/admin/users-table';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('guidelines');

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Hospital Administration"
        title="Admin"
        subtitle="Manage guidelines, directory contacts, and user access."
      />
      <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'guidelines' && <GuidelineUpload />}
      {activeTab === 'directory' && <DirectoryTable />}
      {activeTab === 'users' && <UsersTable />}
    </div>
  );
}
