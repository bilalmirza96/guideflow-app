'use client';

import { useState } from 'react';

const VALID_EMAIL_DOMAINS = [
  'stmichaels.org',
  'stmichaels.com',
  'stmichaels.ca',
];

interface LoginCardProps {
  onSubmit: (email: string) => void;
}

export function LoginCard({ onSubmit }: LoginCardProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setError('Email is required');
      return false;
    }

    const isValidDomain = VALID_EMAIL_DOMAINS.some((domain) =>
      value.toLowerCase().endsWith(domain)
    );

    if (!isValidDomain) {
      setError(
        'Please use your hospital email address (stmichaels.org, .com, or .ca)'
      );
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h1 className="text-[28px] font-serif font-normal text-[var(--text-1)] mb-2">
        Sign in
      </h1>
      <p className="text-[15px] font-light text-[var(--text-2)] mb-7">
        Enter your hospital email and we&apos;ll send you a magic link — no password
        needed.
      </p>

      <div className="mb-7">
        <label
          htmlFor="email"
          className="block text-[14px] font-medium text-[var(--text-1)] mb-2"
        >
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@stmichaels.org"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          className="w-full bg-[var(--bg)] border border-[var(--gf-border-hi)] rounded-[10px] py-[13px] px-[15px] text-base font-light text-[var(--text-1)] placeholder-[var(--text-3)] focus:outline-none focus:border-[var(--ac-blue)] focus:shadow-[0_0_0_3px_var(--ac-blue-dim)] transition-all duration-150"
          disabled={isLoading}
          autoComplete="email"
        />
        {!error && (
          <p className="text-[13px] font-light text-[var(--text-3)] mt-2">
            Use the email associated with your hospital account.
          </p>
        )}
        {error && (
          <p className="text-[13px] font-light text-red-600 mt-2">{error}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[var(--ac-orange)] hover:bg-[#c76038] disabled:bg-[#c76038] text-white font-medium py-[13px] px-[15px] rounded-[10px] text-base transition-all duration-150 flex items-center justify-center gap-2 relative"
      >
        <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
          Send magic link
        </span>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>

      <div className="flex items-center gap-3 my-7">
        <div className="flex-1 h-px bg-[var(--gf-border)]" />
        <span className="text-[14px] font-light text-[var(--text-3)]">Or</span>
        <div className="flex-1 h-px bg-[var(--gf-border)]" />
      </div>

      <p className="text-center text-[14px] font-light text-[var(--text-2)]">
        Don&apos;t have an account? Contact your hospital admin
      </p>
    </form>
  );
}
