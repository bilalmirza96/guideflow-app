'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [serviceOpen, setServiceOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-[52px] z-[200] backdrop-blur-[12px] border-b border-[var(--gf-border)] flex items-center px-10 transition-all duration-300"
      style={{
        background:
          theme === 'dark'
            ? 'rgba(19, 19, 19, 0.92)'
            : 'rgba(255, 255, 255, 0.92)',
      }}
    >
      {/* Left: Logo + Service Switcher */}
      <div className="flex items-center gap-10 mr-auto flex-shrink-0">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-[10px] whitespace-nowrap">
          <div className="w-[27px] h-[27px] bg-[var(--text-1)] rounded-[7px] flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-[13px] font-semibold text-[var(--bg)] leading-[1]">
              G
            </span>
          </div>
          <span className="text-[15px] font-medium text-[var(--text-1)] tracking-[-0.3px]">
            GuideFlow
          </span>
          <span className="text-[15px] font-normal text-[var(--text-3)] mx-1">
            /
          </span>
        </Link>

        {/* Service Switcher Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-1.5 py-1 rounded-[6px] text-[15px] font-normal text-[var(--text-2)] transition-colors duration-140 group-hover:text-[var(--text-1)] group-hover:bg-[var(--accent-dim2)]">
            <span className="whitespace-nowrap">Service</span>
            <svg
              className="w-[11px] h-[11px] opacity-40 transition-transform duration-200 group-hover:opacity-80 group-hover:-rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 10 6"
            >
              <path
                d="M1 1l4 4 4-4"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <div className="absolute top-[calc(100%+10px)] left-0 min-w-[210px] bg-[var(--bg-raised)] border border-[var(--gf-border-hi)] rounded-[12px] p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform transition-all duration-170 group-hover:translate-y-0 -translate-y-2 scale-[0.975] group-hover:scale-100 shadow-lg z-[300]">
            <div className="text-xs font-semibold letter-spacing-[0.11em] uppercase text-[var(--text-3)] px-2.5 py-1.5">
              Services
            </div>
            <a
              href="#"
              className="flex items-center gap-2 px-2.5 py-2 rounded-[7px] text-[15.5px] font-normal text-[var(--text-2)] hover:bg-[var(--accent-dim2)] hover:text-[var(--text-1)] transition-colors duration-120"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-3)]" />
              <span>Current</span>
            </a>
          </div>
        </div>
      </div>

      {/* Center: Nav Items */}
      <div className="flex items-center flex-1">
        {/* Rotation */}
        <Link
          href="/rotation"
          className={`relative px-3 py-1.5 text-[16px] font-normal rounded-[6px] transition-colors duration-140 ${
            isActive('/rotation')
              ? 'text-[var(--text-1)]'
              : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
          }`}
        >
          Rotation
          {isActive('/rotation') && (
            <div className="absolute bottom-[-16px] left-3 right-3 h-[1px] bg-[var(--text-1)]" />
          )}
        </Link>

        {/* Analytics Dropdown */}
        <div className="relative group">
          <button
            className={`flex items-center gap-1 px-3 py-1.5 text-[16px] font-normal rounded-[6px] transition-colors duration-140 ${
              isActive('/case-logs') ||
              isActive('/fellowship') ||
              isActive('/heatmap')
                ? 'text-[var(--text-1)]'
                : 'text-[var(--text-2)] group-hover:text-[var(--text-1)]'
            }`}
          >
            <span>Analytics</span>
            <svg
              className="w-[10px] h-[10px] opacity-45 transition-transform duration-200 group-hover:opacity-90 group-hover:-rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 10 6"
            >
              <path
                d="M1 1l4 4 4-4"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {(isActive('/case-logs') ||
            isActive('/fellowship') ||
            isActive('/heatmap')) && (
            <div className="absolute bottom-[-16px] left-3 right-3 h-[1px] bg-[var(--text-1)]" />
          )}
          <div className="absolute top-[calc(100%+10px)] left-0 min-w-[208px] bg-[var(--bg-raised)] border border-[var(--gf-border-hi)] rounded-[12px] p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transform transition-all duration-170 group-hover:translate-y-0 -translate-y-2 scale-[0.975] group-hover:scale-100 shadow-lg z-[300]">
            <Link
              href="/case-logs"
              className={`flex items-center gap-2 px-2.5 py-2 rounded-[7px] text-[15.5px] font-normal transition-colors duration-120 ${
                isActive('/case-logs')
                  ? 'bg-[var(--accent-dim2)] text-[var(--text-1)] font-medium'
                  : 'text-[var(--text-2)] hover:bg-[var(--accent-dim2)] hover:text-[var(--text-1)]'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isActive('/case-logs')
                    ? 'bg-[var(--text-1)]'
                    : 'bg-[var(--text-3)]'
                }`}
              />
              <span>Case Logs</span>
            </Link>
            <Link
              href="/fellowship"
              className={`flex items-center gap-2 px-2.5 py-2 rounded-[7px] text-[15.5px] font-normal transition-colors duration-120 ${
                isActive('/fellowship')
                  ? 'bg-[var(--accent-dim2)] text-[var(--text-1)] font-medium'
                  : 'text-[var(--text-2)] hover:bg-[var(--accent-dim2)] hover:text-[var(--text-1)]'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isActive('/fellowship')
                    ? 'bg-[var(--text-1)]'
                    : 'bg-[var(--text-3)]'
                }`}
              />
              <span>Fellowship</span>
            </Link>
            <Link
              href="/heatmap"
              className={`flex items-center gap-2 px-2.5 py-2 rounded-[7px] text-[15.5px] font-normal transition-colors duration-120 ${
                isActive('/heatmap')
                  ? 'bg-[var(--accent-dim2)] text-[var(--text-1)] font-medium'
                  : 'text-[var(--text-2)] hover:bg-[var(--accent-dim2)] hover:text-[var(--text-1)]'
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isActive('/heatmap')
                    ? 'bg-[var(--text-1)]'
                    : 'bg-[var(--text-3)]'
                }`}
              />
              <span>Heatmap</span>
            </Link>
          </div>
        </div>

        {/* Admin */}
        <Link
          href="/admin"
          className={`relative px-3 py-1.5 text-[16px] font-normal rounded-[6px] transition-colors duration-140 ${
            isActive('/admin')
              ? 'text-[var(--text-1)]'
              : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
          }`}
        >
          Admin
          {isActive('/admin') && (
            <div className="absolute bottom-[-16px] left-3 right-3 h-[1px] bg-[var(--text-1)]" />
          )}
        </Link>
      </div>

      {/* Right: Search, Theme Toggle, Login */}
      <div className="flex items-center gap-2 ml-auto flex-shrink-0">
        {/* Search Bar */}
        <div className="flex items-center gap-1.5 bg-[var(--accent-dim)] border border-[var(--gf-border)] rounded-2 px-2.5 py-1.5 w-[180px] cursor-text transition-colors duration-140 hover:border-[var(--gf-border-hi)]">
          <svg
            className="w-4 h-4 text-[var(--text-3)] flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="text-[15px] text-[var(--text-3)] flex-1">
            Search
          </span>
          <div className="text-[10.5px] text-[var(--text-3)] bg-[var(--bg)] border border-[var(--gf-border-hi)] rounded px-1 py-0.5 flex-shrink-0">
            cmd K
          </div>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-[34px] h-[34px] rounded-lg border border-[var(--gf-border)] bg-transparent cursor-pointer grid place-items-center text-[var(--text-2)] transition-all duration-140 hover:border-[var(--gf-border-hi)] hover:text-[var(--text-1)] hover:bg-[var(--accent-dim2)]"
        >
          {theme === 'dark' ? (
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v1m6.364 1.636l-.707-.707M21 12h-1m-1.636 6.364l-.707.707M12 21v-1m-6.364-1.636l.707.707M3 12h1m1.636-6.364l.707-.707" />
              <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Login / Avatar */}
        <Link
          href="/login"
          className="px-3.5 py-1.5 text-[15.5px] font-normal text-[var(--text-2)] bg-transparent border border-[var(--gf-border-hi)] rounded-lg cursor-pointer font-sans transition-all duration-140 hover:text-[var(--text-1)] hover:border-[var(--text-3)]"
        >
          Log In
        </Link>
      </div>
    </nav>
  );
}
