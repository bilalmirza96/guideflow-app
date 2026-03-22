interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-2">
      <div className="block text-[11px] font-semibold tracking-[0.08em] uppercase text-[var(--ac-orange)] mb-3">
        {eyebrow}
      </div>
      <h1 className="font-serif text-[40px] font-medium text-[var(--text-1)] tracking-[-0.8px] leading-[1.12] mb-3">
        {title}
      </h1>
      {subtitle && (
        <p className="text-[16px] font-light text-[var(--text-2)] leading-[1.65] max-w-[520px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
