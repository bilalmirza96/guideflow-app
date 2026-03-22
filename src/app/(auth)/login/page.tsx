'use client';

import { useState } from 'react';
import { LoginCard } from '@/components/login/login-card';
import { ConfirmView } from '@/components/login/confirm-view';

export default function LoginPage() {
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div
      className="flex items-center justify-center min-h-[calc(100vh-52px)] p-6 relative z-[1]"
      style={{
        backgroundImage:
          'linear-gradient(var(--gf-border) 1px, transparent 1px), linear-gradient(90deg, var(--gf-border) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center',
      }}
    >
      {/* Radial gradient fade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, var(--bg) 100%)',
        }}
      />

      <div className="w-full max-w-[420px] relative z-[1]">
        {/* Hospital badge */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-[9px] bg-[var(--accent-dim2)] border border-[var(--gf-border-hi)] grid place-items-center flex-shrink-0">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-[var(--text-1)]"
            >
              <path d="M3 21h18" />
              <path d="M5 21V7l8-4v18" />
              <path d="M19 21V11l-6-4" />
              <path d="M9 9h1M9 13h1M9 17h1" />
            </svg>
          </div>
          <span className="text-[13px] font-medium tracking-[0.1em] uppercase text-[var(--text-3)]">
            St. Michael&apos;s Hospital
          </span>
        </div>

        {/* Login card */}
        <div className="bg-[var(--bg-raised)] border border-[var(--gf-border-hi)] rounded-2xl p-[44px_40px_40px] shadow-[var(--shadow-lg)] relative z-[1]">
          {!showConfirm ? (
            <LoginCard
              onSubmit={(email) => {
                setSubmittedEmail(email);
                setShowConfirm(true);
              }}
            />
          ) : (
            <ConfirmView
              email={submittedEmail}
              onBack={() => {
                setShowConfirm(false);
                setSubmittedEmail('');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
