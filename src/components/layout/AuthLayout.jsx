import { IconCrosshair } from "../ui/Icons";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-8 h-8 rounded-md bg-brass/15 border border-brass/40 flex items-center justify-center text-brass">
            <IconCrosshair width="18" height="18" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-ink">
            Hunter Lite
          </span>
        </div>

        <div className="card p-6 sm:p-7">
          <h1 className="font-display text-xl font-semibold text-ink mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-ink-muted mb-6">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
