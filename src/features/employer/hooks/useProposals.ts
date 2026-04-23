import { useState, useCallback } from "react";
import type { Proposal } from "../types/employer.types";
import {
  fetchAllApplications,
  updateApplicationStatus,
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

      const response = await fetchAllApplications(token);
      console.log("All applications from API:", response);
      const filteredApplications =
        response.applications?.filter((app) => app.job_id === jobId) || [];
      console.log(
        "Filtered applications for job",
        jobId,
        ":",
        filteredApplications,
      );
      setProposals(filteredApplications);
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
