import { IconRadar } from "../ui/Icons";

export default function ProgressIndicator({ found = 0, requested = 0 }) {
  const pct = requested > 0 ? Math.min(100, Math.round((found / requested) * 100)) : 0;

  return (
    <div className="flex flex-col items-center text-center py-10 px-6">
      <div className="relative w-16 h-16 mb-5 text-brass">
        <span className="absolute inset-0 rounded-full border-2 border-brass/25" />
        <span className="absolute inset-0 rounded-full bg-brass/10 animate-pulse-ring" />
        <span className="absolute inset-0 flex items-center justify-center">
          <IconRadar width="26" height="26" />
        </span>
      </div>

      <h3 className="font-display text-base font-medium text-ink mb-1">Scanning for leads</h3>
      <p className="text-sm text-ink-muted mb-6">
        Found <span className="font-mono text-ink">{found}</span> of{" "}
        <span className="font-mono text-ink">{requested || "—"}</span> requested
      </p>

      <div className="w-full max-w-xs h-1.5 rounded-full bg-surface-raised border border-hairline overflow-hidden">
        <div
          className="h-full bg-brass transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
