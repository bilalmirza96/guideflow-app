'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SidebarSection {
  label: string;
  links: Array<{
    href: string;
    label: string;
  }>;
}

export function Sidebar() {
  const pathname = usePathname();

  const getSidebarSections = (): SidebarSection[] => {
    if (pathname.startsWith('/rotation')) {
      return [
        {
          label: 'Quick Links',
          links: [
            { href: '/rotation', label: 'Dashboard' },
            { href: '/guidelines', label: 'Guidelines' },
            { href: '/on-call', label: 'On-Call' },
          ],
        },
        {
          label: 'Rotation',
          links: [
            { href: '/rotation/schedule', label: 'Rotation Schedule' },
          ],
        },
      ];
    }

    if (pathname.startsWith('/case-logs')) {
      return [
        {
          label: 'Views',
          links: [
            { href: '/case-logs', label: 'Dashboard' },
            { href: '/case-logs/trends', label: 'Trends' },
          ],
        },
        {
          label: 'Filters',
          links: [
            { href: '/case-logs?filter=month', label: 'This Month' },
            { href: '/case-logs?filter=rotation', label: 'Rotation' },
            { href: '/case-logs?filter=all', label: 'All' },
          ],
        },
      ];
    }

    if (pathname.startsWith('/fellowship')) {
      return [
        {
          label: 'Goal',
          links: [
            { href: '/fellowship', label: 'HPB Surgery' },
          ],
        },
        {
          label: 'Timeline',
          links: [
            { href: '/fellowship/milestones', label: 'Milestones' },
          ],
        },
      ];
    }

    if (pathname.startsWith('/heatmap')) {
      return [
        {
          label: 'Legend',
          links: [
            { href: '/heatmap/legend', label: 'EPA Score (Outer)' },
            { href: '/heatmap/legend', label: 'Autonomy (Inner)' },
          ],
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

    if (pathname.startsWith('/admin')) {
      return [
        {
          label: 'Admin',
          links: [
            { href: '/admin/guidelines', label: 'Guidelines' },
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
  const isActiveLink = (href: string) => pathname === href || pathname.startsWith(href + '/') || pathname.startsWith(href + '?');

  return (
    <aside className="w-[240px] bg-[var(--bg)] border-r border-[var(--gf-border)] fixed top-[52px] bottom-0 left-0 overflow-y-auto py-8 z-[2]">
      {sections.map((section, idx) => (
        <div key={idx} className={cn('px-3', idx > 0 && 'mt-6')}>
          <div className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--text-3)] px-3 pb-3">
            {section.label}
          </div>
          <div className="space-y-0.5">
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block w-full py-[8px] px-3 rounded-lg text-[14px] transition-all duration-300',
                  'hover:text-[var(--text-1)]',
                  isActiveLink(link.href)
                    ? 'bg-[rgba(212,165,116,0.12)] text-[var(--text-1)] font-medium border-l-2 border-[var(--ac-orange)] pl-[10px]'
                    : 'text-[var(--text-2)] hover:bg-[var(--accent-dim2)] border-l-2 border-transparent'
                )}
                style={{ transition: 'all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}