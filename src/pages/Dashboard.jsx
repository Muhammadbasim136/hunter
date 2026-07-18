import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import LeadsTable from "../components/leads/LeadsTable";
import LanguageSelector from "../components/leads/LanguageSelector";
import BulkActionsBar from "../components/leads/BulkActionsBar";
import SegmentedControl from "../components/ui/SegmentedControl";
import { IconRefresh, IconCrosshair } from "../components/ui/Icons";
import { useAppState } from "../context/AppStateContext";

export default function Dashboard() {
  const {
    leads,
    leadsLoading,
    refreshLeads,
    recentlyAddedIds,
    defaultLanguage,
    setDefaultLanguage,
    defaultWhatsappApp,
    setDefaultWhatsappApp,
  } = useAppState();
  const [view, setView] = useState("new");

  const { newLeads, failedLeads, sentLeads } = useMemo(() => {
    const failed = leads.filter((l) => l.status === "failed");
    const sent = leads.filter((l) => l.status === "sent");
    const pending = leads.filter((l) => l.status !== "sent" && l.status !== "failed");
    return { newLeads: pending, failedLeads: failed, sentLeads: sent };
  }, [leads]);

  const visibleLeads =
    view === "failed" ? failedLeads : view === "sent" ? sentLeads : view === "all" ? leads : newLeads;

  const viewOptions = [
    { value: "new", label: `New (${newLeads.length})` },
    { value: "failed", label: `Failed (${failedLeads.length})` },
    { value: "sent", label: `Sent (${sentLeads.length})` },
    { value: "all", label: `All (${leads.length})` },
  ];

  const emptyStateFor = (v) => {
    if (v === "new" && leads.length > 0) {
      return {
        title: "All caught up",
        description: 'Every current lead has already been messaged. Run a new search, or check the "Sent" tab.',
      };
    }
    if (v === "failed") {
      return { title: "No failed sends", description: "Nothing here needs a retry right now." };
    }
    if (v === "sent") {
      return { title: "Nothing sent yet", description: "Sent leads will show up here once you reach out." };
    }
    return {};
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Dashboard</h1>
          <p className="text-sm text-ink-muted mt-1">
            {leads.length} lead{leads.length === 1 ? "" : "s"} tracked
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link to="/search" className="btn-secondary">
            <IconCrosshair width="15" height="15" />
            New search
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="overflow-x-auto max-w-full">
          <SegmentedControl options={viewOptions} value={view} onChange={setView} size="sm" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-muted">Default message language</span>
            <LanguageSelector value={defaultLanguage} onChange={setDefaultLanguage} size="sm" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-ink-muted">WhatsApp app</span>
            <select
              value={defaultWhatsappApp}
              onChange={(e) => setDefaultWhatsappApp(e.target.value)}
              className="field-input !w-auto py-2 text-sm"
            >
              <option value="business">Business</option>
              <option value="standard">WhatsApp</option>
            </select>
          </div>

          <button onClick={refreshLeads} className="btn-ghost" disabled={leadsLoading}>
            <IconRefresh className={leadsLoading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      <BulkActionsBar view={view} leads={visibleLeads} language={defaultLanguage} />

      <LeadsTable
        leads={visibleLeads}
        loading={leadsLoading}
        defaultLanguage={defaultLanguage}
        defaultWhatsappApp={defaultWhatsappApp}
        recentlyAddedIds={recentlyAddedIds}
        emptyTitle={emptyStateFor(view).title}
        emptyDescription={emptyStateFor(view).description}
      />
    </div>
  );
}
