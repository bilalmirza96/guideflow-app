import Link from 'next/link';
import { FileText, Phone, ArrowRight } from 'lucide-react';

export function QuickLinksGrid() {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Link href="/case-logs">
        <div className="bg-[var(--bg-raised)] border border-[var(--gf-border)] rounded-xl p-[18px_20px] flex items-start gap-[15px] cursor-pointer shadow-[var(--shadow-sm)] hover:border-[var(--gf-border-hi)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all">
          <div className="flex-shrink-0 mt-1">
            <FileText className="w-5 h-5 text-[var(--ac-orange)]" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold text-[var(--text-3)] mb-1">
              127 cases
            </div>
            <div className="text-[15px] font-medium text-[var(--text-1)] mb-1">
              Case Logs
            </div>
            <div className="text-[12px] text-[var(--text-3)] mb-3">
              ACGME category tracking
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--ac-orange)]" />
          </div>
        </div>
      </Link>

      <div className="bg-[var(--bg-raised)] border border-[var(--gf-border)] rounded-xl p-[18px_20px] flex items-start gap-[15px] cursor-pointer shadow-[var(--shadow-sm)] hover:border-[var(--gf-border-hi)] hover:shadow-[var(--shadow-md)] hover:-translate-y-0.5 transition-all">
        <div className="flex-shrink-0 mt-1">
          <Phone className="w-5 h-5 text-[var(--ac-blue)]" />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-[var(--text-3)] mb-1">
            3 on-call
          </div>
          <div className="text-[15px] font-medium text-[var(--text-1)] mb-1">
            On-Call Directory
          </div>
          <div className="text-[12px] text-[var(--text-3)] mb-3">
            Attendings & service numbers
          </div>
          <ArrowRight className="w-4 h-4 text-[var(--ac-blue)]" />
        </div>
      </div>
    </div>
  );
}
