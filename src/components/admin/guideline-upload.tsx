'use client';

import { useState } from 'react';
import { Panel } from '@/components/shared/panel';
import { PanelHeader } from '@/components/shared/panel-header';

interface Guideline {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt';
  specialty: string;
  version: string;
  date: string;
  status: 'live' | 'draft';
}

const MOCK_GUIDELINES: Guideline[] = [
  {
    id: '1',
    name: 'Sepsis Management Protocol',
    type: 'pdf',
    specialty: 'Emergency',
    version: 'v2.1',
    date: 'Mar 10',
    status: 'live',
  },
  {
    id: '2',
    name: 'Anticoagulation Bridging Guidelines',
    type: 'doc',
    specialty: 'Pharmacy',
    version: 'v1.4',
    date: 'Mar 8',
    status: 'live',
  },
  {
    id: '3',
    name: 'Acute Stroke Pathway',
    type: 'txt',
    specialty: 'Neurology',
    version: 'v3.0',
    date: 'Mar 5',
    status: 'live',
  },
  {
    id: '4',
    name: 'Neonatal Resuscitation Protocol',
    type: 'pdf',
    specialty: 'NICU',
    version: 'v1.0',
    date: 'Mar 3',
    status: 'draft',
  },
];

export function GuidelineUpload() {
  const [guidelines, setGuidelines] = useState<Guideline[]>(MOCK_GUIDELINES);
  const [formData, setFormData] = useState({
    title: '',
    specialty: '',
    version: '',
    status: 'Draft',
    content: '',
    url: '',
    tags: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePublish = () => {
    if (!formData.title || !formData.specialty) {
      alert('Please fill in title and specialty');
      return;
    }
    // In a real app, this would submit to an API
    alert('Guideline published successfully!');
    setFormData({
      title: '',
      specialty: '',
      version: '',
      status: 'Draft',
      content: '',
      url: '',
      tags: '',
    });
  };

  const handleDelete = (id: string) => {
    setGuidelines(guidelines.filter((g) => g.id !== id));
  };

  const publishedCount = guidelines.filter((g) => g.status === 'live').length;
  const draftCount = guidelines.filter((g) => g.status === 'draft').length;
  const totalCount = guidelines.length;

  return (
    <div className="space-y-6">
      {/* Stat Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[var(--bg-raised)] rounded-xl p-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.11em] text-[var(--text-3)] mb-2">
            Total Guidelines
          </div>
          <div className="text-[32px] font-semibold text-[var(--text-1)]">{totalCount}</div>
        </div>
        <div className="bg-[var(--bg-raised)] rounded-xl p-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.11em] text-[var(--text-3)] mb-2">
            Published
          </div>
          <div className="text-[32px] font-semibold text-[var(--text-1)]">{publishedCount}</div>
        </div>
        <div className="bg-[var(--bg-raised)] rounded-xl p-6">
          <div className="text-[12px] font-semibold uppercase tracking-[0.11em] text-[var(--text-3)] mb-2">
            Drafts
          </div>
          <div className="text-[32px] font-semibold text-[var(--text-1)]">{draftCount}</div>
        </div>
      </div>

      {/* Upload Form & Guidelines List */}
      <div className="grid grid-cols-2 gap-6">
        {/* Upload Form */}
        <Panel>
          <PanelHeader title="Upload Guideline" subtitle="PDF, DOCX, TXT" />
          <div className="px-6 py-6 space-y-6">
            {/* Drop Zone */}
            <div className="border-2 border-dashed border-[var(--border)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--text-2)] transition-colors">
              <div className="flex justify-center mb-3">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[var(--text-2)]"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <div className="font-medium text-[var(--text-1)] mb-1">Drag & drop files here</div>
              <div className="text-[12px] text-[var(--text-3)]">
                or click to browse — PDF, DOCX, TXT up to 25 MB
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-[14px] font-medium text-[var(--text-1)] mb-2">
                Title <span className="text-[var(--ac-orange)]">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Sepsis Management Protocol"
                className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-[var(--ac-orange)]"
              />
            </div>

            {/* Specialty and Version */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[14px] font-medium text-[var(--text-1)] mb-2">
                  Specialty <span className="text-[var(--ac-orange)]">*</span>
                </label>
                <select
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-[var(--ac-orange)]"
                >
                  <option value="">-- Select --</option>
                  <option>Emergency</option>
                  <option>Surgery</option>
                  <option>Pharmacy</option>
                  <option>Neurology</option>
                  <option>NICU</option>
                  <option>Cardiology</option>
                </select>
              </div>
              <div>
                <label className="block text-[14px] font-medium text-[var(--text-1)] mb-2">
                  Version
                </label>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  placeholder="e.g. 2.1"
                  className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-[var(--ac-orange)]"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[14px] font-medium text-[var(--text-1)] mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-[var(--ac-orange)]"
              >
                <option>Draft</option>
                <option>Published</option>
              </select>
            </div>

            {/* Content */}
            <div>
              <label className="block text-[14px] font-medium text-[var(--text-1)] mb-2">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Paste guideline text here or write directly…"
                className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-[var(--ac-orange)] min-h-[100px]"
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-[14px] font-medium text-[var(--text-1)] mb-2">
                URL Import
              </label>
              <input
                type="text"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                placeholder="https://example.com/guideline.pdf"
                className="w-full px-3 py-2 bg-[var(--bg-base)] border border-[var(--border)] rounded-lg text-[14px] focus:outline-none focus:ring-1 focus:ring-[var(--ac-orange)]"
              />
            </div>

            {/* Publish Button */}
            <button
              onClick={handlePublish}
              className="w-full px-4 py-2 bg-[var(--ac-orange)] text-white font-medium text-[14px] rounded-lg hover:opacity-90 transition-opacity"
            >
              Publish Guideline
            </button>
          </div>
        </Panel>

        {/* Guidelines List */}
        <Panel>
          <PanelHeader title="Existing Guidelines" subtitle={`${totalCount} total`} />
          <div className="divide-y divide-[var(--border)]">
            {guidelines.map((guideline) => (
              <div
                key={guideline.id}
                className="px-6 py-4 flex items-center gap-4 hover:bg-[var(--bg-base)] transition-colors"
              >
                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-[11px] font-bold text-white ${
                    guideline.type === 'pdf'
                      ? 'bg-[#E74C3C]'
                      : guideline.type === 'doc'
                        ? 'bg-[#3498DB]'
                        : 'bg-[#95A5A6]'
                  }`}
                >
                  {guideline.type.toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-[14px] text-[var(--text-1)]">
                    {guideline.name}
                  </div>
                  <div className="text-[12px] text-[var(--text-3)] mt-1">
                    {guideline.specialty} · {guideline.version} · Updated {guideline.date}
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex-shrink-0">
                  <span
                    className={`inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md ${
                      guideline.status === 'live'
                        ? 'bg-[rgba(139,184,122,0.1)] text-[var(--ac-green)]'
                        : 'bg-[rgba(109,110,113,0.1)] text-[var(--text-3)]'
                    }`}
                  >
                    {guideline.status === 'live' ? 'Live' : 'Draft'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex-shrink-0 flex gap-2">
                  <button className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors p-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(guideline.id)}
                    className="text-[var(--text-3)] hover:text-[#E74C3C] transition-colors p-1"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
