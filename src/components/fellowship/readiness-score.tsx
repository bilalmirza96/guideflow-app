export function ReadinessScore() {
  const score = 64;

  return (
    <div className="flex justify-center items-center py-8">
      <div className="flex flex-col items-center gap-4">
        {/* Circular indicator */}
        <div className="relative w-40 h-40 rounded-full border-4 border-[var(--gf-border)] bg-[var(--bg-raised)] flex items-center justify-center">
          <div className="text-center">
            <div
              className="text-6xl font-lora font-bold text-[var(--text-1)]"
              style={{ fontFamily: 'Lora' }}
            >
              {score}%
            </div>
          </div>
        </div>

        {/* Label */}
        <p className="text-lg text-[var(--text-2)] font-medium">Fellowship Readiness</p>
      </div>
    </div>
  );
}
