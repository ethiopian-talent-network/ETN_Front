import React from "react";
import type { Talent } from "../types/employer.types";

interface TalentListProps {
  talents: Talent[];
  loading?: boolean;
  error?: string | null;
  darkMode?: boolean;
  onInviteTalent?: (talent: Talent) => void;
  onViewProfile?: (talentId: number) => void;
}

export const TalentList: React.FC<TalentListProps> = ({
  talents,
  loading = false,
  error = null,
  darkMode = false,
  onInviteTalent,
  onViewProfile,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span
          className={`ml-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
        >
          Loading talents...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`text-center py-12 px-4 rounded-lg border ${
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
        <h3 className="text-lg font-medium mb-2">Error Loading Talents</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (talents.length === 0) {
    return (
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
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <h3
          className={`text-lg font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          No Talents Found
        </h3>
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          No talents are available at the moment. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {talents.map((talent) => (
        <div
          key={talent.id}
          className={`border rounded-lg p-6 transition-shadow hover:shadow-lg ${
            darkMode
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <div
            className="flex items-center gap-4 mb-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onViewProfile?.(talent.id)}
          >
            {talent.profile_image ? (
              <img
                src={talent.profile_image}
                alt={talent.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <span
                  className={`text-lg font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {talent.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3
                className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"} hover:underline`}
              >
                {talent.name}
              </h3>
              <p
                className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
              >
                {talent.email}
              </p>
              {talent.profile_title && (
                <p
                  className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  {talent.profile_title}
                </p>
              )}
            </div>
          </div>

          {talent.hourly_rate && (
            <div className="flex items-center gap-2 mb-3">
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <span
                className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                ${talent.hourly_rate}/hour
              </span>
            </div>
          )}

          {talent.location && (
            <div className="flex items-center gap-2 mb-3">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span
                className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              >
                {talent.location}
              </span>
            </div>
          )}

          {talent.skills && talent.skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {talent.skills.slice(0, 3).map((skill, index) => (
                  <span
                    key={index}
                    className={`text-xs px-2 py-1 rounded-full ${
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {skill}
                  </span>
                ))}
                {talent.skills.length > 3 && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      darkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    +{talent.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {onInviteTalent && (
            <button
              onClick={() => onInviteTalent(talent)}
              className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                darkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Invite to Apply
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
