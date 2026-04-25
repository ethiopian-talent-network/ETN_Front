import { useState, useCallback } from "react";
import type { Proposal } from "../types/employer.types";
import {
  fetchAllApplications,
  updateApplicationStatus,
  getApplicationsByJob,
} from "../../../api/employer/employerApi";

export const useProposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProposals = useCallback(async (jobId: number) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const applications = await getApplicationsByJob(token, jobId);
      console.log("Applications for job", jobId, ":", applications);

      // Transform the response to match the Proposal interface
      const transformedProposals = applications.map((app: any) => ({
        id: app.application_id,
        talent_id: app.talent_id || 0,
        talent_name: app.talent_name,
        talent_email: app.email,
        profile_title: "", // Not available in new API response
        hourly_rate: "", // Not available in new API response
        talent_location: "", // Not available in new API response
        cover_letter: app.cover_letter,
        proposal: app.proposal,
        status: app.status,
        applied_at: app.applied_at,
        job_id: jobId,
      }));

      setProposals(transformedProposals);
    } catch (err: any) {
      setError(err.message || "Failed to fetch proposals");
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProposalStatus = useCallback(
    async (applicationId: number, status: string) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        await updateApplicationStatus(
          token,
          applicationId,
          status as
            | "pending"
            | "reviewed"
            | "shortlisted"
            | "rejected"
            | "hired",
        );

        // Update the local proposal status
        setProposals((prev) =>
          prev.map((proposal) =>
            proposal.id === applicationId
              ? { ...proposal, status: status as Proposal["status"] }
              : proposal,
          ),
        );

        return true;
      } catch (err: any) {
        setError(err.message || "Failed to update proposal status");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearProposals = useCallback(() => {
    setProposals([]);
    setError(null);
  }, []);

  return {
    proposals,
    loading,
    error,
    fetchProposals,
    updateProposalStatus,
    clearProposals,
  };
};
