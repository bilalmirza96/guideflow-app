'use client';

import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function TopNav() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  return (
    <nav
      className="fixed top-0 left-0 right-0 h-[52px] z-[200] backdrop-blur-[14px] border-b border-[var(--gf-border)] flex items-center px-10"
      style={{
        background:
          theme === 'dark'
            ? 'rgba(10, 10, 10, 0.92)'
            : 'rgba(250, 250, 248, 0.92)',
        transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)',
      }}
    >
      {/* Left: Logo + Service Switcher */}
      <div className="flex items-center gap-10 mr-6 flex-shrink-0">
        <Link href="/" className="flex items-center gap-[10px] whitespace-nowrap">
          <div className="w-[27px] h-[27px] bg-[var(--ac-orange)] rounded-[7px] flex items-center justify-center flex-shrink-0">
            <span className="font-serif text-[13px] font-semibold text-[#0A0A0A] leading-[1]">
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

        <div className="relative group">
          <button
            className="flex items-center gap-1.5 px-1.5 py-1 rounded-[6px] text-[15px] font-normal text-[var(--text-2)] group-hover:text-[var(--text-1)] group-hover:bg-[var(--accent-dim2)]"
            style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
          >
            <span className="whitespace-nowrap">General Surgery</span>
            <svg
              className="w-[11px] h-[11px] opacity-40 group-hover:opacity-80 group-hover:-rotate-180"
              style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 10 6"
            >
              <path d="M1 1l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div
            className="absolute top-[calc(100%+10px)] left-0 min-w-[210px] bg-[var(--bg-raised)] border border-[var(--gf-border-hi)] rounded-[14px] p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible -translate-y-2 group-hover:translate-y-0 scale-[0.975] group-hover:scale-100 z-[300]"
            style={{
              boxShadow: 'var(--shadow-lg)',
              transition: 'all 0.35s cubic-bezier(0.215, 0.61, 0.355, 1)',
            }}
          >
            <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--text-3)] px-2.5 py-1.5">
              Services
            </div>
            {['General Surgery', 'Medicine', 'Emergency Medicine', 'Urology', 'Cardiology', 'Neurology', 'NICU', 'Pharmacy', 'Palliative Care'].map((svc) => (
              <a
                key={svc}
                href="#"
                className={`flex items-center gap-2 px-2.5 py-2 rounded-[8px] text-[14px] font-normal ${
                  svc === 'General Surgery'
                    ? 'bg-[rgba(212,165,116,0.12)] text-[var(--text-1)] font-medium'
                    : 'text-[var(--text-2)] hover:bg-[rgba(212,165,116,0.12)] hover:text-[var(--text-1)]'
                }`}
                style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${svc === 'General Surgery' ? 'bg-[var(--ac-orange)]' : 'bg-[var(--text-3)]'}`} />
                <span>{svc}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Center: Nav Items */}
      <div className="flex items-center flex-1">
        <Link
          href="/rotation"
          className={`relative px-3 py-1.5 text-[15px] font-normal rounded-[6px] ${
            isActive('/rotation')
              ? 'text-[var(--text-1)]'
              : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
          }`}
          style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
        >
          Rotation
          {isActive('/rotation') && (
            <div className="absolute bottom-[-16px] left-3 right-3 h-[2px] bg-[var(--ac-orange)] rounded-full" />
          )}
        </Link>

        {/* Guidelines Dropdown */}
        <div className="relative group">
          <button
            className="flex items-center gap-1 px-3 py-1.5 text-[15px] font-normal rounded-[6px] text-[var(--text-2)] group-hover:text-[var(--text-1)]"
            style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
          >
            <span>Guidelines</span>
            <svg
              className="w-[10px] h-[10px] opacity-45 group-hover:opacity-90 group-hover:-rotate-180"
              style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 10 6"
            >
              <path d="M1 1l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div
            className="absolute top-[calc(100%+10px)] left-0 min-w-[208px] bg-[var(--bg-raised)] border border-[var(--gf-border-hi)] rounded-[14px] p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible -translate-y-2 group-hover:translate-y-0 scale-[0.975] group-hover:scale-100 z-[300]"
            style={{
              boxShadow: 'var(--shadow-lg)',
              transition: 'all 0.35s cubic-bezier(0.215, 0.61, 0.355, 1)',
            }}
          >
            <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--text-3)] px-2.5 py-1.5">
              Specialties
            </div>
            {['Emergency', 'Surgery', 'Pharmacy', 'Neurology'].map((spec) => (
              <a
                key={spec}
                href="#"
                className="flex items-center gap-2 px-2.5 py-2 rounded-[8px] text-[14px] font-normal text-[var(--text-2)] hover:bg-[rgba(212,165,116,0.12)] hover:text-[var(--text-1)]"
                style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-3)]" />
                <span>{spec}</span>
              </a>
            ))}
            <div className="h-px bg-[var(--gf-border)] mx-1 my-1" />
            <a
              href="#"
              className="flex items-center gap-2 px-2.5 py-2 rounded-[8px] text-[14px] font-normal text-[var(--text-2)] hover:bg-[rgba(212,165,116,0.12)] hover:text-[var(--text-1)]"
              style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 3v18M3 9h18"/>
              </svg>
              <span>View All</span>
            </a>
          </div>
        </div>

        {/* Directory Dropdown */}
        <div className="relative group">
          <button
            className="flex items-center gap-1 px-3 py-1.5 text-[15px] font-normal rounded-[6px] text-[var(--text-2)] group-hover:text-[var(--text-1)]"
            style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
          >
            <span>Directory</span>
            <svg
              className="w-[10px] h-[10px] opacity-45 group-hover:opacity-90 group-hover:-rotate-180"
              style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 10 6"
            >
              <path d="M1 1l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <div
            className="absolute top-[calc(100%+10px)] left-0 min-w-[208px] bg-[var(--bg-raised)] border border-[var(--gf-border-hi)] rounded-[14px] p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible -translate-y-2 group-hover:translate-y-0 scale-[0.975] group-hover:scale-100 z-[300]"
            style={{
              boxShadow: 'var(--shadow-lg)',
              transition: 'all 0.35s cubic-bezier(0.215, 0.61, 0.355, 1)',
            }}
          >
            <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--text-3)] px-2.5 py-1.5">
              Contacts
            </div>
            <a
              href="#"
              className="flex items-center gap-2 px-2.5 py-2 rounded-[8px] text-[14px] font-normal text-[var(--text-2)] hover:bg-[rgba(212,165,116,0.12)] hover:text-[var(--text-1)]"
              style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-3)]" />
              <span>On-Call Directory</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2 px-2.5 py-2 rounded-[8px] text-[14px] font-normal text-[var(--text-2)] hover:bg-[rgba(212,165,116,0.12)] hover:text-[var(--text-1)]"
              style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-3)]" />
              <span>Service Contacts</span>
            </a>
          </div>
        </div>

        {/* Analytics Dropdown */}
        <div className="relative group">
          <button
            className={`flex items-center gap-1 px-3 py-1.5 text-[15px] font-normal rounded-[6px] ${
              isActive('/case-logs') || isActive('/fellowship') || isActive('/heatmap')
                ? 'text-[var(--text-1)]'
                : 'text-[var(--text-2)] group-hover:text-[var(--text-1)]'
            }`}
            style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
          >
            <span>Analytics</span>
            <svg
              className="w-[10px] h-[10px] opacity-45 group-hover:opacity-90 group-hover:-rotate-180"
              style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 10 6"
            >
              <path d="M1 1l4 4 4-4" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {(isActive('/case-logs') || isActive('/fellowship') || isActive('/heatmap')) && (
            <div className="absolute bottom-[-16px] left-3 right-3 h-[2px] bg-[var(--ac-orange)] rounded-full" />
          )}
          <div
            className="absolute top-[calc(100%+10px)] left-0 min-w-[208px] bg-[var(--bg-raised)] border border-[var(--gf-border-hi)] rounded-[14px] p-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible -translate-y-2 group-hover:translate-y-0 scale-[0.975] group-hover:scale-100 z-[300]"
            style={{
              boxShadow: 'var(--shadow-lg)',
              transition: 'all 0.35s cubic-bezier(0.215, 0.61, 0.355, 1)',
            }}
          >
            <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--text-3)] px-2.5 py-1.5">
              Reports
            </div>
            {[
              { href: '/case-logs', label: 'Case Logs' },
              { href: '/fellowship', label: 'Fellowship' },
              { href: '/heatmap', label: 'Autonomy Map' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-[8px] text-[14px] font-normal ${
                  isActive(item.href)
                    ? 'bg-[rgba(212,165,116,0.12)] text-[var(--text-1)] font-medium'
                    : 'text-[var(--text-2)] hover:bg-[rgba(212,165,116,0.12)] hover:text-[var(--text-1)]'
                }`}
                style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    isActive(item.href) ? 'bg-[var(--ac-orange)]' : 'bg-[var(--text-3)]'
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>

        <Link
          href="/admin"
          className={`relative px-3 py-1.5 text-[15px] font-normal rounded-[6px] ${
            isActive('/admin')
              ? 'text-[var(--text-1)]'
              : 'text-[var(--text-2)] hover:text-[var(--text-1)]'
          }`}
          style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
        >
          Admin
          {isActive('/admin') && (
            <div className="absolute bottom-[-16px] left-3 right-3 h-[2px] bg-[var(--ac-orange)] rounded-full" />
          )}
        </Link>
      </div>

      {/* Right: Search, Theme Toggle, Avatar */}
      <div className="flex items-center gap-3 ml-auto flex-shrink-0">
        <div
          className="flex items-center gap-1.5 bg-[var(--accent-dim)] border border-[var(--gf-border)] rounded-lg px-3 py-1.5 w-[200px] cursor-text hover:border-[var(--gf-border-hi)]"
          style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
        >
          <svg className="w-3.5 h-3.5 text-[var(--text-3)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[14px] text-[var(--text-3)] flex-1">Search...</span>
          <div className="text-[10px] text-[var(--text-3)] bg-[var(--bg)] border border-[var(--gf-border-hi)] rounded px-1.5 py-0.5 flex-shrink-0 font-mono">
            ⌘K
          </div>
        </div>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-[34px] h-[34px] rounded-lg bg-transparent cursor-pointer grid place-items-center text-[var(--text-3)] hover:text-[var(--text-1)] hover:bg-[var(--accent-dim2)]"
          style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
        >
          {theme === 'dark' ? (
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* User Avatar */}
        <div
          className="w-[30px] h-[30px] rounded-full bg-[var(--text-1)] flex items-center justify-center cursor-pointer flex-shrink-0"
          title="Dr. Resident"
        >
          <span className="text-[11px] font-semibold text-[var(--bg)] leading-[1]">
            DR
          </span>
        </div>
      </div>
    </nav>
  );
}