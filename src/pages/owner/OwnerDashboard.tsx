import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useDarkMode } from "../../contexts/DarkModeContext";
import {
  getOwnerDashboard, getOwnerPayments, getOwnerEscrow,
  verifyPaymentWithChapa, approvePayment,
} from "../../api/owner/ownerApi";
import {
  DollarSign, ShieldCheck, CheckCircle, XCircle, Clock,
  Search, RefreshCw, Loader2, AlertCircle, Lock, Unlock,
  TrendingUp, Users, Briefcase, ChevronLeft, ChevronRight,
  Sun, Moon, Shield,
} from "lucide-react";

const STATUS_BADGE: Record<string, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  failed:  "bg-red-50 text-red-700 border-red-200",
  funded:  "bg-blue-50 text-blue-700 border-blue-200",
  released: "bg-emerald-50 text-emerald-700 border-emerald-200",
  releassed:"bg-emerald-50 text-emerald-700 border-emerald-200",
};

function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${STATUS_BADGE[status] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
}

function fmt(n: number, currency = "ETB") {
  return `${Number(n).toLocaleString()} ${currency}`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function OwnerDashboard() {
  const { token, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const dm = darkMode;

  // Use internal token if available (owner logged in via internal portal)
  const internalToken = localStorage.getItem("internal_token") || "";
  const effectiveToken = internalToken || token || "";

  const [tab, setTab] = useState<"overview" | "payments" | "escrow">("overview");
  const [stats, setStats] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [escrows, setEscrows] = useState<any[]>([]);
  const [payPagination, setPayPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [escPagination, setEscPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [paySearch, setPaySearch] = useState("");
  const [payStatus, setPayStatus] = useState("all");
  const [escStatus, setEscStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [verifyingId, setVerifyingId] = useState<number | null>(null);
  const [verifiedPayments, setVerifiedPayments] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!effectiveToken) return;
    setLoading(true);
    try {
      const res = await getOwnerDashboard(effectiveToken);
      setStats(res.stats);
    } catch (e: any) { setError(e.message); }
    finally { setLoading(false); }
  }, [effectiveToken]);

  const loadPayments = useCallback(async (page = 1) => {
    if (!effectiveToken) return;
    const res = await getOwnerPayments(effectiveToken, {
      page, limit: 15,
      ...(payStatus !== "all" ? { status: payStatus } : {}),
      ...(paySearch ? { search: paySearch } : {}),
    });
    setPayments(res.payments || []);
    setPayPagination(res.pagination || { page: 1, pages: 1, total: 0 });
  }, [effectiveToken, payStatus, paySearch]);

  const loadEscrow = useCallback(async (page = 1) => {
    if (!effectiveToken) return;
    const res = await getOwnerEscrow(effectiveToken, {
      page, limit: 15,
      ...(escStatus !== "all" ? { status: escStatus } : {}),
    });
    setEscrows(res.escrows || []);
    setEscPagination(res.pagination || { page: 1, pages: 1, total: 0 });
  }, [effectiveToken, escStatus]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);
  useEffect(() => { if (tab === "payments") loadPayments(1); }, [tab, loadPayments]);
  useEffect(() => { if (tab === "escrow") loadEscrow(1); }, [tab, loadEscrow]);

  const handleVerify = async (id: number) => {
    if (!effectiveToken) return;
    setVerifyingId(id);
    setError(null);
    try {
      const res = await verifyPaymentWithChapa(effectiveToken, id);
      setVerifyingId(null);
      if (res.verified) {
        setSuccessMsg(`Payment verified with Chapa! Amount: ${res.chapa_data?.amount} ${res.chapa_data?.currency}`);
        setVerifiedPayments(prev => new Set(prev).add(id));
      } else {
        setError(res.message || "Verification failed");
      }
    } catch (e: any) {
      setVerifyingId(null);
      setError(e.message || "Failed to verify payment with Chapa");
    }
  };

  const handleApprove = async (id: number) => {
    if (!effectiveToken) return;
    
    // Check if payment is verified
    if (!verifiedPayments.has(id)) {
      setError("Please verify the payment with Chapa first before approving");
      return;
    }
    
    if (!window.confirm("Approve this payment and fund escrow?")) return;
    
    setActionId(id);
    try {
      const res = await approvePayment(effectiveToken, id);
      setActionId(null);
      if (res.message && !res.message.toLowerCase().includes("error")) {
        setSuccessMsg(res.message);
        setVerifiedPayments(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        loadPayments(payPagination.page);
        loadDashboard();
      } else {
        setError(res.message || "Failed to approve payment");
      }
    } catch (e: any) {
      setActionId(null);
      setError(e.message || "Failed to approve payment");
    }
  };

  const bg = dm ? "bg-gray-900" : "bg-slate-100";
  const card = dm ? "bg-gray-800 border-gray-700" : "bg-white border-slate-200";
  const text = dm ? "text-white" : "text-gray-900";
  const muted = dm ? "text-gray-400" : "text-gray-500";
  const inputCls = dm ? "bg-gray-700 border-gray-600 text-white placeholder-gray-500" : "bg-white border-slate-300 text-gray-900 placeholder-gray-400";
  const thCls = `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${dm ? "text-gray-400" : "text-gray-500"}`;
  const tdCls = `px-4 py-3.5 text-sm ${dm ? "text-gray-300" : "text-gray-700"}`;

  const STAT_CARDS = stats ? [
    { label: "Total Revenue",       value: fmt(stats.total_volume),          sub: `${stats.total_payments} transactions`,    icon: DollarSign,  color: "text-emerald-600", bg: dm ? "bg-emerald-900/20" : "bg-emerald-50" },
    { label: "Funds in Escrow",     value: fmt(stats.pending_escrow_volume), sub: `${stats.pending_escrow_count} active`,    icon: Lock,        color: "text-blue-600",    bg: dm ? "bg-blue-900/20"    : "bg-blue-50" },
    { label: "Released to Talents", value: fmt(stats.released_escrow_volume),sub: `${stats.released_escrow_count} payouts`,  icon: Unlock,      color: "text-violet-600",  bg: dm ? "bg-violet-900/20"  : "bg-violet-50" },
    { label: "Failed Payments",     value: stats.failed_payments,            sub: "needs attention",                          icon: AlertCircle, color: "text-red-500",     bg: dm ? "bg-red-900/20"     : "bg-red-50" },
    { label: "Employers",           value: stats.total_employers,            sub: "registered",                               icon: Briefcase,   color: "text-[#0084ca]",   bg: dm ? "bg-[#0084ca]/10"   : "bg-[#0084ca]/5" },
    { label: "Talents",             value: stats.total_talents,              sub: "registered",                               icon: Users,       color: "text-amber-600",   bg: dm ? "bg-amber-900/20"   : "bg-amber-50" },
  ] : [];

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 border-b ${dm ? "bg-gray-900 border-gray-800" : "bg-white border-slate-200"} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0084ca] to-violet-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className={`text-base font-bold ${text}`}>ETN Owner</span>
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${dm ? "bg-violet-900/40 text-violet-300" : "bg-violet-100 text-violet-700"}`}>Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleDarkMode} className={`p-2 rounded-lg transition-colors ${dm ? "hover:bg-gray-800 text-gray-400" : "hover:bg-slate-100 text-gray-500"}`}>
              {dm ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => { localStorage.removeItem("internal_token"); localStorage.removeItem("internal_user"); logout(); }} className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
            <p className="text-sm">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600"><XCircle className="w-4 h-4" /></button>
          </div>
        )}
        {successMsg && (
          <div className="mb-5 flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm">{successMsg}</p>
            <button onClick={() => setSuccessMsg(null)} className="ml-auto text-emerald-400 hover:text-emerald-600"><XCircle className="w-4 h-4" /></button>
          </div>
        )}

        {/* Tabs */}
        <div className={`flex items-center gap-1 p-1 rounded-xl mb-6 w-fit ${dm ? "bg-gray-800" : "bg-slate-200"}`}>
          {(["overview", "payments", "escrow"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t
                  ? "bg-white shadow-sm text-[#0084ca] dark:bg-gray-700"
                  : dm ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <>
            <div className="flex items-center justify-between mb-5">
              <h1 className={`text-xl font-bold ${text}`}>Platform Overview</h1>
              <button onClick={loadDashboard} className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${dm ? "hover:bg-gray-700 text-gray-400" : "hover:bg-slate-200 text-gray-500"}`}>
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#0084ca]" />
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {STAT_CARDS.map(({ label, value, sub, icon: Icon, color, bg: ibg }) => (
                  <div key={label} className={`rounded-xl border p-5 ${card}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${muted}`}>{label}</p>
                        <p className={`text-2xl font-bold ${text}`}>{value}</p>
                        <p className={`text-xs mt-1 ${muted}`}>{sub}</p>
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

        {/* ── PAYMENTS ── */}
        {tab === "payments" && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <h1 className={`text-xl font-bold ${text}`}>All Payments</h1>
              <div className="flex gap-2 flex-wrap">
                {/* Search */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${dm ? "bg-gray-800 border-gray-700" : "bg-white border-slate-300"}`}>
                  <Search className={`w-4 h-4 ${muted}`} />
                  <input
                    value={paySearch}
                    onChange={(e) => setPaySearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadPayments(1)}
                    placeholder="Search..."
                    className={`bg-transparent outline-none w-36 text-sm ${dm ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
                  />
                </div>
                {/* Status filter */}
                <select
                  value={payStatus}
                  onChange={(e) => { setPayStatus(e.target.value); }}
                  className={`px-3 py-2 rounded-lg border text-sm outline-none ${inputCls}`}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                </select>
                <button onClick={() => loadPayments(1)} className="px-3 py-2 rounded-lg bg-[#0084ca] text-white text-sm hover:bg-[#006ba6] transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className={`rounded-xl border overflow-hidden ${card}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${dm ? "border-gray-700 bg-gray-800/60" : "border-slate-200 bg-slate-50"}`}>
                      <th className={thCls}>Transaction</th>
                      <th className={thCls}>Employer</th>
                      <th className={thCls}>Job</th>
                      <th className={thCls}>Amount</th>
                      <th className={thCls}>Method</th>
                      <th className={thCls}>Status</th>
                      <th className={thCls}>Date</th>
                      <th className={thCls}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${dm ? "divide-gray-700" : "divide-slate-100"}`}>
                    {payments.length === 0 ? (
                      <tr><td colSpan={8} className={`text-center py-12 text-sm ${muted}`}>No payments found</td></tr>
                    ) : payments.map((p) => (
                      <tr key={p.id} className={`transition-colors ${dm ? "hover:bg-gray-700/50" : "hover:bg-slate-50"}`}>
                        <td className={tdCls}>
                          <p className="font-mono text-xs truncate max-w-[120px]" title={p.transaction_id}>{p.transaction_id?.slice(0, 12)}...</p>
                        </td>
                        <td className={tdCls}>
                          <p className="font-medium">{p.employer_name}</p>
                          <p className={`text-xs ${muted}`}>{p.company_name}</p>
                        </td>
                        <td className={`${tdCls} max-w-[140px] truncate`}>{p.job_title || "—"}</td>
                        <td className={tdCls}>
                          <span className="font-semibold">{fmt(p.amount, p.currency)}</span>
                        </td>
                        <td className={tdCls}><span className="capitalize">{p.method}</span></td>
                        <td className={tdCls}><Badge status={p.status} /></td>
                        <td className={`${tdCls} whitespace-nowrap`}>{fmtDate(p.create_at)}</td>
                        <td className={tdCls}>
                          {p.status === "pending" && (
                            <div className="flex items-center gap-1.5">
                              {!verifiedPayments.has(p.id) ? (
                                <button
                                  onClick={() => handleVerify(p.id)}
                                  disabled={verifyingId === p.id}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors disabled:opacity-50"
                                >
                                  {verifyingId === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Shield className="w-3 h-3" />}
                                  Verify
                                </button>
                              ) : (
                                <>
                                  <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700">
                                    <CheckCircle className="w-3 h-3" /> Verified
                                  </span>
                                  <button
                                    onClick={() => handleApprove(p.id)}
                                    disabled={actionId === p.id}
                                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                  >
                                    {actionId === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                    Approve
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                          {p.status === "success" && <span className={`text-xs ${muted}`}>Approved</span>}
                          {p.status === "failed" && <span className={`text-xs text-red-400`}>Failed</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {payPagination.pages > 1 && (
                <div className={`flex items-center justify-between px-4 py-3 border-t text-sm ${dm ? "border-gray-700 text-gray-400" : "border-slate-200 text-gray-500"}`}>
                  <span>{payPagination.total} total</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => loadPayments(payPagination.page - 1)} disabled={payPagination.page === 1}
                      className={`p-1.5 rounded-lg disabled:opacity-40 ${dm ? "hover:bg-gray-700" : "hover:bg-slate-100"}`}>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span>Page {payPagination.page} of {payPagination.pages}</span>
                    <button onClick={() => loadPayments(payPagination.page + 1)} disabled={payPagination.page === payPagination.pages}
                      className={`p-1.5 rounded-lg disabled:opacity-40 ${dm ? "hover:bg-gray-700" : "hover:bg-slate-100"}`}>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── ESCROW ── */}
        {tab === "escrow" && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <h1 className={`text-xl font-bold ${text}`}>Escrow Records</h1>
              <div className="flex gap-2">
                <select
                  value={escStatus}
                  onChange={(e) => setEscStatus(e.target.value)}
                  className={`px-3 py-2 rounded-lg border text-sm outline-none ${inputCls}`}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="funded">Funded</option>
                  <option value="released">Released</option>
                  <option value="releassed">Released (DB)</option>
                  <option value="failed">Failed</option>
                </select>
                <button onClick={() => loadEscrow(1)} className="px-3 py-2 rounded-lg bg-[#0084ca] text-white text-sm hover:bg-[#006ba6] transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className={`rounded-xl border overflow-hidden ${card}`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`border-b ${dm ? "border-gray-700 bg-gray-800/60" : "border-slate-200 bg-slate-50"}`}>
                      <th className={thCls}>Job</th>
                      <th className={thCls}>Employer</th>
                      <th className={thCls}>Talent</th>
                      <th className={thCls}>Amount</th>
                      <th className={thCls}>Method</th>
                      <th className={thCls}>Escrow Status</th>
                      <th className={thCls}>Payment Date</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${dm ? "divide-gray-700" : "divide-slate-100"}`}>
                    {escrows.length === 0 ? (
                      <tr><td colSpan={7} className={`text-center py-12 text-sm ${muted}`}>No escrow records found</td></tr>
                    ) : escrows.map((e) => (
                      <tr key={e.id} className={`transition-colors ${dm ? "hover:bg-gray-700/50" : "hover:bg-slate-50"}`}>
                        <td className={`${tdCls} max-w-[140px] truncate`}>{e.job_title || "—"}</td>
                        <td className={tdCls}>
                          <p className="font-medium">{e.employer_name}</p>
                          <p className={`text-xs ${muted}`}>{e.company_name}</p>
                        </td>
                        <td className={tdCls}>
                          <p className="font-medium">{e.talent_name}</p>
                          <p className={`text-xs ${muted}`}>{e.talent_email}</p>
                        </td>
                        <td className={tdCls}><span className="font-semibold">{fmt(e.amount, e.currency)}</span></td>
                        <td className={tdCls}><span className="capitalize">{e.payment_method || "—"}</span></td>
                        <td className={tdCls}><Badge status={e.status} /></td>
                        <td className={`${tdCls} whitespace-nowrap`}>{e.payment_date ? fmtDate(e.payment_date) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {escPagination.pages > 1 && (
                <div className={`flex items-center justify-between px-4 py-3 border-t text-sm ${dm ? "border-gray-700 text-gray-400" : "border-slate-200 text-gray-500"}`}>
                  <span>{escPagination.total} total</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => loadEscrow(escPagination.page - 1)} disabled={escPagination.page === 1}
                      className={`p-1.5 rounded-lg disabled:opacity-40 ${dm ? "hover:bg-gray-700" : "hover:bg-slate-100"}`}>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span>Page {escPagination.page} of {escPagination.pages}</span>
                    <button onClick={() => loadEscrow(escPagination.page + 1)} disabled={escPagination.page === escPagination.pages}
                      className={`p-1.5 rounded-lg disabled:opacity-40 ${dm ? "hover:bg-gray-700" : "hover:bg-slate-100"}`}>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
