'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SidebarSection {
  label: string;
  links: Array<{
    href: string;
    label: string;
    highlight?: boolean;
  }>;
}

export function Sidebar() {
  const pathname = usePathname();

  const isRotationPage = pathname.startsWith('/rotation');
  const isCaseLogsPage = pathname.startsWith('/case-logs');
  const isFellowshipPage = pathname.startsWith('/fellowship');
  const isHeatmapPage = pathname.startsWith('/heatmap');
  const isAdminPage = pathname.startsWith('/admin');

  const getSidebarSections = (): SidebarSection[] => {
    if (isRotationPage) {
      return [
        {
          label: '',
          links: [
            { href: '/case-logs', label: 'Case Log' },
            { href: '/rotation/procedures', label: 'Procedure Log' },
            { href: '/rotation/on-call', label: 'On-Call Directory' },
            { href: '/rotation/guidelines', label: 'Guidelines' },
          ],
        },
      ];
    }

    if (isCaseLogsPage) {
      return [
        {
          label: 'Analytics',
          links: [
            { href: '/case-logs', label: 'Case Logs' },
            { href: '/case-logs/search', label: 'Search Analytics' },
          ],
        },
        {
          label: 'Role',
          links: [
            { href: '/case-logs', label: 'All Roles' },
            { href: '/case-logs?role=sc', label: 'Surgeon Chief (SC)' },
            { href: '/case-logs?role=sj', label: 'Surgeon Junior (SJ)' },
            { href: '/case-logs?role=ta', label: 'Teaching Asst (TA)' },
            { href: '/case-logs?role=fa', label: 'First Assistant (FA)' },
          ],
        },
        {
          label: 'PGY Year',
          links: [
            { href: '/case-logs?pgy=all', label: 'All Years' },
            { href: '/case-logs?pgy=1', label: 'PGY-1' },
            { href: '/case-logs?pgy=2', label: 'PGY-2' },
            { href: '/case-logs?pgy=3', label: 'PGY-3' },
            { href: '/case-logs?pgy=4', label: 'PGY-4' },
            { href: '/case-logs?pgy=5', label: 'PGY-5' },
          ],
        },
      ];
    }

    if (isFellowshipPage) {
      return [
        {
          label: 'Fellowship Goal',
          links: [
            { href: '/fellowship', label: 'HPB Surgery' },
          ],
        },
        {
          label: 'Matched Fellows',
          links: [],
        },
        {
          label: 'Societies',
          links: [
            { href: '/fellowship/societies/ahpba', label: 'AHPBA' },
            { href: '/fellowship/societies/ssat', label: 'SSAT' },
            { href: '/fellowship/societies/acs', label: 'ACS' },
          ],
        },
      ];
    }

    if (isHeatmapPage) {
      return [
        {
          label: 'Filter',
          links: [
            { href: '/heatmap', label: 'All Procedures' },
            { href: '/heatmap?filter=category', label: 'By Category' },
            { href: '/heatmap?filter=pgy', label: 'By PGY Year' },
          ],
        },
        {
          label: 'Legend',
          links: [],
        },
        {
          label: 'Compare',
          links: [
            { href: '/heatmap?compare=cohort', label: 'My cohort' },
            { href: '/heatmap?compare=national', label: 'National avg' },
          ],
        },
      ];
    }

    if (isAdminPage) {
      return [
        {
          label: 'Admin',
          links: [
            { href: '/admin', label: 'Guidelines' },
            { href: '/admin/directory', label: 'Directory' },
            { href: '/admin/users', label: 'Users' },
          ],
        },
      ];
    }

    return [
      {
        label: 'Quick Links',
        links: [
          { href: '/rotation', label: 'Dashboard' },
        ],
      },
    ];
  };

  const sections = getSidebarSections();
  const isActiveLink = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="w-[240px] bg-[var(--bg)] border-r border-[var(--gf-border)] fixed top-[52px] bottom-0 left-0 overflow-y-auto py-6 z-[2]">
      {/* Rotation Context Block */}
      {isRotationPage && (
        <div className="px-4 mb-4">
          <div className="px-2 pb-1">
            <select
              className="bg-transparent border-none text-[15px] font-medium text-[var(--text-1)] cursor-pointer p-0 font-sans w-full outline-none"
              defaultValue="General Surgery"
              style={{ appearance: 'none' }}
            >
              <option>General Surgery</option>
              <option>Pediatric Surgery</option>
              <option>Vascular Surgery</option>
            </select>
          </div>
          <div className="text-[13px] text-[var(--text-3)] px-2 py-0.5">
            Start: Jan 6, 2026
          </div>
          <div className="text-[13px] text-[var(--text-3)] px-2 pb-3">
            End: Mar 27, 2026
          </div>
        </div>
      )}

      {/* Sidebar Sections */}
      {sections.map((section, idx) => (
        <div key={idx} className={cn('px-3', idx > 0 && 'mt-5')}>
          {section.label && (
            <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--text-3)] px-3 pb-3">
              {section.label}
            </div>
          )}
          {section.links.length > 0 && (
            <div className="space-y-0.5">
              {section.links.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={cn(
                    'block w-full py-[8px] px-3 rounded-lg text-[14px] transition-all duration-300',
                    'hover:text-[var(--text-1)]',
                    link.highlight
                      ? 'text-[var(--ac-orange)] font-medium'
                      : isActiveLink(link.href)
                        ? 'bg-[rgba(212,165,116,0.12)] text-[var(--text-1)] font-medium border-l-2 border-[var(--ac-orange)] pl-[10px]'
                        : 'text-[var(--text-2)] hover:bg-[var(--accent-dim2)] border-l-2 border-transparent'
                  )}
                  style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          {/* Matched Fellows stats for fellowship page */}
          {isFellowshipPage && section.label === 'Matched Fellows' && (
            <div className="space-y-1 px-3">
              <div className="text-[14px] text-[var(--text-2)] py-1">
                Avg. biliary: <span className="text-[var(--text-1)] font-medium">68</span>
              </div>
              <div className="text-[14px] text-[var(--text-2)] py-1">
                Avg. publications: <span className="text-[var(--text-1)] font-medium">2.1</span>
              </div>
              <div className="text-[14px] text-[var(--text-2)] py-1">
                Avg. presentations: <span className="text-[var(--text-1)] font-medium">1.0</span>
              </div>
              <div className="text-[14px] text-[var(--text-2)] py-1">
                Match rate: <span className="text-[var(--ac-green)] font-medium">71%</span>
              </div>
            </div>
          )}

          {/* Legend info for heatmap page */}
          {isHeatmapPage && section.label === 'Legend' && (
            <div className="space-y-1 px-3">
              <div className="text-[14px] text-[var(--text-2)] py-1">Outer: EPA Score</div>
              <div className="text-[14px] text-[var(--text-2)] py-1">Inner dot: Autonomy</div>
            </div>
          )}
        </div>
      ))}

      {/* Fellowship Readiness in Rotation Sidebar */}
      {isRotationPage && (
        <div className="px-3 mt-5">
          <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--text-3)] px-3 pb-3">
            My Fellowship
          </div>
          <Link
            href="/fellowship"
            className="block w-full py-[8px] px-3 rounded-lg text-[14px] font-medium text-[var(--ac-orange)] hover:bg-[var(--accent-dim2)]"
            style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
          >
            HPB Surgery
          </Link>
          <div className="px-3 pt-1 pb-2">
            <div className="text-[12px] text-[var(--text-3)] mb-1.5">Readiness: 34%</div>
            <div className="w-full h-[3px] bg-[var(--prog-bg)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--ac-orange-soft)] rounded-full"
                style={{ width: '34%', transition: 'width 0.5s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
