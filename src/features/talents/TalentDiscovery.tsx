import { useState, useEffect } from "react";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { X, MapPin, GitBranch, Link, UserPlus, Check, Loader2, Search } from "lucide-react";
import {
  getAllTalents,
  sendConnectionRequest,
  getMyConnections,
  type TalentCard,
  type Connection,
} from "../../api/talent/talentApi";

export default function TalentDiscovery() {
  const { darkMode } = useDarkMode();
  const [talents, setTalents] = useState<TalentCard[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});
  const [connectedIds, setConnectedIds] = useState<Set<number>>(new Set());
  const [pendingIds, setPendingIds] = useState<Set<number>>(new Set());
  const [sendingId, setSendingId] = useState<number | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<TalentCard | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    loadTalents();
    loadConnectionStatus();
  }, [page]);

  const loadTalents = async () => {
    setLoading(true);
    try {
      const res = await getAllTalents({ page, limit: 12, search: search || undefined });
      setTalents(res.talents);
      setPagination(res.pagination);
    } catch {
      showToast("Failed to load talents", "error");
    } finally {
      setLoading(false);
    }
  };

  const loadConnectionStatus = async () => {
    try {
      const connRes = await getMyConnections();
      const ids = new Set(
        (connRes.connections || []).map((c: Connection) => c.talent_id ?? c.sender_id ?? 0)
      );
      setConnectedIds(ids);
      const stored = JSON.parse(localStorage.getItem("pendingConnections") || "[]");
      setPendingIds(new Set(stored));
    } catch {}
  };

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadTalents();
  };

  const handleConnect = async (talentId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSendingId(talentId);
    try {
      await sendConnectionRequest(talentId);
      const stored = JSON.parse(localStorage.getItem("pendingConnections") || "[]");
      stored.push(talentId);
      localStorage.setItem("pendingConnections", JSON.stringify(stored));
      setPendingIds((prev) => new Set([...prev, talentId]));
      showToast("Connection request sent!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to send request", "error");
    } finally {
      setSendingId(null);
    }
  };

  const bg = darkMode ? "bg-gray-900" : "bg-gray-50";
  const card = darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const text = darkMode ? "text-white" : "text-gray-900";
  const muted = darkMode ? "text-gray-400" : "text-gray-500";
  const inputCls = darkMode
    ? "bg-gray-800 border-gray-600 text-white placeholder-gray-500 focus:border-[#0084ca]"
    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-[#0084ca]";

  const ConnectButton = ({ talent, full = false }: { talent: TalentCard; full?: boolean }) => {
    const isConnected = connectedIds.has(talent.id);
    const isPending = pendingIds.has(talent.id);
    const isSending = sendingId === talent.id;

    if (isConnected)
      return (
        <span className={`flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400 ${full ? "justify-center w-full py-2" : ""}`}>
          <Check className="w-4 h-4" /> Connected
        </span>
      );

    return (
      <button
        onClick={(e) => handleConnect(talent.id, e)}
        disabled={isPending || isSending}
        className={`flex items-center gap-1.5 text-sm font-medium transition-all rounded-lg px-4 py-2 ${full ? "w-full justify-center" : ""} ${
          isPending
            ? "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 cursor-default"
            : isSending
            ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-wait"
            : "bg-[#0084ca] hover:bg-[#006ba6] text-white active:scale-95"
        }`}
      >
        {isSending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        {isPending ? "Pending" : isSending ? "Sending..." : "Connect"}
      </button>
    );
  };

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${text}`}>Discover Talents</h1>
          <p className={`mt-1 text-sm ${muted}`}>
            {pagination.total ? `${pagination.total} talents available` : "Browse and connect with talented professionals"}
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${muted}`} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, skill, or location..."
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${inputCls} focus:outline-none focus:ring-2 focus:ring-[#0084ca]/30 transition-colors`}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0084ca] hover:bg-[#006ba6] text-white rounded-lg font-medium transition-colors active:scale-95"
          >
            Search
          </button>
        </form>

        {/* Toast */}
        {toast && (
          <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-fade-in ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}>
            {toast.msg}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className={`${card} border rounded-xl p-5 animate-pulse`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                  <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : talents.length === 0 ? (
          <div className={`text-center py-24 ${muted}`}>
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No talents found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {talents.map((talent) => (
              <div
                key={talent.id}
                onClick={() => setSelectedTalent(talent)}
                className={`${card} border rounded-xl p-5 flex flex-col gap-3 cursor-pointer hover:shadow-md hover:border-[#0084ca]/40 transition-all duration-200 group`}
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-3">
                  {talent.profile_image ? (
                    <img
                      src={talent.profile_image}
                      alt={talent.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-transparent group-hover:ring-[#0084ca]/30 transition-all"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0084ca] to-purple-600 flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                      {talent.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className={`font-semibold truncate ${text} group-hover:text-[#0084ca] transition-colors`}>
                      {talent.name}
                    </h3>
                    {talent.location && (
                      <p className={`text-xs flex items-center gap-1 truncate ${muted}`}>
                        <MapPin className="w-3 h-3 flex-shrink-0" /> {talent.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* About */}
                {talent.about && (
                  <p className={`text-xs line-clamp-2 ${muted}`}>{talent.about}</p>
                )}

                {/* Skills */}
                {talent.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {talent.skills.slice(0, 3).map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                        {skill}
                      </span>
                    ))}
                    {talent.skills.length > 3 && (
                      <span className={`text-xs px-1 ${muted}`}>+{talent.skills.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Connect */}
                <div className="mt-auto pt-1" onClick={(e) => e.stopPropagation()}>
                  <ConnectButton talent={talent} full />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && (pagination.has_prev_page || pagination.has_next_page) && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={!pagination.has_prev_page}
              className="px-5 py-2 rounded-lg bg-[#0084ca] text-white disabled:opacity-40 hover:bg-[#006ba6] transition-colors"
            >
              ← Previous
            </button>
            <span className={`text-sm ${muted}`}>Page {page} of {Math.ceil((pagination.total || 1) / 12)}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.has_next_page}
              className="px-5 py-2 rounded-lg bg-[#0084ca] text-white disabled:opacity-40 hover:bg-[#006ba6] transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Profile Detail Drawer */}
      {selectedTalent && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedTalent(null)}
          />

          {/* Drawer */}
          <div className={`relative w-full max-w-md h-full overflow-y-auto shadow-2xl ${darkMode ? "bg-gray-900" : "bg-white"} animate-slide-in-right`}>
            {/* Close */}
            <button
              onClick={() => setSelectedTalent(null)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors z-10 ${darkMode ? "hover:bg-gray-800 text-gray-400" : "hover:bg-gray-100 text-gray-500"}`}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cover / Avatar */}
            <div className="h-28 bg-gradient-to-r from-[#0084ca] to-purple-600" />
            <div className="px-6 pb-6">
              <div className="-mt-12 mb-4 flex items-end justify-between">
                {selectedTalent.profile_image ? (
                  <img
                    src={selectedTalent.profile_image}
                    alt={selectedTalent.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-900"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0084ca] to-purple-600 flex items-center justify-center text-white font-bold text-2xl border-4 border-white dark:border-gray-900">
                    {selectedTalent.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div onClick={(e) => e.stopPropagation()}>
                  <ConnectButton talent={selectedTalent} />
                </div>
              </div>

              {/* Name & Location */}
              <h2 className={`text-xl font-bold ${text}`}>{selectedTalent.name}</h2>
              {selectedTalent.location && (
                <p className={`flex items-center gap-1 text-sm mt-1 ${muted}`}>
                  <MapPin className="w-3.5 h-3.5" /> {selectedTalent.location}
                </p>
              )}

              {/* About */}
              {selectedTalent.about && (
                <div className="mt-5">
                  <h3 className={`text-sm font-semibold uppercase tracking-wider mb-2 ${muted}`}>About</h3>
                  <p className={`text-sm leading-relaxed ${text}`}>{selectedTalent.about}</p>
                </div>
              )}

              {/* Skills */}
              {selectedTalent.skills.length > 0 && (
                <div className="mt-5">
                  <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${muted}`}>Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTalent.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              {(selectedTalent.linkedin || selectedTalent.github) && (
                <div className="mt-5">
                  <h3 className={`text-sm font-semibold uppercase tracking-wider mb-3 ${muted}`}>Links</h3>
                  <div className="flex flex-col gap-2">
                    {selectedTalent.linkedin && (
                      <a
                        href={selectedTalent.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[#0084ca] hover:underline"
                      >
                        <Link className="w-4 h-4" /> LinkedIn Profile
                      </a>
                    )}
                    {selectedTalent.github && (
                      <a
                        href={selectedTalent.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 text-sm hover:underline ${text}`}
                      >
                        <GitBranch className="w-4 h-4" /> GitHub Profile
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Connect CTA */}
              {!connectedIds.has(selectedTalent.id) && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div onClick={(e) => e.stopPropagation()}>
                    <ConnectButton talent={selectedTalent} full />
                  </div>
                  <p className={`text-xs text-center mt-2 ${muted}`}>
                    Send a connection request to start networking
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
