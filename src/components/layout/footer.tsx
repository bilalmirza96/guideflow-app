export function Footer() {
  return (
    <footer className="ml-[220px] border-t border-[var(--gf-border)] py-5 px-14 bg-[var(--bg)]">
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-[var(--text-3)]">
          © 2026 PMG Health Technologies
        </p>
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-[12px] text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors duration-140"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-[12px] text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors duration-140"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-[12px] text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors duration-140"
          >
            Support
          </a>
          <a
            href="#"
            className="text-[12px] text-[var(--text-3)] hover:text-[var(--text-2)] transition-colors duration-140"
          >
            HIPAA
          </a>
        </div>
      </div>
    </footer>
  );
}
