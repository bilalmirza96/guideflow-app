import { cn } from '@/lib/utils';

interface RoleBadgeProps {
  role: 'SC' | 'SJ' | 'TA' | 'FA';
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const variants = {
    SC: {
      bg: 'bg-[var(--ac-orange-dim)]',
      text: 'text-[var(--ac-orange)]',
      border: 'border-[rgba(232,149,111,0.22)]',
    },
    SJ: {
      bg: 'bg-[var(--ac-blue-dim)]',
      text: 'text-[var(--ac-blue)]',
      border: 'border-[rgba(139,184,224,0.22)]',
    },
    TA: {
      bg: 'bg-[var(--ac-green-dim)]',
      text: 'text-[var(--ac-green)]',
      border: 'border-[rgba(154,184,122,0.22)]',
    },
    FA: {
      bg: 'bg-[var(--accent-dim)]',
      text: 'text-[var(--text-3)]',
      border: 'border-[var(--gf-border-hi)]',
    },
  };

  const variant = variants[role];

  return (
    <span
      className={cn(
        'inline-flex items-center text-[11px] font-semibold px-2 py-[3px] rounded-[5px] border whitespace-nowrap',
        variant.bg,
        variant.text,
        variant.border
      )}
    >
      {role}
    </span>
  );
}
