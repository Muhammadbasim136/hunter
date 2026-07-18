export default function SegmentedControl({ options, value, onChange, size = "md" }) {
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm";
  return (
    <div
      role="radiogroup"
      className="inline-flex items-center bg-surface-raised border border-hairline rounded-lg p-1 gap-1"
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`${pad} rounded-md font-medium transition-colors whitespace-nowrap
              ${active ? "bg-brass text-bg" : "text-ink-muted hover:text-ink"}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
