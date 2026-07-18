import { NavLink } from "react-router-dom";
import { IconRadar, IconCrosshair, IconSliders, IconLogout, IconShield } from "../ui/Icons";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: IconRadar, end: true },
  { to: "/search", label: "New Search", icon: IconCrosshair },
  { to: "/settings", label: "Settings", icon: IconSliders },
];

export default function Sidebar({ className = "" }) {
  const { logout, isAdmin } = useAuth();
  const items = isAdmin ? [...NAV_ITEMS, { to: "/admin", label: "Admin", icon: IconShield }] : NAV_ITEMS;

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
     ${isActive ? "bg-surface-raised text-brass" : "text-ink-muted hover:text-ink hover:bg-surface-raised/60"}`;

  return (
    <aside className={`flex flex-col justify-between border-hairline ${className}`}>
      <div>
        <div className="flex items-center gap-2.5 px-3 py-5">
          <div className="w-7 h-7 rounded-md bg-brass/15 border border-brass/40 flex items-center justify-center text-brass">
            <IconCrosshair width="16" height="16" />
          </div>
          <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
            Hunter Lite
          </span>
        </div>

        <nav className="flex flex-col gap-1 px-2 mt-2">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClasses}>
              <Icon className="shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="px-2 pb-4">
        <button onClick={logout} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-ink-muted hover:text-alert-bright hover:bg-alert/10 transition-colors w-full">
          <IconLogout className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
