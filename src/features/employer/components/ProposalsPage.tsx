import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useAllProposals } from "../hooks/useAllProposals";
import { TalentProfileModal } from "./TalentProfileModal";
import type { Proposal } from "../types/employer.types";

interface ProposalsPageProps {
  darkMode?: boolean;
}

export const ProposalsPage: React.FC<ProposalsPageProps> = ({
  darkMode = false,
}) => {
  const [selectedTalentId, setSelectedTalentId] = useState<number | null>(null);
  const [showTalentProfileModal, setShowTalentProfileModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"all" | "shortlisted">("all");

  const {
    proposals,
    loading,
    error,
    pagination,
    fetchAllProposals,
    updateProposalStatus,
  } = useAllProposals();

  useEffect(() => {
    fetchAllProposals();
  }, [fetchAllProposals]);

  const handleViewTalentProfile = (talentId: number) => {
    setSelectedTalentId(talentId);
    setShowTalentProfileModal(true);
  };

  const handleUpdateStatus = async (proposalId: number, status: string) => {
    await updateProposalStatus(proposalId, status);
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    fetchAllProposals(pagination.page, pagination.limit, value, searchTerm);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    fetchAllProposals(pagination.page, pagination.limit, statusFilter, value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusActions = (status: string) => {
    switch (status) {
      case "pending":
        return [
          { label: "Mark as Reviewed", status: "reviewed", color: "blue" },
          { label: "Shortlist", status: "shortlisted", color: "purple" },
          { label: "Reject", status: "rejected", color: "red" },
        ];
      case "reviewed":
        return [
          { label: "Shortlist", status: "shortlisted", color: "purple" },
          { label: "Reject", status: "rejected", color: "red" },
        ];
      case "shortlisted":
        return [
          { label: "Hire", status: "hired", color: "green" },
          { label: "Remove from Shortlist", status: "pending", color: "gray" },
          { label: "Reject", status: "rejected", color: "red" },
        ];
      case "hired":
        return [
          { label: "Remove from Shortlist", status: "pending", color: "gray" },
        ];
      default:
        return [];
    }
  };

  const getActionColor = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 hover:bg-blue-100 text-blue-600";
      case "purple":
        return "bg-purple-50 hover:bg-purple-100 text-purple-600";
      case "red":
        return "bg-red-50 hover:bg-red-100 text-red-600";
      case "green":
        return "bg-green-50 hover:bg-green-100 text-green-600";
      case "gray":
        return "bg-gray-50 hover:bg-gray-100 text-gray-600";
      default:
        return "bg-gray-50 hover:bg-gray-100 text-gray-600";
    }
  };

  // Filter proposals based on active tab
  const filteredProposals =
    activeTab === "shortlisted"
      ? proposals.filter((proposal) => proposal.status === "shortlisted")
      : proposals;

  if (loading && proposals.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span
          className={`ml-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          Loading proposals...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className={`text-3xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          {activeTab === "shortlisted"
            ? "Shortlisted Proposals"
            : "All Proposals"}
        </h1>
        <p
          className={`mt-2 text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          {activeTab === "shortlisted"
            ? "Manage your shortlisted candidates for hiring"
            : "Manage all job applications and proposals from talents"}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "all"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All Applications
            <span
              className={`ml-2 px-2.5 py-0.5 rounded-full text-xs ${
                activeTab === "all"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {proposals.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("shortlisted")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "shortlisted"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Shortlisted
            <span
              className={`ml-2 px-2.5 py-0.5 rounded-full text-xs ${
                activeTab === "shortlisted"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {proposals.filter((p) => p.status === "shortlisted").length}
            </span>
          </button>
        </nav>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={darkMode ? "bg-gray-800 border-gray-700 text-white" : ""}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          className={`px-4 py-2 border rounded-md ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-white border-gray-300"
          }`}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="rejected">Rejected</option>
          <option value="hired">Hired</option>
        </select>
      </div>

      {/* Error State */}
      {error && (
        <div
          className={`text-center py-8 px-4 rounded-lg border ${
            darkMode
              ? "bg-red-900/20 border-red-800 text-red-400"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium mb-2">Error Loading Proposals</h3>
          <p className="text-sm">{error}</p>
          <Button onClick={() => fetchAllProposals()} className="mt-4">
            Try Again
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredProposals.length === 0 && (
        <div
          className={`text-center py-12 px-4 rounded-lg border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <svg
            className={`w-12 h-12 mx-auto mb-4 ${darkMode ? "text-gray-400" : "text-gray-400"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3
            className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {activeTab === "shortlisted"
              ? "No Shortlisted Proposals"
              : "No Proposals Found"}
          </h3>
          <p
            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            {activeTab === "shortlisted"
              ? "You haven't shortlisted any proposals yet. Shortlist promising candidates to see them here."
              : "No proposals match your current filters."}
          </p>
        </div>
      )}

      {/* Proposals List */}
      {!loading && !error && filteredProposals.length > 0 && (
        <div className="space-y-4">
          {filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className={`border rounded-lg p-6 ${
                darkMode
                  ? "border-gray-700 bg-gray-800"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div
                  className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleViewTalentProfile(proposal.talent_id)}
                >
                  {proposal.profile_image && (
                    <img
                      src={proposal.profile_image}
                      alt={proposal.talent_name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3
                      className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"} hover:underline`}
                    >
                      {proposal.talent_name}
                    </h3>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {proposal.talent_email}
                    </p>
                    {proposal.profile_title && (
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {proposal.profile_title}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}
                  >
                    {proposal.status}
                  </span>
                </div>
              </div>

              {proposal.cover_letter && (
                <div className="mb-4">
                  <h4
                    className={`font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Cover Letter
                  </h4>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {proposal.cover_letter}
                  </p>
                </div>
              )}

              {proposal.proposal && (
                <div className="mb-4">
                  <h4
                    className={`font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    Proposal
                  </h4>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {proposal.proposal}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                {proposal.job_title && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {proposal.job_title}
                  </span>
                )}
                {proposal.company_name && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    {proposal.company_name}
                  </span>
                )}
                {proposal.hourly_rate && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    {proposal.hourly_rate}/hour
                  </span>
                )}
                {proposal.talent_location && (
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {proposal.talent_location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Applied {new Date(proposal.applied_at).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-2">
                {getStatusActions(proposal.status).map((action) => (
                  <Button
                    key={action.status}
                    size="sm"
                    onClick={() =>
                      handleUpdateStatus(proposal.id, action.status)
                    }
                    className={getActionColor(action.color)}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Talent Profile Modal */}
      <TalentProfileModal
        isOpen={showTalentProfileModal}
        onClose={() => setShowTalentProfileModal(false)}
        talentId={selectedTalentId}
        darkMode={darkMode}
      />
    </div>
  );
};
