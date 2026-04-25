import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await profileService.getProfile();
      setProfile(profileData);
      const percentage =
        profileService.getProfileCompletionPercentage(profileData);
      setCompletionPercentage(percentage);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-4 sm:p-6">
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
        <div className="mt-4">
          <Link
            to={TALENT_ROUTES.PROFILE.path}
            className="text-xs sm:text-sm text-[#0084ca] hover:text-[#006ba6] hover:underline font-medium transition-colors duration-200"
          >
            Complete your profile →
          </Link>
          <div className="flex items-center justify-between mt-2">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
              <div
                className="bg-gradient-to-r from-[#0084ca] to-[#006ba6] h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
              {completionPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
