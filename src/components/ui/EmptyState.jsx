export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon && (
        <div className="w-12 h-12 rounded-full bg-surface-raised border border-hairline flex items-center justify-center text-brass mb-4">
          {icon}
        </div>
      )}
      <h3 className="font-display text-base font-medium text-ink mb-1.5">{title}</h3>
      {description && (
        <p className="text-sm text-ink-muted max-w-sm mb-5 leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}
