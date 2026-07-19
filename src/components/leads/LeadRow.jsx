import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { StatusBadge, ChannelBadge } from "../ui/Badge";
import LanguageSelector from "./LanguageSelector";
import Spinner from "../ui/Spinner";
import { IconChevronDown, IconWand, IconSend, IconTrash, IconCheck, IconRefresh } from "../ui/Icons";
import { useAppState } from "../../context/AppStateContext";
import { getErrorMessage } from "../../lib/api";
import { buildWhatsAppUrls, openWhatsAppChat, supportsWhatsAppAppChoice } from "../../lib/whatsappLinks";

const SEND_CHANNELS = {
  whatsapp: [{ value: "whatsapp", label: "WhatsApp" }],
  email: [{ value: "email", label: "Email" }],
  both: [
    { value: "whatsapp", label: "WhatsApp" },
    { value: "email", label: "Email" },
  ],
};

export default function LeadRow({ lead, defaultLanguage, defaultWhatsappApp = "business", highlight }) {
  const id = lead._id || lead.id;
  const { generateMessage, sendLead, deleteLead, updateLeadStatus } = useAppState();

  const [expanded, setExpanded] = useState(false);
  const [language, setLanguage] = useState(lead.messageLanguage || defaultLanguage);
  const [message, setMessage] = useState(lead.generatedMessage || "");
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [whatsappApp, setWhatsappApp] = useState(defaultWhatsappApp || "business");
  const [sendChannel, setSendChannel] = useState(
    lead.channel === "both" ? "whatsapp" : lead.channel || "whatsapp"
  );

  useEffect(() => {
    if (lead.generatedMessage) setMessage(lead.generatedMessage);
    if (lead.messageLanguage) setLanguage(lead.messageLanguage);
  }, [lead.generatedMessage, lead.messageLanguage]);

  useEffect(() => {
    setWhatsappApp(defaultWhatsappApp || "business");
  }, [defaultWhatsappApp]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await generateMessage(id, language);
      setMessage(data?.lead?.generatedMessage || "");
      setExpanded(true);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't generate a message."));
    } finally {
      setGenerating(false);
    }
  };

  const handleSend = async () => {
    setSending(true);
    try {
      if (sendChannel === "whatsapp") {
        let outgoingMessage = message;
        if (!outgoingMessage) {
          const data = await generateMessage(id, language);
          outgoingMessage = data?.lead?.generatedMessage || "";
          setMessage(outgoingMessage);
          toast.success("Message generated. Tap Send again to open WhatsApp.");
          return;
        }

        const whatsappOptions = {
          phone: lead.phone,
          country: lead.country,
          text: outgoingMessage,
          app: whatsappApp,
        };

        if (buildWhatsAppUrls(whatsappOptions).length === 0) {
          toast.error("This lead has no usable WhatsApp number.");
          return;
        }

        const statusUpdate = updateLeadStatus(id, "sent", "whatsapp");
        openWhatsAppChat(whatsappOptions);
        await statusUpdate;
        toast.success(`Marked sent. Opening WhatsApp for ${lead.name || "lead"}.`);
        return;
      }

      const data = await sendLead(id, sendChannel, language);
      if (data?.errors?.length) {
        toast.error(data.errors.join(" - "));
      } else {
        toast.success(`Sent to ${lead.name || "lead"}`);
        if (data?.lead?.status === "sent") setExpanded(false);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't send that message."));
    } finally {
      setSending(false);
    }
  };

  const handleManualStatus = async (status) => {
    setSending(true);
    try {
      await updateLeadStatus(id, status, lead.channel || "whatsapp");
      toast.success(status === "sent" ? "Lead marked as sent" : "Lead moved back to new");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't update lead status."));
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    const label = lead.name || lead.phone || "this lead";
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;

    setDeleting(true);
    try {
      await deleteLead(id);
      toast.success("Lead deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't delete that lead."));
    } finally {
      setDeleting(false);
    }
  };


  const handleCopy = async (text, label) => {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  } catch {
    toast.error("Copy failed");
  }
};

  const canSend = lead.actions?.canSend !== false && lead.status !== "sent";
  const canGenerate = lead.actions?.canGenerate !== false;
  const messageLanguage = lead.messageLanguage || defaultLanguage;
  const shouldShowGenerate = !message || language !== messageLanguage;
  const sendDisabled =
    sending ||
    !canSend ||
    (sendChannel === "whatsapp" ? (!lead.phone || (!message && !canGenerate)) : !message);

  return (
    <div
      className={`border-b border-hairline last:border-b-0 transition-colors ${
        highlight ? "animate-highlight-pulse" : ""
      }`}
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full leads-row-grid px-4 sm:px-6 py-3 text-left hover:bg-surface-raised/50 transition-colors"
      >
        <span className="text-sm text-ink font-medium truncate">{lead.name || "-"}</span>
        <span className="text-sm font-mono text-ink-muted truncate">{lead.phone || "-"}</span>
        <span className="text-sm font-mono text-ink-muted truncate hidden sm:block">
          {lead.email || "-"}
        </span>
        <span className="text-sm text-ink-muted truncate hidden md:block">{lead.city || "-"}</span>
        <span className="hidden sm:block">
          <StatusBadge status={lead.status || "pending"} />
        </span>
        <span className="hidden md:block">
          <ChannelBadge channel={lead.channel || "whatsapp"} />
        </span>
        <IconChevronDown
          className={`text-ink-faint transition-transform shrink-0 ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      <div className="flex sm:hidden items-center gap-2 px-4 pb-2 -mt-1">
        <StatusBadge status={lead.status || "pending"} />
        <ChannelBadge channel={lead.channel || "whatsapp"} />
      </div>

      {expanded && (
        <div className="px-4 sm:px-6 pb-4 pt-1 bg-surface-raised/30 animate-fade-in">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="text-xs text-ink-muted mr-1">Language</span>
            <LanguageSelector value={language} onChange={setLanguage} size="sm" />
          </div>

          <div className="flex items-center gap-2 mb-3">
      <button
        onClick={() => handleCopy(lead.phone, "Number")}
        disabled={!lead.phone}
        className="btn-secondary !py-1 !px-2 text-xs"
        title="Copy number"
      >
        📋 {lead.phone || "No number"}
      </button>
    </div>

     {message ? (
      <div className="relative mb-3">
      <p className="text-sm text-ink bg-surface border border-hairline rounded-md p-3 pr-10 whitespace-pre-wrap font-body leading-relaxed">
        {message}
      </p>
        <button
         onClick={() => handleCopy(message, "Message")}
         className="absolute top-2 right-2 text-ink-faint hover:text-ink p-1"
         title="Copy message"
         >
         📋
       </button>
    </div>
         ) : (
            <p className="text-sm text-ink-faint italic mb-3">No message generated yet.</p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {shouldShowGenerate && (
              <button onClick={handleGenerate} disabled={generating || !canGenerate} className="btn-secondary">
                {generating ? <Spinner /> : <IconWand />}
                {message ? "Update message" : "Generate message"}
              </button>
            )}

            {SEND_CHANNELS[lead.channel || "whatsapp"]?.length > 1 && (
              <select
                value={sendChannel}
                onChange={(e) => setSendChannel(e.target.value)}
                className="field-input !w-auto py-2 text-sm"
              >
                {SEND_CHANNELS[lead.channel || "whatsapp"].map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            )}

            {sendChannel === "whatsapp" && supportsWhatsAppAppChoice() && (
              <select
                value={whatsappApp}
                onChange={(e) => setWhatsappApp(e.target.value)}
                className="field-input !w-auto py-2 text-sm"
              >
                <option value="business">WhatsApp Business</option>
                <option value="standard">WhatsApp</option>
              </select>
            )}

            <button onClick={handleSend} disabled={sendDisabled} className="btn-primary">
              {sending ? <Spinner /> : <IconSend />}
              Send
            </button>

            {lead.status === "sent" ? (
              <button onClick={() => handleManualStatus("pending")} disabled={sending} className="btn-secondary">
                <IconRefresh />
                Mark unsent
              </button>
            ) : (
              <button onClick={() => handleManualStatus("sent")} disabled={sending} className="btn-secondary">
                <IconCheck />
                Mark sent
              </button>
            )}

            <button onClick={handleDelete} disabled={deleting} className="btn-danger">
              {deleting ? <Spinner /> : <IconTrash />}
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
