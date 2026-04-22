import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useDarkMode } from "../contexts/DarkModeContext";
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

type ApplicationStatus = "pending" | "accepted" | "rejected" | "reviewed";

interface Application {
  id: number;
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    salary: string;
    budget_type: string;
    experience: string;
  };
  status: ApplicationStatus;
  submitted_at: string;
  cover_letter: string;
  proposal?: string;
  estimated_timeline?: string;
  budget_proposal?: string;
  token_cost: number;
}

const statusColors = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  accepted:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  reviewed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

const statusIcons = {
  pending: Hourglass,
  accepted: CheckCircle,
  rejected: XCircle,
  reviewed: Clock,
};

export default function MyApplications() {
  const { darkMode } = useDarkMode();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");
  const [search, setSearch] = useState("");

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockApplications: Application[] = [
      {
        id: 1,
        job: {
          id: 1,
          title: "Senior React Developer",
          company: "TechCorp Inc",
          location: "Remote",
          salary: "$80,000 - $120,000",
          budget_type: "annual",
          experience: "Senior",
        },
        status: "pending",
        submitted_at: "2024-04-15T10:30:00Z",
        cover_letter:
          "I am excited to apply for this position as I have 5 years of experience...",
        token_cost: 5,
      },
      {
        id: 2,
        job: {
          id: 2,
          title: "Full Stack Developer",
          company: "StartupXYZ",
          location: "New York, NY",
          salary: "$90,000 - $130,000",
          budget_type: "annual",
          experience: "Mid-Senior",
        },
        status: "accepted",
        submitted_at: "2024-04-10T14:20:00Z",
        cover_letter:
          "With my extensive experience in both frontend and backend...",
        proposal:
          "I propose to build the application using React and Node.js...",
        estimated_timeline: "3 months",
        budget_proposal: "$100,000",
        token_cost: 5,
      },
      {
        id: 3,
        job: {
          id: 3,
          title: "UI/UX Designer",
          company: "DesignHub",
          location: "Remote",
          salary: "$60,000 - $90,000",
          budget_type: "annual",
          experience: "Mid",
        },
        status: "rejected",
        submitted_at: "2024-04-05T09:15:00Z",
        cover_letter: "As a passionate designer with 3 years of experience...",
        token_cost: 3,
      },
    ];

    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredApplications = applications.filter((app) => {
    const matchesFilter = filter === "all" || app.status === filter;
    const matchesSearch =
      search === "" ||
      app.job.title.toLowerCase().includes(search.toLowerCase()) ||
      app.job.company.toLowerCase().includes(search.toLowerCase());
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
              {applications.length}
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
                            {application.job.title}
                          </h3>
                          <p
                            className={`text-sm mb-2 ${
                              darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {application.job.company}
                          </p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div
                              className={`flex items-center gap-1 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              <MapPin className="w-4 h-4" />
                              {application.job.location}
                            </div>
                            <div
                              className={`flex items-center gap-1 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              <DollarSign className="w-4 h-4" />
                              {application.job.salary}
                            </div>
                            <div
                              className={`flex items-center gap-1 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                              }`}
                            >
                              <Calendar className="w-4 h-4" />
                              Applied {formatDate(application.submitted_at)}
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
                        {application.token_cost} tokens spent
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
