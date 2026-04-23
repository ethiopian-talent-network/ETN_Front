import React from 'react';
import type { Contract } from '../types/employer.types';

interface ContractListProps {
  contracts: Contract[];
  loading?: boolean;
  error?: string | null;
  darkMode?: boolean;
  onViewDetails?: (contract: Contract) => void;
}

export const ContractList: React.FC<ContractListProps> = ({
  contracts,
  loading = false,
  error = null,
  darkMode = false,
  onViewDetails,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'disputed':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className={`ml-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Loading contracts...
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
        <h3 className="text-lg font-medium mb-2">Error Loading Contracts</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className={`text-center py-12 px-4 rounded-lg border ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <svg className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          No Contracts Found
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          You don't have any active contracts yet. Start by hiring talents from your job proposals!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contracts.map((contract) => (
        <div
          key={contract.id}
          className={`border rounded-lg p-6 transition-shadow hover:shadow-lg ${
            darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {contract.job_title}
              </h3>
              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Talent: {contract.talent_name}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(contract.status)}`}>
                  {contract.status}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  Started {new Date(contract.start_date).toLocaleDateString()}
                </span>
                {contract.end_date && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    Ends {new Date(contract.end_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ${contract.total_value.toLocaleString()}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Total Value
              </p>
            </div>
          </div>

          {contract.earnings !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Earnings
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  ${contract.earnings.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {contract.progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Project Progress
                </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {contract.progress}%
                </span>
              </div>
              <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${contract.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => onViewDetails?.(contract)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                darkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              View Details
            </button>
            {contract.status === 'active' && (
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Manage Contract
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
