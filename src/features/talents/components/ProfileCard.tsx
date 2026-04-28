import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { useAuth } from "../../../contexts/AuthContext";
import { profileService } from "../../../api/profile/profileService";
import { TALENT_ROUTES } from "../../../config/routes";
import type { ProfileData } from "../../../types/profile";

interface ProfileCardProps {
  darkMode: boolean;
}

export function ProfileCard({ darkMode }: ProfileCardProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [missingFields, setMissingFields] = useState<{
    basic: string[];
    sections: string[];
  }>({ basic: [], sections: [] });
  const [showMissingDetails, setShowMissingDetails] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (forceRefresh = false) => {
    try {
      // Show cached data instantly if available
      const cached = profileService.getCachedProfile();
      if (cached) {
        setProfile(cached);
        setCompletionPercentage(profileService.getProfileCompletionPercentage(cached));
        setMissingFields(profileService.getMissingFields(cached));
        setLoading(false);
      }
      // Always fetch fresh data in background
      const profileData = await profileService.getProfile(forceRefresh);
      setProfile(profileData);
      setCompletionPercentage(profileService.getProfileCompletionPercentage(profileData));
      setMissingFields(profileService.getMissingFields(profileData));
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile(false);
  }, [loadProfile]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="lg:col-span-1 order-first lg:order-last">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700 shadow-sm p-4 sm:p-6">
          <div className="animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1 order-first lg:order-last">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#0084ca] to-[#006ba6] rounded-full flex items-center justify-center flex-shrink-0 shadow-inner overflow-hidden">
            {profile?.image || profile?.profile_image ? (
              <img
                src={profile?.image || profile?.profile_image}
                alt={profile?.name || user?.name || "User"}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-white text-base font-bold">
                {profile?.name
                  ? getInitials(profile.name)
                  : user?.name
                    ? getInitials(user.name)
                    : "AK"}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
              {profile?.name || user?.name || "User"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
              {profile?.title || "Complete your profile to add a title"}
            </p>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {/* Profile Completion Message */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p
                className={`text-xs sm:text-sm font-medium ${
                  completionPercentage === 100
                    ? "text-green-600 dark:text-green-400"
                    : completionPercentage >= 75
                      ? "text-blue-600 dark:text-blue-400"
                      : completionPercentage >= 50
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-orange-600 dark:text-orange-400"
                }`}
              >
                {completionPercentage === 100
                  ? "🎉 Profile Complete!"
                  : completionPercentage >= 75
                    ? "Almost there!"
                    : completionPercentage >= 50
                      ? "Good progress!"
                      : "Just getting started"}
              </p>
              <p
                className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"} mt-1`}
              >
                {completionPercentage === 100
                  ? "Your profile is fully optimized"
                  : completionPercentage >= 75
                    ? "Add a few more details to reach 100%"
                    : completionPercentage >= 50
                      ? "Keep filling in your profile details"
                      : "Complete your profile to attract clients"}
              </p>
            </div>
            <div className="ml-3">
              <span
                className={`text-lg font-bold ${
                  completionPercentage === 100
                    ? "text-green-600 dark:text-green-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {completionPercentage}%
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center justify-between">
            <div className="flex-1 bg-slate-200 dark:bg-gray-700 rounded-full h-2 mr-3">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  completionPercentage === 100
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : completionPercentage >= 75
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : completionPercentage >= 50
                        ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                        : "bg-gradient-to-r from-orange-500 to-orange-600"
                }`}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Action Links */}
          <div className="space-y-2">
            {completionPercentage < 100 && (
              <Link
                to={TALENT_ROUTES.PROFILE.path}
                className={`block text-xs sm:text-sm hover:underline font-medium transition-colors duration-200 ${
                  completionPercentage >= 75
                    ? "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    : "text-[#0084ca] hover:text-[#006ba6]"
                }`}
              >
                {completionPercentage >= 75
                  ? "Finalize your profile →"
                  : completionPercentage >= 50
                    ? "Continue building profile →"
                    : "Complete your profile →"}
              </Link>
            )}
            <Link
              to={TALENT_ROUTES.PORTFOLIO.path}
              className="block text-xs sm:text-sm text-[#0084ca] hover:text-[#006ba6] hover:underline font-medium transition-colors duration-200"
            >
              Manage Portfolio & Skills →
            </Link>

            {/* Missing Fields Toggle */}
            {completionPercentage < 100 && (
              <button
                onClick={() => setShowMissingDetails(!showMissingDetails)}
                className={`block text-xs sm:text-sm hover:underline font-medium transition-colors duration-200 ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-600"
                }`}
              >
                {showMissingDetails ? "Hide" : "Show"} what's missing
              </button>
            )}

            {/* Missing Fields Details */}
            {showMissingDetails && completionPercentage < 100 && (
              <div
                className={`mt-3 p-3 rounded-lg ${darkMode ? "bg-gray-700" : "bg-slate-100 border border-slate-200"}`}
              >
                <p
                  className={`text-xs font-semibold mb-2 ${darkMode ? "text-gray-200" : "text-gray-700"}`}
                >
                  Missing fields:
                </p>
                {missingFields.basic.length > 0 && (
                  <div className="mb-2">
                    <p
                      className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Basic Info:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {missingFields.basic.map((field) => (
                        <span
                          key={field}
                          className={`px-2 py-0.5 text-xs rounded ${
                            darkMode
                              ? "bg-orange-900 text-orange-200"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {missingFields.sections.length > 0 && (
                  <div>
                    <p
                      className={`text-xs font-medium mb-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                    >
                      Sections:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {missingFields.sections.map((section) => (
                        <span
                          key={section}
                          className={`px-2 py-0.5 text-xs rounded ${
                            darkMode
                              ? "bg-blue-900 text-blue-200"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {section}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {missingFields.basic.length === 0 &&
                  missingFields.sections.length === 0 && (
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      All fields are complete!
                    </p>
                  )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
