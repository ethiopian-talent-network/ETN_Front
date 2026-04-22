import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useDarkMode } from "../../contexts/DarkModeContext";
import {
  Clock,
  DollarSign,
  CheckCircle,
  XCircle,
  Hourglass,
  ArrowRight,
  Calendar,
  MapPin,
  Briefcase,
  Search,
} from "lucide-react";
import { getUserApplications } from "../../api/jobs/jobApi";

type ApplicationStatus = "pending" | "accepted" | "rejected" | "shortlisted";

interface Application {
  id: number;
  job_id: number;
  cover_letter: string;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
  tokens_used: number;
  proposal: string;
  job_title: string;
  job_salary: string;
  job_salary_type: string;
  company_name: string;
  company_location: string;
}

interface ApplicationsResponse {
  applications: Application[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

const statusColors = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  accepted:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  shortlisted:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

const statusIcons = {
  pending: Hourglass,
  accepted: CheckCircle,
  rejected: XCircle,
  shortlisted: Clock,
};

export default function MyApplications() {
  const { darkMode } = useDarkMode();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    fetchApplications();
  }, [pagination.current]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: ApplicationsResponse = await getUserApplications({
        page: pagination.current,
        limit: pagination.pageSize,
      });
      setApplications(response.applications);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "all" || app.status === filter;
    const matchesSearch =
      search === "" ||
      app.job_title.toLowerCase().includes(search.toLowerCase()) ||
      app.company_name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusCount = (status: ApplicationStatus) => {
    return applications.filter((app) => app.status === status).length;
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0084ca]"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header
        className={`transition-colors duration-300 ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/talent-dashboard"
              className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
                darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/" className="text-2xl font-bold text-[#0084ca]">
                ETN
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8">
          <h1
            className={`text-3xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            My Applications
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Track and manage all your job applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div
            className={`p-4 rounded-xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="text-2xl font-bold text-[#0084ca]">
              {pagination.total}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Total Applications
            </div>
          </div>
          <div
            className={`p-4 rounded-xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="text-2xl font-bold text-yellow-600">
              {getStatusCount("pending")}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Pending
            </div>
          </div>
          <div
            className={`p-4 rounded-xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="text-2xl font-bold text-green-600">
              {getStatusCount("accepted")}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Accepted
            </div>
          </div>
          <div
            className={`p-4 rounded-xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="text-2xl font-bold text-red-600">
              {getStatusCount("rejected")}
            </div>
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Rejected
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div
          className={`p-4 rounded-xl border mb-6 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search applications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border text-sm ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-[#0084ca]`}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "all"
                    ? "bg-[#0084ca] text-white"
                    : darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "pending"
                    ? "bg-[#0084ca] text-white"
                    : darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("accepted")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "accepted"
                    ? "bg-[#0084ca] text-white"
                    : darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Accepted
              </button>
              <button
                onClick={() => setFilter("rejected")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === "rejected"
                    ? "bg-[#0084ca] text-white"
                    : darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Rejected
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div
            className={`text-center p-12 rounded-xl border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <Briefcase
              className={`w-16 h-16 mx-auto mb-4 ${
                darkMode ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <h3
              className={`text-xl font-semibold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              No Applications Found
            </h3>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              {search || filter !== "all"
                ? "Try adjusting your search or filter"
                : "Start applying to jobs to see them here"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const StatusIcon = statusIcons[application.status];
              return (
                <div
                  key={application.id}
                  className={`p-6 rounded-xl border hover:shadow-lg transition-shadow ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div
                          className={`p-2 rounded-lg ${
                            statusColors[application.status]
                          }`}
                        >
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-semibold mb-1 ${
                              darkMode ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {application.job_title}
                          </h3>
                          <p
                            className={`text-sm mb-2 ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {application.company_name}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div
                              className={`flex items-center gap-1 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              <MapPin className="w-4 h-4" />
                              {application.company_location}
                            </div>
                            <div
                              className={`flex items-center gap-1 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              <DollarSign className="w-4 h-4" />
                              {application.job_salary}
                            </div>
                            <div
                              className={`flex items-center gap-1 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              <Calendar className="w-4 h-4" />
                              Applied {formatDate(application.applied_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                      {application.proposal && (
                        <div
                          className={`mt-4 p-3 rounded-lg ${
                            darkMode ? "bg-gray-700" : "bg-gray-50"
                          }`}
                        >
                          <p
                            className={`text-sm line-clamp-2 ${
                              darkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            <strong>Proposal:</strong> {application.proposal}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[application.status]}`}
                      >
                        {application.status}
                      </span>
                      <div
                        className={`text-xs ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {application.tokens_used} tokens spent
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
