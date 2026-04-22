import { API_BASE_URL } from "../../config/api";

export interface Job {
  id: number;
  title: string;
  description: string;
  category_id: number;
  category_name?: string;
  experience_level: string;
  salary: string;
  budget_type: string;
  duration: string;
  location: string;
  remote_allowed: boolean;
  employer_id: number;
  status: "active" | "draft" | "closed" | "paused";
  created_at: string;
  updated_at?: string;
  applications_count?: number;
  skills?: number[];
}

export interface JobFormData {
  title: string;
  description: string;
  category_id: number;
  experience_level: string;
  salary: string;
  budget_type: string;
  duration: string;
  location: string;
  remote_allowed: boolean;
  skills?: number[];
}

export interface JobResponse {
  message: string;
  job?: Job;
  jobs?: Job[];
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

export interface Applicant {
  id: number;
  talent_id: number;
  talent_name: string;
  talent_email: string;
  profile_title?: string;
  hourly_rate?: string;
  talent_location?: string;
  profile_image?: string;
  cover_letter: string;
  proposal?: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
  applied_at: string;
  tokens_used: number;
}

export interface ApplicationsResponse {
  message: string;
  applications: Applicant[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    pages: number;
  };
}

// Create a new job
export const createJob = async (
  token: string,
  jobData: JobFormData,
): Promise<JobResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/jobs/employer/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create job");
  }

  return response.json();
};

// Get employer's jobs
export const getEmployerJobs = async (
  token: string,
  options?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  },
): Promise<JobResponse> => {
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
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch jobs");
  }

  return response.json();
};

// Update a job
export const updateJob = async (
  token: string,
  jobId: number,
  jobData: Partial<JobFormData>,
): Promise<JobResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/api/jobs/employer/jobs/${jobId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobData),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update job");
  }

  return response.json();
};

// Delete a job
export const deleteJob = async (
  token: string,
  jobId: number,
): Promise<{ message: string }> => {
  const response = await fetch(
    `${API_BASE_URL}/api/jobs/employer/jobs/${jobId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete job");
  }

  return response.json();
};

// Get applications for a specific job
export const getJobApplications = async (
  token: string,
  jobId: number,
  options?: {
    page?: number;
    limit?: number;
    status?: string;
  },
): Promise<ApplicationsResponse> => {
  const params = new URLSearchParams();

  if (options?.page) params.append("page", options.page.toString());
  if (options?.limit) params.append("limit", options.limit.toString());
  if (options?.status && options.status !== "all")
    params.append("status", options.status);

  const response = await fetch(
    `${API_BASE_URL}/api/jobs/employer/jobs/${jobId}/applications?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch applications");
  }

  return response.json();
};

// Update application status
export const updateApplicationStatus = async (
  token: string,
  applicationId: number,
  status: Applicant["status"],
): Promise<{ message: string }> => {
  const response = await fetch(
    `${API_BASE_URL}/api/jobs/employer/applications/${applicationId}/status`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update application status");
  }

  return response.json();
};
