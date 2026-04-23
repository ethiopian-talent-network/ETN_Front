import React from "react";
import { Button } from "../../../components/ui/button";
import type { Job } from "../types/employer.types";

interface JobCardProps {
  job: Job;
  darkMode?: boolean;
  onViewDetails: (job: Job) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onViewProposals: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  darkMode = false,
  onViewDetails,
  onEdit,
  onDelete,
  onViewProposals,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "closed":
        return "bg-red-100 text-red-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={`border rounded-lg p-6 transition-shadow hover:shadow-lg ${
        darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3
            className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {job.title}
          </h3>
          <p
            className={`text-sm mb-3 line-clamp-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            {job.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(job.status)}`}
            >
              {job.status}
            </span>
            {job.category_name && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {job.category_name}
              </span>
            )}
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {job.budget_type === "fixed" ? "Fixed Price" : "Hourly"}
            </span>
            {job.salary && (
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  darkMode
                    ? "bg-blue-900 text-blue-300"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {job.salary}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 ml-4">
          <span
            className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
          >
            Posted {new Date(job.created_at).toLocaleDateString()}
          </span>
          {job.applications_count !== undefined && (
            <div className="flex items-center gap-1">
              <svg
                className={`w-4 h-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <span
                className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {job.applications_count} proposals
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewDetails(job)}
          className={
            darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""
          }
        >
          View Details
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            console.log("View Proposals button clicked for job:", job);
            onViewProposals(job);
          }}
          className={
            darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""
          }
        >
          View Proposals
        </Button>
        <button
          onClick={() => {
            console.log("Test button clicked for job:", job);
            alert("Test button works!");
          }}
          className="px-3 py-1 text-sm border rounded"
        >
          Test
        </button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(job)}
          className={
            darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : ""
          }
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(job)}
          className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          Delete
        </Button>
      </div>
    </div>
  );
};
