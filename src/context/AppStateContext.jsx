import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../lib/api";
import { getSocket } from "../lib/socket";
import { useAuth } from "./AuthContext";

const AppStateContext = createContext(null);
const EMAIL_HINT_KEY = "hunterlite_email_hint";
const WHATSAPP_APP_KEY = "hunterlite_whatsapp_app";

export function AppStateProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [defaultLanguage, setDefaultLanguage] = useState("roman_urdu");
  const [defaultWhatsappApp, setDefaultWhatsappAppState] = useState(
    () => localStorage.getItem(WHATSAPP_APP_KEY) || "business"
  );
  const [email, setEmail] = useState(() => {
    const saved = localStorage.getItem(EMAIL_HINT_KEY);
    return { connected: !!saved, address: saved || null };
  });

  const [leads, setLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [recentlyAddedIds, setRecentlyAddedIds] = useState(() => new Set());
  const [searchProgress, setSearchProgress] = useState(null);
  const highlightTimers = useRef({});

  const setDefaultWhatsappApp = useCallback((app) => {
    const next = app === "standard" ? "standard" : "business";
    setDefaultWhatsappAppState(next);
    localStorage.setItem(WHATSAPP_APP_KEY, next);
  }, []);

  const markRecentlyAdded = useCallback((id) => {
    setRecentlyAddedIds((prev) => new Set(prev).add(id));
    clearTimeout(highlightTimers.current[id]);
    highlightTimers.current[id] = setTimeout(() => {
      setRecentlyAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 1800);
  }, []);

  const refreshLeads = useCallback(async () => {
    setLeadsLoading(true);
    try {
      const { data } = await api.get("/leads");
      setLeads(Array.isArray(data) ? data : data.leads || []);
      if (data.defaultLanguage) setDefaultLanguage(data.defaultLanguage);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't load leads."));
    } finally {
      setLeadsLoading(false);
    }
  }, []);

  const bulkGenerateMessages = useCallback(async ({ leadIds, language, provider }) => {
    const { data } = await api.post("/leads/bulk/message", { leadIds, language, provider });
    return data;
  }, []);

  const bulkSendLeads = useCallback(async ({ leadIds, channel, language }) => {
    const { data } = await api.post("/leads/bulk/send", { leadIds, channel, language });
    return data;
  }, []);

  const bulkUpdateLeadStatus = useCallback(async ({ leadIds, status, channel }) => {
    const { data } = await api.patch("/leads/bulk/status", { leadIds, status, channel });
    if (Array.isArray(data?.leads)) {
      setLeads((prev) => {
        const updates = new Map(data.leads.map((lead) => [lead._id || lead.id, lead]));
        return prev.map((lead) => updates.get(lead._id || lead.id) || lead);
      });
    }
    return data;
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const socket = getSocket();
    if (!socket) return;

    const onLeadNew = (lead) => {
      const newId = lead._id || lead.id;
      setLeads((prev) => [lead, ...prev.filter((l) => (l._id || l.id) !== newId)]);
      markRecentlyAdded(newId);
    };

    const onLeadUpdated = (lead) => {
      const id = lead._id || lead.id;
      setLeads((prev) => prev.map((l) => ((l._id || l.id) === id ? { ...l, ...lead } : l)));
    };

    const onLeadDeleted = ({ id } = {}) => {
      if (!id) return;
      setLeads((prev) => prev.filter((l) => (l._id || l.id) !== id));
    };

    const onLeadsDeleted = ({ ids } = {}) => {
      if (!Array.isArray(ids) || ids.length === 0) return;
      const deletedIds = new Set(ids);
      setLeads((prev) => prev.filter((l) => !deletedIds.has(l._id || l.id)));
    };

    const onRunProgress = (payload) => {
      setSearchProgress({ found: payload.quantityFound, requested: payload.quantityRequested });
    };

    const onConnectError = () => {
      toast.error("Live updates disconnected. Retrying...");
    };

    socket.on("lead:new", onLeadNew);
    socket.on("lead:updated", onLeadUpdated);
    socket.on("lead:deleted", onLeadDeleted);
    socket.on("leads:deleted", onLeadsDeleted);
    socket.on("run:progress", onRunProgress);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("lead:new", onLeadNew);
      socket.off("lead:updated", onLeadUpdated);
      socket.off("lead:deleted", onLeadDeleted);
      socket.off("leads:deleted", onLeadsDeleted);
      socket.off("run:progress", onRunProgress);
      socket.off("connect_error", onConnectError);
    };
  }, [isAuthenticated, markRecentlyAdded]);

  useEffect(() => {
    if (isAuthenticated) refreshLeads();
  }, [isAuthenticated, refreshLeads]);

  const connectEmail = useCallback(async ({ email: addr, appPassword }) => {
    await api.post("/session/email", { email: addr, appPassword });
    setEmail({ connected: true, address: addr });
    localStorage.setItem(EMAIL_HINT_KEY, addr);
  }, []);

  const generateMessage = useCallback(async (leadId, language) => {
    const { data } = await api.post(`/leads/${leadId}/message`, { language });
    if (data?.lead) {
      const id = data.lead.id || data.lead._id;
      setLeads((prev) => prev.map((l) => ((l._id || l.id) === id ? { ...l, ...data.lead } : l)));
    }
    return data;
  }, []);

  const sendLead = useCallback(async (leadId, channel, language) => {
    const { data } = await api.post(`/leads/${leadId}/send`, { channel, language });
    if (data?.lead) {
      const id = data.lead.id || data.lead._id;
      setLeads((prev) => prev.map((l) => ((l._id || l.id) === id ? { ...l, ...data.lead } : l)));
    }
    return data;
  }, []);

  const updateLeadStatus = useCallback(async (leadId, status, channel) => {
    const { data } = await api.patch(`/leads/${leadId}/status`, { status, channel });
    if (data?.lead) {
      const id = data.lead.id || data.lead._id;
      setLeads((prev) => prev.map((l) => ((l._id || l.id) === id ? { ...l, ...data.lead } : l)));
    }
    return data;
  }, []);

  const deleteLead = useCallback(async (leadId) => {
    await api.delete(`/leads/${leadId}`);
    setLeads((prev) => prev.filter((l) => (l._id || l.id) !== leadId));
  }, []);

  const deleteLeads = useCallback(async (leadIds) => {
    const ids = Array.isArray(leadIds) ? leadIds.filter(Boolean) : [];
    if (ids.length === 0) return { deleted: 0, ids: [] };
    const { data } = await api.delete("/leads", { data: { leadIds: ids } });
    const deletedIds = new Set(data?.ids || ids);
    setLeads((prev) => prev.filter((l) => !deletedIds.has(l._id || l.id)));
    return data;
  }, []);

  const runSearch = useCallback(async ({ city, country, niche, quantity }) => {
    setSearchProgress({ found: 0, requested: Number(quantity) || 0 });
    const { data } = await api.post("/leads/search", { city, country, niche, quantity });
    return data;
  }, []);

  const value = {
    email,
    defaultLanguage,
    setDefaultLanguage,
    defaultWhatsappApp,
    setDefaultWhatsappApp,
    leads,
    leadsLoading,
    recentlyAddedIds,
    searchProgress,
    setSearchProgress,
    refreshLeads,
    connectEmail,
    generateMessage,
    sendLead,
    deleteLead,
    deleteLeads,
    bulkGenerateMessages,
    bulkSendLeads,
    bulkUpdateLeadStatus,
    runSearch,
    updateLeadStatus,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
