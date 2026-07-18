const STATUS_STYLES = {
  pending: "bg-ink-faint/15 text-ink-muted border-hairline",
  sent: "bg-signal/15 text-signal-bright border-signal-dim",
  failed: "bg-alert/15 text-alert-bright border-alert-dim",
};

const CHANNEL_LABEL = {
  whatsapp: "WhatsApp",
  email: "Email",
  both: "WhatsApp + Email",
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-mono font-medium capitalize ${style}`}
    >
      {status}
    </span>
  );
}

export function ChannelBadge({ channel }) {
  return (
    <span className="inline-flex items-center rounded-full border border-hairline bg-surface-raised px-2 py-0.5 text-xs font-mono text-ink-muted">
      {CHANNEL_LABEL[channel] || channel}
    </span>
  );
}
