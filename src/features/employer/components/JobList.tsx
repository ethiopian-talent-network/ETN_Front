import React, { useState, useMemo } from "react";
import { Search, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { JobCard } from "./JobCard";
import type { Job } from "../types/employer.types";
import { useNavigate } from "react-router";
import { EMPLOYER_ROUTES } from "../../../config/routes";

interface JobListProps {
  jobs: Job[];
  loading?: boolean;
  error?: string | null;
  darkMode?: boolean;
  onViewDetails: (job: Job) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onViewProposals: (job: Job) => void;
}

type SortKey = "title" | "created_at" | "applications_count";

export const JobList: React.FC<JobListProps> = ({
  jobs, loading = false, error = null, darkMode = false,
  onViewDetails, onEdit, onDelete, onViewProposals,
}) => {
  const navigate = useNavigate();
  const dm = darkMode;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let list = [...jobs];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((j) => j.title.toLowerCase().includes(q) || j.category_name?.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") list = list.filter((j) => j.status === statusFilter);
    list.sort((a, b) => {
      let av: any = a[sortKey] ?? 0;
      let bv: any = b[sortKey] ?? 0;
      if (sortKey === "created_at") { av = new Date(av).getTime(); bv = new Date(bv).getTime(); }
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [jobs, search, statusFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
    ) : <ChevronDown className="w-3.5 h-3.5 opacity-30" />;

  const thCls = `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${dm ? "text-gray-400" : "text-gray-500"}`;

  if (loading) {
    return (
      <div className={`rounded-xl border ${dm ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100 shadow-sm"}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`flex gap-4 p-5 border-b last:border-0 animate-pulse ${dm ? "border-gray-700" : "border-gray-100"}`}>
            <div className={`h-4 rounded w-1/3 ${dm ? "bg-gray-700" : "bg-gray-200"}`} />
            <div className={`h-4 rounded w-16 ${dm ? "bg-gray-700" : "bg-gray-200"}`} />
            <div className={`h-4 rounded w-20 ml-auto ${dm ? "bg-gray-700" : "bg-gray-200"}`} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-xl border p-8 text-center ${dm ? "bg-gray-800 border-gray-700 text-red-400" : "bg-red-50 border-red-200 text-red-600"}`}>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border overflow-hidden ${dm ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100 shadow-sm"}`}>
      {/* Toolbar */}
      <div className={`flex flex-col sm:flex-row gap-3 p-4 border-b ${dm ? "border-gray-700" : "border-gray-100"}`}>
        <div className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-lg border text-sm ${dm ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className={`flex-1 bg-transparent outline-none ${dm ? "text-white placeholder-gray-500" : "text-gray-900 placeholder-gray-400"}`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`px-3 py-2 rounded-lg border text-sm outline-none ${dm ? "bg-gray-700 border-gray-600 text-white" : "bg-gray-50 border-gray-200 text-gray-700"}`}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="paused">Paused</option>
          <option value="closed">Closed</option>
        </select>
        <button
          onClick={() => navigate(EMPLOYER_ROUTES.POST_JOB.path)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0084ca] hover:bg-[#006ba6] text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          Post Job
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${dm ? "bg-gray-700" : "bg-gray-100"}`}>
            <Search className={`w-6 h-6 ${dm ? "text-gray-500" : "text-gray-400"}`} />
          </div>
          <p className={`text-sm font-medium mb-1 ${dm ? "text-gray-300" : "text-gray-700"}`}>
            {jobs.length === 0 ? "No jobs posted yet" : "No jobs match your filters"}
          </p>
          <p className={`text-xs ${dm ? "text-gray-500" : "text-gray-400"}`}>
            {jobs.length === 0 ? "Post your first job to start receiving applications" : "Try adjusting your search or filter"}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${dm ? "border-gray-700 bg-gray-800/50" : "border-gray-100 bg-gray-50/50"}`}>
                <th className={`${thCls} pl-6`}>
                  <button className="flex items-center gap-1" onClick={() => toggleSort("title")}>
                    Job Title <SortIcon k="title" />
                  </button>
                </th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Budget</th>
                <th className={thCls}>
                  <button className="flex items-center gap-1" onClick={() => toggleSort("applications_count")}>
                    Applications <SortIcon k="applications_count" />
                  </button>
                </th>
                <th className={thCls}>
                  <button className="flex items-center gap-1" onClick={() => toggleSort("created_at")}>
                    Posted <SortIcon k="created_at" />
                  </button>
                </th>
                <th className={`${thCls} pr-6`}>Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${dm ? "divide-gray-700" : "divide-gray-100"}`}>
              {filtered.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  darkMode={dm}
                  onViewDetails={onViewDetails}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewProposals={onViewProposals}
                />
              ))}
            </tbody>
          </table>
          <div className={`px-6 py-3 border-t text-xs ${dm ? "border-gray-700 text-gray-500" : "border-gray-100 text-gray-400"}`}>
            Showing {filtered.length} of {jobs.length} jobs
          </div>
        </div>
      )}
    </div>
  );
};
