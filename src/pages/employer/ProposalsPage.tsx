import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Briefcase,
  FileText,
} from "lucide-react";
import {
  getApplicationsByJob,
  updateApplicationStatus,
} from "../../api/employer/employerApi";

interface Proposal {
  id: number;
  talent_id: number;
  talent_name: string;
  talent_email: string;
  profile_title: string;
  hourly_rate: string;
  talent_location: string;
  cover_letter: string;
  proposal: string;
  status: string;
  applied_at: string;
  job_id: number;
}

const ProposalsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(
    null,
  );

  useEffect(() => {
    if (jobId) {
      fetchProposals();
    }
  }, [jobId]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const applications = await getApplicationsByJob(token, parseInt(jobId!));

      // Transform the response to match the Proposal interface
      const transformedProposals = applications.map((app: any) => ({
        id: app.application_id,
        talent_id: app.talent_id || 0,
        talent_name: app.talent_name,
        talent_email: app.email,
        profile_title: "", // Not available in current API response
        hourly_rate: "", // Not available in current API response
        talent_location: "", // Not available in current API response
        cover_letter: app.cover_letter,
        proposal: app.proposal,
        status: app.status,
        applied_at: app.applied_at,
        job_id: parseInt(jobId!),
      }));

      setProposals(transformedProposals);
    } catch (err: any) {
      setError(err.message || "Failed to fetch proposals");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusUpdate = async (
    applicationId: number,
    newStatus: string,
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      await updateApplicationStatus(token, applicationId, newStatus);

      // Update the local state to reflect the change
      setProposals((prev) =>
        prev.map((proposal) =>
          proposal.id === applicationId
            ? { ...proposal, status: newStatus }
            : proposal,
        ),
      );

      // Update selected proposal if it's the one being updated
      if (selectedProposal && selectedProposal.id === applicationId) {
        setSelectedProposal({ ...selectedProposal, status: newStatus });
      }

      console.log(
        `Successfully updated application ${applicationId} to ${newStatus}`,
      );
    } catch (error: any) {
      console.error("Error updating application status:", error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  const handleAccept = () => {
    if (selectedProposal) {
      handleStatusUpdate(selectedProposal.id, "hired");
    }
  };

  const handleShortlist = () => {
    if (selectedProposal) {
      handleStatusUpdate(selectedProposal.id, "shortlisted");
    }
  };

  const handleReject = () => {
    if (selectedProposal) {
      handleStatusUpdate(selectedProposal.id, "rejected");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading proposals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={() => navigate("/employer-dashboard")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/employer-dashboard")}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </button>
              <h1 className="text-xl font-semibold text-gray-900">
                Proposals for Job #{jobId}
              </h1>
            </div>
            <div className="text-sm text-gray-500">
              {proposals.length} proposal{proposals.length !== 1 ? "s" : ""}{" "}
              found
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {proposals.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Proposals Yet
            </h3>
            <p className="text-gray-600">
              No proposals have been submitted for this job yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Proposals List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium text-gray-900">
                    All Proposals
                  </h2>
                </div>
                <div className="divide-y">
                  {proposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 ${
                        selectedProposal?.id === proposal.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => setSelectedProposal(proposal)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <h3 className="font-medium text-gray-900">
                              {proposal.talent_name}
                            </h3>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Mail className="h-4 w-4 mr-1" />
                            {proposal.talent_email}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Calendar className="h-4 w-4 mr-1" />
                            Applied{" "}
                            {new Date(proposal.applied_at).toLocaleDateString()}
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}
                          >
                            {proposal.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Proposal Details */}
            <div className="lg:col-span-2">
              {selectedProposal ? (
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Proposal Details
                      </h2>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProposal.status)}`}
                      >
                        {selectedProposal.status}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <User className="h-5 w-5 mr-2" />
                      <span className="font-medium">
                        {selectedProposal.talent_name}
                      </span>
                      <span className="mx-2">•</span>
                      <Mail className="h-4 w-4 mr-1" />
                      {selectedProposal.talent_email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      Applied on{" "}
                      {new Date(
                        selectedProposal.applied_at,
                      ).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(
                        selectedProposal.applied_at,
                      ).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Cover Letter */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Cover Letter
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {selectedProposal.cover_letter ||
                            "No cover letter provided"}
                        </p>
                      </div>
                    </div>

                    {/* Proposal */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <Briefcase className="h-5 w-5 mr-2" />
                        Proposal
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {selectedProposal.proposal ||
                            "No proposal details provided"}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4 border-t">
                      <button
                        onClick={handleAccept}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedProposal}
                      >
                        Accept
                      </button>
                      <button
                        onClick={handleShortlist}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedProposal}
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={handleReject}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!selectedProposal}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Proposal
                  </h3>
                  <p className="text-gray-600">
                    Choose a proposal from the list to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalsPage;
