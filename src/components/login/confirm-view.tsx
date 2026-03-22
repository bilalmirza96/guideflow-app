'use client';

import { useState, useEffect } from 'react';

interface ConfirmViewProps {
  email: string;
  onBack: () => void;
}

export function ConfirmView({ email, onBack }: ConfirmViewProps) {
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    setCountdown(30);
    setCanResend(false);
    // Simulate API call to resend
    await new Promise((resolve) => setTimeout(resolve, 600));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full text-center">
      {/* Email Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-[14px] bg-[var(--ac-blue-dim)] border border-[var(--ac-blue)] flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--ac-blue)"
            strokeWidth="1.6"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 4L12 13 2 4" />
          </svg>
        </div>
      </div>

      {/* Title and Subtitle */}
      <h2 className="text-[24px] font-serif font-normal text-[var(--text-1)] mb-2">
        Check your email
      </h2>
      <p className="text-[15px] font-light text-[var(--text-2)] mb-1">
        We sent a magic link to
      </p>
      <p className="text-[15px] font-semibold text-[var(--text-1)] mb-6">
        {email}
      </p>

      {/* Note */}
      <p className="text-[14px] font-light text-[var(--text-2)] mb-8">
        Click the link in the email to sign in. The link expires in 15 minutes.
      </p>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full py-[13px] px-[15px] border border-[var(--gf-border-hi)] bg-transparent text-[var(--text-1)] font-medium rounded-[10px] text-base hover:bg-[var(--accent-dim)] transition-colors duration-150 mb-4"
      >
        Use a different email
      </button>

      {/* Resend Section */}
      <div className="flex items-center gap-3 pt-4 border-t border-[var(--gf-border)]">
        <button
          onClick={handleResend}
          disabled={!canResend}
          className={`flex-1 py-[11px] px-[15px] rounded-[10px] text-[14px] font-medium transition-all duration-150 ${
            canResend
              ? 'bg-[var(--ac-orange)] text-white hover:bg-[#c76038]'
              : 'bg-[var(--accent-dim)] text-[var(--text-2)] cursor-not-allowed'
          }`}
        >
          Resend link
        </button>
        <span className="text-[13px] font-light text-[var(--text-3)] min-w-[45px] text-right">
          {formatTime(countdown)}
        </span>
      </div>
    </div>
  );
}
