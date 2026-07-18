const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };

export function IconRadar(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" opacity="0.5" />
      <path d="M12 12 L18 7" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconCrosshair(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...props}>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>
  );
}

export function IconSliders(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...props}>
      <path d="M4 6h10M17 6h3M4 12h3M9 12h11M4 18h13M20 18h0" />
      <circle cx="14" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="7" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconLogout(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}

export function IconWaveform(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...props}>
      <path d="M3 12h2M7 8v8M11 5v14M15 8v8M19 10v4M21 12h0" />
    </svg>
  );
}

export function IconCheck(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function IconChevronDown(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function IconRefresh(props) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" {...base} {...props}>
      <path d="M3 12a9 9 0 0 1 15.3-6.4M21 12a9 9 0 0 1-15.3 6.4" />
      <path d="M18 3v5h-5M6 21v-5h5" />
    </svg>
  );
}

export function IconSend(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" {...base} {...props}>
      <path d="M22 2 11 13" />
      <path d="M22 2 15 22l-4-9-9-4 20-7z" />
    </svg>
  );
}

export function IconTrash(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" {...base} {...props}>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 15h10l1-15" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconWand(props) {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" {...base} {...props}>
      <path d="M15 4V2M15 10V8M9 15H7M17.5 4.5l1 1M8.5 11.5l1 1M2 22l10-10" />
      <path d="M20 8l1.5 1.5L20 11l-1.5-1.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconMail(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

export function IconWhatsapp(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...props}>
      <path d="M7 17l-3 1 1-3a8 8 0 1 1 2 2z" />
      <path d="M9 10c0 3 2 5 5 5" opacity="0.6" />
    </svg>
  );
}

export function IconAlertTriangle(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...props}>
      <path d="M12 3 2 20h20L12 3z" />
      <path d="M12 10v4M12 17h0" />
    </svg>
  );
}

export function IconInbox(props) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
      <path d="M4 12h4l2 3h4l2-3h4" />
      <path d="M4 12 5.5 5a2 2 0 0 1 2-1.5h9a2 2 0 0 1 2 1.5L20 12v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6z" />
    </svg>
  );
}

export function IconShield(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...props}>
      <path d="M12 3 5 6v5c0 4.5 2.8 8 7 10 4.2-2 7-5.5 7-10V6l-7-3z" />
      <path d="M9 12l2 2 4-5" />
    </svg>
  );
}

export function IconUsers(props) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...base} {...props}>
      <path d="M16 19c0-2.2-1.8-4-4-4s-4 1.8-4 4" />
      <circle cx="12" cy="9" r="3" />
      <path d="M19 18c0-1.7-1-3.1-2.5-3.7M17 7.5a2.5 2.5 0 0 1 0 5" opacity="0.65" />
      <path d="M5 18c0-1.7 1-3.1 2.5-3.7M7 7.5a2.5 2.5 0 0 0 0 5" opacity="0.65" />
    </svg>
  );
}
