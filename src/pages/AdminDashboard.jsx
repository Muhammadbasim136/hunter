import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../lib/api";
import Spinner from "../components/ui/Spinner";
import { IconRefresh, IconTrash, IconUsers, IconCheck, IconAlertTriangle } from "../components/ui/Icons";

function StatusPill({ status }) {
  const tone =
    status === "approved"
      ? "text-signal-bright border-signal-dim bg-signal/10"
      : status === "blocked" || status === "rejected"
        ? "text-alert-bright border-alert-dim bg-alert/10"
        : "text-brass-bright border-brass-dim bg-brass/10";

  return <span className={`inline-flex rounded-md border px-2 py-1 text-xs font-medium ${tone}`}>{status}</span>;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const pendingUsers = useMemo(() => users.filter((user) => user.approvalStatus === "pending"), [users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data.users || []);
      setStats(data.stats || null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't load admin users."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const setStatus = async (userId, status) => {
    setBusyId(userId);
    try {
      const { data } = await api.patch(`/admin/users/${userId}/status`, { status });
      setUsers((prev) => prev.map((user) => (user.id === userId ? data.user : user)));
      toast.success(`User ${status}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't update that user."));
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = async (user) => {
    if (!window.confirm(`Delete ${user.email} and all their leads? This cannot be undone.`)) return;
    setBusyId(user.id);
    try {
      const { data } = await api.delete(`/admin/users/${user.id}`);
      setUsers((prev) => prev.filter((item) => item.id !== user.id));
      toast.success(`Deleted user and ${data.deletedLeads || 0} leads`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't delete that user."));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="px-4 sm:px-6 py-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Admin</h1>
          <p className="text-sm text-ink-muted mt-1">Approve users, block access, and remove accounts.</p>
        </div>
        <button onClick={loadUsers} disabled={loading} className="btn-secondary">
          {loading ? <Spinner /> : <IconRefresh />}
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
        {[
          ["Total", stats?.total ?? users.length],
          ["Pending", stats?.pending ?? pendingUsers.length],
          ["Approved", stats?.approved ?? 0],
          ["Blocked", stats?.blocked ?? 0],
          ["Rejected", stats?.rejected ?? 0],
        ].map(([label, value]) => (
          <div key={label} className="card p-4">
            <p className="text-xs uppercase text-ink-faint font-medium">{label}</p>
            <p className="text-2xl font-display font-semibold text-ink mt-1">{value}</p>
          </div>
        ))}
      </div>

      {loading && users.length === 0 ? (
        <div className="flex justify-center py-16 text-ink-muted">
          <Spinner className="w-5 h-5" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="hidden md:grid grid-cols-[1.8fr_0.9fr_0.8fr_0.8fr_1.5fr] gap-3 px-5 py-2.5 border-b border-hairline bg-surface-raised/40">
            {["User", "Status", "Role", "Leads", "Actions"].map((head) => (
              <span key={head} className="text-[11px] font-medium uppercase text-ink-faint">
                {head}
              </span>
            ))}
          </div>

          {users.map((user) => {
            const busy = busyId === user.id;
            return (
              <div key={user.id} className="grid grid-cols-1 md:grid-cols-[1.8fr_0.9fr_0.8fr_0.8fr_1.5fr] gap-3 px-4 sm:px-5 py-4 border-b border-hairline last:border-b-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <IconUsers className="text-ink-faint shrink-0" />
                    <p className="text-sm font-medium text-ink truncate">{user.email}</p>
                  </div>
                  <p className="text-xs text-ink-faint mt-1">Joined {user.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}</p>
                </div>

                <div className="flex md:block items-center gap-2">
                  <span className="md:hidden text-xs text-ink-faint">Status</span>
                  <StatusPill status={user.approvalStatus} />
                </div>

                <div className="flex md:block items-center gap-2">
                  <span className="md:hidden text-xs text-ink-faint">Role</span>
                  <span className="inline-flex rounded-md border border-hairline bg-surface-raised px-2 py-1 text-xs font-mono text-ink-muted">{user.role}</span>
                </div>

                <div className="flex md:block items-center gap-2 text-sm text-ink-muted">
                  <span className="md:hidden text-xs text-ink-faint">Leads</span>
                  {user.leadCount || 0}
                </div>

                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setStatus(user.id, "approved")} disabled={busy || user.approvalStatus === "approved"} className="btn-secondary !px-3 !py-2">
                    {busy ? <Spinner /> : <IconCheck />}
                    Approve
                  </button>
                  <button onClick={() => setStatus(user.id, user.approvalStatus === "blocked" ? "approved" : "blocked")} disabled={busy || user.role === "admin"} className="btn-secondary !px-3 !py-2">
                    <IconAlertTriangle />
                    {user.approvalStatus === "blocked" ? "Unblock" : "Block"}
                  </button>
                  <button onClick={() => setStatus(user.id, "rejected")} disabled={busy || user.role === "admin"} className="btn-danger !px-3 !py-2">
                    Reject
                  </button>
                  <button onClick={() => deleteUser(user)} disabled={busy || user.role === "admin"} className="btn-danger !px-3 !py-2">
                    <IconTrash />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
