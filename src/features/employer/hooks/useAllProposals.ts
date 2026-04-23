import { useState, useCallback } from "react";
import type { Proposal } from "../types/employer.types";
import {
  fetchAllApplications,
  updateApplicationStatus,
} from "../../../api/employer/employerApi";

export const useAllProposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    has_next_page: false,
    has_prev_page: false,
  });

  const fetchAllProposals = useCallback(
    async (
      page: number = 1,
      limit: number = 10,
      status?: string,
      search?: string,
    ) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const response = await fetchAllApplications(token, {
          page,
          limit,
          status,
          search,
        });
        setProposals(response.applications || []);
        setPagination(response.pagination);
      } catch (err: any) {
        setError(err.message || "Failed to fetch proposals");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateProposalStatus = useCallback(
    async (applicationId: number, status: string) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        await updateApplicationStatus(token, applicationId, status);

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

  const refreshProposals = useCallback(() => {
    return fetchAllProposals(pagination.page, pagination.limit);
  }, [fetchAllProposals, pagination.page, pagination.limit]);

  return {
    proposals,
    loading,
    error,
    pagination,
    fetchAllProposals,
    updateProposalStatus,
    refreshProposals,
  };
};
