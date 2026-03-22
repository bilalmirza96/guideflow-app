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

    // Default for other routes
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
    <aside className="w-[220px] bg-[var(--bg)] border-r border-[var(--gf-border)] fixed top-[52px] bottom-0 left-0 overflow-y-auto py-6 z-[2]">
      {sections.map((section, idx) => (
        <div key={idx} className="px-2">
          <div className="text-xs font-medium text-[var(--text-3)] px-2 pt-[18px] pb-2">
            {section.label}
          </div>
          <div className="space-y-0.5">
            {section.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block w-full py-[9px] px-3 rounded-lg text-[15px] transition-colors duration-120',
                  isActiveLink(link.href)
                    ? 'bg-[var(--accent-dim2)] text-[var(--text-1)] font-medium'
                    : 'text-[var(--text-2)] hover:bg-[var(--accent-dim2)] hover:text-[var(--text-1)]'
                )}
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
