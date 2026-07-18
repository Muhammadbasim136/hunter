import { useState } from "react";
import toast from "react-hot-toast";
import { IconWand, IconSend, IconTrash, IconCheck } from "../ui/Icons";
import Spinner from "../ui/Spinner";
import { useAppState } from "../../context/AppStateContext";
import { getErrorMessage } from "../../lib/api";

export default function BulkActionsBar({ view, leads, language }) {
  const { bulkGenerateMessages, bulkSendLeads, bulkUpdateLeadStatus, deleteLeads, refreshLeads } = useAppState();
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [marking, setMarking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (leads.length === 0) return null;

  const withoutMessage = leads.filter((l) => !l.generatedMessage);
  const emailReady = leads.filter((l) => l.email && (l.generatedMessage || view === "failed"));
  const showGenerate = view === "new" || view === "failed";
  const showEmailSend = view === "new" || view === "failed";
  const idOf = (l) => l._id || l.id;
  const notSent = leads.filter((l) => l.status !== "sent");

  const handleGenerateAll = async () => {
    setGenerating(true);
    try {
      const data = await bulkGenerateMessages({
        leadIds: withoutMessage.map(idOf),
        language,
      });
      if (data.total === 0) {
        toast("Nothing to generate - every lead here already has a message.");
      } else {
        toast.success(`Generated ${data.succeeded}/${data.total} messages${data.failed ? `, ${data.failed} failed` : ""}`);
      }
      await refreshLeads();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't generate messages."));
    } finally {
      setGenerating(false);
    }
  };

  const handleSendAllEmail = async () => {
    setSending(true);
    try {
      const targets = view === "failed" ? leads.filter((l) => l.email) : emailReady;
      const data = await bulkSendLeads({ leadIds: targets.map(idOf), channel: "email", language });
      const failed = data.results?.filter((r) => !r.success).length || 0;
      const parts = [];
      if (data.emailSent) parts.push(`${data.emailSent} emailed`);
      if (data.emailFailed) parts.push(`${data.emailFailed} email failed`);
      if (data.generateFailed) parts.push(`${data.generateFailed} failed to generate`);
      if (failed) parts.push(`${failed} send errors`);
      if (parts.length) toast.success(parts.join(" - "));
      else toast("Nothing to send by email.");
      await refreshLeads();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't send those messages."));
    } finally {
      setSending(false);
    }
  };

  const handleDeleteAll = async () => {
    const label = view === "all" ? "all leads" : `all ${view} leads`;
    if (!window.confirm(`Delete ${label} (${leads.length})? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      const data = await deleteLeads(leads.map(idOf));
      toast.success(`Deleted ${data?.deleted ?? leads.length} lead${leads.length === 1 ? "" : "s"}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't delete those leads."));
    } finally {
      setDeleting(false);
    }
  };

  const handleMarkAllSent = async () => {
    setMarking(true);
    try {
      const data = await bulkUpdateLeadStatus({
        leadIds: notSent.map(idOf),
        status: "sent",
        channel: "whatsapp",
      });
      toast.success(`Marked ${data?.updated ?? notSent.length} lead${notSent.length === 1 ? "" : "s"} as sent`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't mark those leads as sent."));
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-3 rounded-lg border border-hairline bg-surface-raised/50 px-3 py-2.5">
      <span className="text-xs text-ink-muted mr-1">
        {view === "all" ? "All leads" : `${view[0].toUpperCase()}${view.slice(1)} leads`}
      </span>

      {showGenerate && (
        <button onClick={handleGenerateAll} disabled={generating || withoutMessage.length === 0} className="btn-secondary">
          {generating ? <Spinner /> : <IconWand />}
          Generate all ({withoutMessage.length})
        </button>
      )}

      {showEmailSend && (
        <button
          onClick={handleSendAllEmail}
          disabled={sending || emailReady.length === 0}
          className="btn-secondary"
        >
          {sending ? <Spinner /> : <IconSend />}
          Send email all ({emailReady.length})
        </button>
      )}

      <button onClick={handleMarkAllSent} disabled={marking || notSent.length === 0} className="btn-secondary">
        {marking ? <Spinner /> : <IconCheck />}
        Mark all sent ({notSent.length})
      </button>

      <button onClick={handleDeleteAll} disabled={deleting} className="btn-danger">
        {deleting ? <Spinner /> : <IconTrash />}
        Delete all ({leads.length})
      </button>
    </div>
  );
}
