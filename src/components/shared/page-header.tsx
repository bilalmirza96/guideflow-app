interface PageHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function PageHeader({ eyebrow, title, subtitle }: PageHeaderProps) {
  return (
    <div>
      <div className="block text-xs font-medium tracking-[0.11em] uppercase text-[var(--text-3)] mb-[11px]">
        {eyebrow}
      </div>
      <h1 className="font-serif text-[38px] font-medium text-[var(--text-1)] tracking-[-0.8px] leading-[1.15] mb-[10px]">
        {title}
      </h1>
      {subtitle && (
        <p className="text-[17px] font-light text-[var(--text-2)] leading-[1.65] max-w-[500px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
