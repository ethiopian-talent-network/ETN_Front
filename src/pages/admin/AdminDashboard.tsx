import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useDarkMode } from "../../contexts/DarkModeContext";
import {
  getAdminDashboard, getAdminUsers,
  createOwner, toggleUser, deleteUser,
} from "../../api/admin/adminApi";
import {
  Users, Briefcase, DollarSign, ShieldCheck, Plus, Search,
  RefreshCw, Loader2, AlertCircle, CheckCircle, XCircle,
  ToggleLeft, ToggleRight, Trash2, Sun, Moon, TrendingUp,
  UserPlus, Building2, Crown, FileText, ChevronLeft, ChevronRight,
} from "lucide-react";

function useInternalAuth() {
  const token = localStorage.getItem("internal_token") || "";
  const user = JSON.parse(localStorage.getItem("internal_user") || "null");
  return { token, user };
}

type ModalType = "owner" | null;

const ROLE_BADGE: Record<string, string> = {
  talent:   "bg-blue-50 text-blue-700 border-blue-200",
  employer: "bg-violet-50 text-violet-700 border-violet-200",
  admin:    "bg-amber-50 text-amber-700 border-amber-200",
  owner:    "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function AdminDashboard() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const { token, user } = useInternalAuth();
  const dm = darkMode;

  const [tab, setTab] = useState<"overview" | "users">("overview");
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [modal, setModal] = useState<ModalType>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!token || user?.role !== "admin") navigate("/admin/login");
  }, [token, user]);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminDashboard(token);
      setStats(res.stats);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [token]);

  const loadUsers = useCallback(async (page = 1) => {
    try {
      const res = await getAdminUsers(token, {
        page, limit: 15,
        ...(roleFilter !== "all" ? { role: roleFilter } : {}),
        ...(search ? { search } : {}),
      });
      setUsers(res.users || []);
      setPagination(res.pagination || { page: 1, pages: 1, total: 0 });
    } catch (e: any) { setError(e.message); }
  }, [token, roleFilter, search]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { if (tab === "users") loadUsers(1); }, [tab, loadUsers]);

  const handleToggle = async (id: number) => {
    setActionId(id);
    const res = await toggleUser(token, id);
    setActionId(null);
    if (res.message) { setSuccess(res.message); loadUsers(pagination.page); }
    else setError(res.message);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setActionId(id);
    const res = await deleteUser(token, id);
    setActionId(null);
    if (res.message) { setSuccess(res.message); loadUsers(pagination.page); loadStats(); }
    else setError(res.message);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError(null);
    try {
      const res = await createOwner(token, form);
      if (res.message && !res.message.toLowerCase().includes("error")) {
        setSuccess(res.message);
        setModal(null);
        setForm({});
        loadStats();
        if (tab === "users") loadUsers(1);
      } else {
        setError(res.message);
      }
    } catch (e: any) { setError(e.message); }
    finally { setFormLoading(false); }
  };

  const logout = () => {
    localStorage.removeItem("internal_token");
    localStorage.removeItem("internal_user");
    navigate("/admin/login");
  };

  const bg = dm ? "bg-gray-950" : "bg-slate-100";
  const card = dm ? "bg-gray-900 border-gray-800" : "bg-white border-slate-200";
  const text = dm ? "text-white" : "text-gray-900";
  const muted = dm ? "text-gray-400" : "text-gray-500";
  const inputCls = dm ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-white border-slate-300 text-gray-900 placeholder-gray-400";
  const thCls = `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${dm ? "text-gray-400" : "text-gray-500"}`;
  const tdCls = `px-4 py-3.5 text-sm ${dm ? "text-gray-300" : "text-gray-700"}`;

  const STAT_CARDS = stats ? [
    { label: "Total Talents",    value: stats.total_talents,      icon: Users,      color: "text-blue-600",    bg: dm ? "bg-blue-900/20" : "bg-blue-50" },
    { label: "Total Employers",  value: stats.total_employers,    icon: Building2,  color: "text-violet-600",  bg: dm ? "bg-violet-900/20" : "bg-violet-50" },
    { label: "Platform Owners",  value: stats.total_owners,       icon: Crown,      color: "text-amber-600",   bg: dm ? "bg-amber-900/20" : "bg-amber-50" },
    { label: "Active Jobs",      value: stats.active_jobs,        icon: Briefcase,  color: "text-[#0084ca]",   bg: dm ? "bg-[#0084ca]/10" : "bg-[#0084ca]/5" },
    { label: "Applications",     value: stats.total_applications, icon: FileText,   color: "text-emerald-600", bg: dm ? "bg-emerald-900/20" : "bg-emerald-50" },
    { label: "Total Revenue",    value: `${Number(stats.total_revenue).toLocaleString()} ETB`, icon: TrendingUp, color: "text-emerald-600", bg: dm ? "bg-emerald-900/20" : "bg-emerald-50" },
    { label: "Paid Transactions",value: stats.total_payments,     icon: DollarSign, color: "text-emerald-600", bg: dm ? "bg-emerald-900/20" : "bg-emerald-50" },
    { label: "Pending Payments", value: stats.pending_payments,   icon: AlertCircle,color: "text-amber-600",   bg: dm ? "bg-amber-900/20" : "bg-amber-50" },
  ] : [];

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b ${dm ? "bg-gray-900 border-gray-800" : "bg-white border-slate-200"} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className={`text-base font-bold ${text}`}>ETN Admin</span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${dm ? "bg-amber-900/40 text-amber-300" : "bg-amber-100 text-amber-700"}`}>
                {user?.name || "Admin"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/owner")}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dm ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-slate-100 text-gray-600 hover:bg-slate-200"}`}
            >
              <Crown className="w-3.5 h-3.5" /> Owner Panel
            </button>
            <button onClick={toggleDarkMode} className={`p-2 rounded-lg transition-colors ${dm ? "hover:bg-gray-800 text-gray-400" : "hover:bg-slate-100 text-gray-500"}`}>
              {dm ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={logout} className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerts */}
        {error && (
          <div className="mb-5 flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm flex-1">{error}</p>
            <button onClick={() => setError(null)}><XCircle className="w-4 h-4" /></button>
          </div>
        )}
        {success && (
          <div className="mb-5 flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm flex-1">{success}</p>
            <button onClick={() => setSuccess(null)}><XCircle className="w-4 h-4" /></button>
          </div>
        )}

        {/* Tabs + actions */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className={`flex items-center gap-1 p-1 rounded-xl ${dm ? "bg-gray-800" : "bg-slate-200"}`}>
            {(["overview", "users"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  tab === t ? "bg-white shadow-sm text-amber-600 dark:bg-gray-700" : dm ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"
                }`}
              >{t}</button>
            ))}
          </div>

          <button
            onClick={() => { setModal("owner"); setForm({}); setError(null); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <Crown className="w-4 h-4" /> Create Owner
          </button>
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <>
            <div className="flex items-center justify-between mb-5">
              <h1 className={`text-xl font-bold ${text}`}>Platform Overview</h1>
              <button onClick={loadStats} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${dm ? "hover:bg-gray-800 text-gray-400" : "hover:bg-slate-200 text-gray-500"}`}>
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {STAT_CARDS.map(({ label, value, icon: Icon, color, bg: ibg }) => (
                  <div key={label} className={`rounded-xl border p-5 ${card}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${muted}`}>{label}</p>
                        <p className={`text-2xl font-bold ${text}`}>{value}</p>
                      </div>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ibg}`}>
                        <Icon className={`w-5 h-5 ${color}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── USERS ── */}
        {tab === "users" && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <h1 className={`text-xl font-bold ${text}`}>User Management</h1>
              <div className="flex gap-2 flex-wrap">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${dm ? "bg-gray-800 border-gray-700" : "bg-white border-slate-300"}`}>
                  <Search className={`w-4 h-4 ${muted}`} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadUsers(1)}
                    placeholder="Search..."
                    className={`bg-transparent outline-none w-32 text-sm ${dm ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
                  />
                </div>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
                  className={`px-3 py-2 rounded-lg border text-sm outline-none ${inputCls}`}>
                  <option value="all">All Roles</option>
                  <option value="talent">Talent</option>
                  <option value="employer">Employer</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
                <button onClick={() => loadUsers(1)} className="px-3 py-2 rounded-lg bg-amber-500 text-white text-sm hover:bg-amber-600 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className={`rounded-xl border overflow-hidden ${card}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${dm ? "border-gray-800 bg-gray-900/60" : "border-slate-200 bg-slate-50"}`}>
                      <th className={thCls}>Name</th>
                      <th className={thCls}>Email</th>
                      <th className={thCls}>Role</th>
                      <th className={thCls}>Status</th>
                      <th className={thCls}>Joined</th>
                      <th className={thCls}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${dm ? "divide-gray-800" : "divide-slate-100"}`}>
                    {users.length === 0 ? (
                      <tr><td colSpan={6} className={`text-center py-12 text-sm ${muted}`}>No users found</td></tr>
                    ) : users.map((u) => (
                      <tr key={u.id} className={`transition-colors ${dm ? "hover:bg-gray-800/50" : "hover:bg-slate-50"}`}>
                        <td className={tdCls}><p className="font-medium">{u.name}</p></td>
                        <td className={`${tdCls} ${muted}`}>{u.email}</td>
                        <td className={tdCls}>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${ROLE_BADGE[u.role] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className={tdCls}>
                          <span className={`inline-flex items-center gap-1 text-xs font-medium ${u.is_verified ? "text-emerald-600" : "text-red-500"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.is_verified ? "bg-emerald-500" : "bg-red-400"}`} />
                            {u.is_verified ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className={`${tdCls} whitespace-nowrap`}>
                          {new Date(u.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className={tdCls}>
                          {!["admin", "owner"].includes(u.role) && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleToggle(u.id)}
                                disabled={actionId === u.id}
                                title={u.is_verified ? "Deactivate" : "Activate"}
                                className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${u.is_verified ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"}`}
                              >
                                {actionId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : u.is_verified ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => handleDelete(u.id, u.name)}
                                disabled={actionId === u.id}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.pages > 1 && (
                <div className={`flex items-center justify-between px-4 py-3 border-t text-sm ${dm ? "border-gray-800 text-gray-400" : "border-slate-200 text-gray-500"}`}>
                  <span>{pagination.total} total users</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => loadUsers(pagination.page - 1)} disabled={pagination.page === 1}
                      className={`p-1.5 rounded-lg disabled:opacity-40 ${dm ? "hover:bg-gray-800" : "hover:bg-slate-100"}`}>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span>Page {pagination.page} of {pagination.pages}</span>
                    <button onClick={() => loadUsers(pagination.page + 1)} disabled={pagination.page === pagination.pages}
                      className={`p-1.5 rounded-lg disabled:opacity-40 ${dm ? "hover:bg-gray-800" : "hover:bg-slate-100"}`}>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl ${dm ? "bg-gray-900 border-gray-800" : "bg-white border-slate-200"}`}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${dm ? "border-gray-800" : "border-slate-200"}`}>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-500" />
                <h2 className={`font-semibold ${text}`}>Create Owner Account</h2>
              </div>
              <button onClick={() => { setModal(null); setError(null); }} className={`p-1.5 rounded-lg ${dm ? "hover:bg-gray-800 text-gray-400" : "hover:bg-slate-100 text-gray-500"}`}>
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
              )}

              {[
                { key: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
                { key: "email", label: "Email Address", type: "email", placeholder: "john@company.com" },
                { key: "password", label: "Password", type: "password", placeholder: "Min 8 characters" },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className={`block text-sm font-medium mb-1.5 ${dm ? "text-gray-300" : "text-gray-700"}`}>{label}</label>
                  <input
                    type={type}
                    value={form[key] || ""}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    required={key !== "location"}
                    placeholder={placeholder}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#0084ca]/20 transition-colors ${inputCls}`}
                  />
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => { setModal(null); setError(null); }}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${dm ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-slate-300 text-gray-600 hover:bg-slate-50"}`}>
                  Cancel
                </button>
                <button type="submit" disabled={formLoading}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors disabled:opacity-50">
                  {formLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : "Create Owner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
