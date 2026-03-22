export function GridOverlay() {
  return (
    <div
      className="fixed top-0 bottom-0 right-0 left-[220px] pointer-events-none z-0 transition-all duration-300"
      style={{
        backgroundImage:
          'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    />
  );
}
