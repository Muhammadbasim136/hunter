import { IconWhatsapp } from "../ui/Icons";

export default function StatusStrip({ className = "" }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-4 sm:px-6 h-11 border-b border-hairline bg-surface text-xs font-mono transition-colors ${className}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="relative flex items-center justify-center w-2.5 h-2.5 shrink-0">
          <span className="relative inline-flex rounded-full w-2 h-2 bg-signal" />
        </span>
        <span className="truncate text-ink-muted">Manual WhatsApp app send</span>
      </div>

      <div className="flex items-center gap-2 shrink-0 text-signal-bright">
        <IconWhatsapp width="14" height="14" />
        <span className="hidden sm:inline">Business default</span>
      </div>
    </div>
  );
}
