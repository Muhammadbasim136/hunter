import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import StatusStrip from "./StatusStrip";
import { IconSliders } from "../ui/Icons";

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Desktop sidebar */}
      <Sidebar className="hidden md:flex w-56 shrink-0 border-r py-2" />

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileNavOpen(false)}
          />
          <Sidebar className="absolute left-0 top-0 bottom-0 w-64 bg-bg border-r flex py-2 animate-fade-in" />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center md:hidden border-b border-hairline">
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation"
            className="p-3 text-ink-muted hover:text-ink shrink-0"
          >
            <IconSliders />
          </button>
          <StatusStrip className="flex-1 min-w-0" />
        </div>
        <div className="hidden md:block">
          <StatusStrip />
        </div>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
