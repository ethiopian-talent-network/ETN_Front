import { API_BASE_URL } from "../../config/api";

import type {
  Proposal,
  Job,
  JobFormData,
} from "../../features/employer/types/employer.types";

// API function for fetching all applications
export const fetchAllApplications = async (
  token: string,
  options?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  },
) => {
  const params = new URLSearchParams();
  if (options?.page) params.append("page", options.page.toString());
  if (options?.limit) params.append("limit", options.limit.toString());
  if (options?.status && options.status !== "all")
    params.append("status", options.status);
  if (options?.search) params.append("search", options.search);

  const response = await fetch(
    `${API_BASE_URL}/api/employer/applications?${params}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch applications: ${response.statusText}`);
  }

  const data = await response.json();

  // Transform the API response to match the Proposal interface
  const applications: Proposal[] = data.applications.map((app: any) => ({
    id: app.id,
    talent_id: app.talent_id,
    talent_name: app.talent_name,
    talent_email: app.talent_email,
    profile_title: "", // Not available in current API response
    hourly_rate: "", // Not available in current API response
    talent_location: "", // Not available in current API response
    profile_image: "", // Not available in current API response
    cover_letter: app.cover_letter,
    proposal: app.proposal || "",
    status: app.status,
    applied_at: app.applied_at,
    tokens_used: app.tokens_used || 0,
    job_id: app.job_id,
  }));

  return {
    message: data.message,
    applications,
    pagination: data.pagination,
  };
};

// API function for updating status
export const updateApplicationStatus = async (
  token: string,
  applicationId: number,
  status: string,
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/employer/applications/${applicationId}/status`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to update status: ${response.statusText}`);
  }

  return await response.json();
};

// API function for fetching employer jobs
export const getEmployerJobs = async (
  token: string,
  options?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  },
) => {
  const params = new URLSearchParams();
  if (options?.page) params.append("page", options.page.toString());
  if (options?.limit) params.append("limit", options.limit.toString());
  if (options?.status && options.status !== "all")
    params.append("status", options.status);
  if (options?.search) params.append("search", options.search);

  const response = await fetch(
    `${API_BASE_URL}/api/jobs/employer/jobs?${params}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch jobs: ${response.statusText}`);
  }

  return await response.json();
};

// API function for creating a job
export const createJob = async (token: string, jobData: JobFormData) => {
  const response = await fetch(`${API_BASE_URL}/api/jobs/employer/jobs`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create job: ${response.statusText}`);
  }

  return await response.json();
};

// API function for updating a job
export const updateJob = async (
  token: string,
  jobId: number,
  jobData: Partial<JobFormData>,
) => {
  const response = await fetch(
    `${API_BASE_URL}/api/jobs/employer/jobs/${jobId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jobData),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to update job: ${response.statusText}`);
  }

  return await response.json();
};

// API function for deleting a job
export const deleteJob = async (token: string, jobId: number) => {
  const response = await fetch(
    `${API_BASE_URL}/api/jobs/employer/jobs/${jobId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to delete job: ${response.statusText}`);
  }

  return await response.json();
};
