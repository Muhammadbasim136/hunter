import { Link } from "react-router-dom";
import LeadRow from "./LeadRow";
import EmptyState from "../ui/EmptyState";
import Spinner from "../ui/Spinner";
import { IconInbox } from "../ui/Icons";

export default function LeadsTable({
  leads,
  loading,
  defaultLanguage,
  defaultWhatsappApp,
  recentlyAddedIds,
  emptyTitle,
  emptyDescription,
}) {
  if (loading && leads.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-ink-muted">
        <Spinner className="w-5 h-5" />
      </div>
    );
  }

  if (!loading && leads.length === 0) {
    return (
      <EmptyState
        icon={<IconInbox />}
        title={emptyTitle || "No leads yet"}
        description={emptyDescription || "Run a search to start tracking down leads in a city and niche."}
        action={
          !emptyTitle && (
            <Link to="/search" className="btn-primary">
              Start a search
            </Link>
          )
        }
      />
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="hidden sm:grid leads-row-grid px-4 sm:px-6 py-2.5 border-b border-hairline bg-surface-raised/40">
        {["Name", "Phone", "Email", "City", "Status", "Channel", ""].map((h) => (
          <span key={h} className="text-[11px] font-medium uppercase tracking-wide text-ink-faint">
            {h}
          </span>
        ))}
      </div>

      <div>
        {leads.map((lead) => (
          <LeadRow
            key={lead._id || lead.id}
            lead={lead}
            defaultLanguage={defaultLanguage}
            defaultWhatsappApp={defaultWhatsappApp}
            highlight={recentlyAddedIds.has(lead._id || lead.id)}
          />
        ))}
      </div>
    </div>
  );
}
