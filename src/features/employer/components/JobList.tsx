import React from 'react';
import { JobCard } from './JobCard';
import type { Job } from '../types/employer.types';

interface JobListProps {
  jobs: Job[];
  loading?: boolean;
  error?: string | null;
  darkMode?: boolean;
  onViewDetails: (job: Job) => void;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
  onViewProposals: (job: Job) => void;
}

export const JobList: React.FC<JobListProps> = ({
  jobs,
  loading = false,
  error = null,
  darkMode = false,
  onViewDetails,
  onEdit,
  onDelete,
  onViewProposals,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className={`ml-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Loading jobs...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-12 px-4 rounded-lg border ${
        darkMode ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600'
      }`}>
        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-medium mb-2">Error Loading Jobs</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className={`text-center py-12 px-4 rounded-lg border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <svg className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A8.001 8.001 0 0012 5.078M21 13.255A8.001 8.001 0 0112 21.432M21 13.255A8.001 8.001 0 0012 5.078M21 13.255A8.001 8.001 0 0112 21.432" />
        </svg>
        <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          No Jobs Found
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          You haven't posted any jobs yet. Create your first job to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          darkMode={darkMode}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
          onDelete={onDelete}
          onViewProposals={onViewProposals}
        />
      ))}
    </div>
  );
};
