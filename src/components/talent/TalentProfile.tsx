import React, { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Briefcase,
  Globe,
  FileText,
  Plus,
  Loader,
  CheckCircle,
  AlertCircle,
  Link,
} from "lucide-react";
import {
  getTalentProfile,
  updateTalentProfile,
  addSkills,
  getTokenBalance,
  type TalentProfile as TalentProfileType,
  type UpdateProfileData,
} from "../../api/talent/talentApi";
import { ProfileHeader } from "../profile/ProfileHeader";
import type { ProfileData } from "../../types/profile";

interface TalentProfileProps {
  darkMode?: boolean;
}

export const TalentProfile: React.FC<TalentProfileProps> = ({
  darkMode = false,
}) => {
  const [profile, setProfile] = useState<TalentProfileType | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState("");
  const [formData, setFormData] = useState<UpdateProfileData>({});
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [profileResponse, tokenResponse] = await Promise.all([
        getTalentProfile(),
        getTokenBalance(),
      ]);

      setProfile(profileResponse.data);
      setTokenBalance(tokenResponse.balance);

      // Map backend data to ProfileData structure
      const mappedProfileData: ProfileData = {
        name: profileResponse.data.name || "",
        title: profileResponse.data.name || "Talent",
        location: "Not specified",
        hourlyRate: "0",
        bio: profileResponse.data.about || "",
        skills: profileResponse.data.skills || [],
        languages: [],
        education: [],
        certifications: [],
        portfolio: [],
        about: profileResponse.data.about,
        educationText: profileResponse.data.education,
        experience: profileResponse.data.experience,
        languagesText: profileResponse.data.languages,
        linkedin: profileResponse.data.linkedin,
        github: profileResponse.data.github,
        resume_url: profileResponse.data.resume_url,
      };

      setProfileData(mappedProfileData);

      // Calculate completion percentage
      const completedFields = [
        mappedProfileData.name,
        mappedProfileData.title,
        mappedProfileData.location,
        mappedProfileData.hourlyRate,
        mappedProfileData.bio,
      ].filter((field) => field && field.trim().length > 0).length;
      const hasSkills = mappedProfileData.skills.length > 0;
      const hasEducation = !!mappedProfileData.educationText;
      const hasPortfolio = mappedProfileData.portfolio.length > 0;
      const hasLanguages = !!mappedProfileData.languagesText;

      const totalFields = 5 + 4;
      const completedTotal =
        completedFields +
        (hasSkills ? 1 : 0) +
        (hasEducation ? 1 : 0) +
        (hasPortfolio ? 1 : 0) +
        (hasLanguages ? 1 : 0);

      setCompletionPercentage(Math.round((completedTotal / totalFields) * 100));

      setFormData({
        education: profileResponse.data.education || "",
        experience: profileResponse.data.experience || "",
        languages: profileResponse.data.languages || "",
        linkedin: profileResponse.data.linkedin || "",
        github: profileResponse.data.github || "",
        resume_url: profileResponse.data.resume_url || "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (updatedProfile: ProfileData) => {
    setProfileData(updatedProfile);
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    // Placeholder for image upload - implement with actual API
    return URL.createObjectURL(file);
  };

  const handleInputChange = (field: keyof UpdateProfileData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(null);
  };

  const handleSaveProfile = async () => {
    setError(null);
    setSuccess(null);

    try {
      await updateTalentProfile(formData);
      await fetchProfileData(); // Refresh data
      setEditing(false);
      setSuccess("Profile updated successfully");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    }
  };

  const handleAddSkill = async () => {
    if (!newSkill.trim()) return;

    try {
      await addSkills(newSkill.trim());
      setNewSkill("");
      await fetchProfileData(); // Refresh data
      setSuccess("Skill added successfully");

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to add skill");
    }
  };

  const handleCancelEdit = () => {
    if (profile) {
      setFormData({
        education: profile.education || "",
        experience: profile.experience || "",
        languages: profile.languages || "",
        linkedin: profile.linkedin || "",
        github: profile.github || "",
        resume_url: profile.resume_url || "",
      });
    }
    setEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchProfileData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div
      className={`max-w-4xl mx-auto p-6 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white shadow-lg"}`}
    >
      {/* Header */}
      {profileData && (
        <div className="mb-8">
          <ProfileHeader
            profile={profileData}
            isEditing={editing}
            onEdit={() => setEditing(true)}
            onSave={handleSaveProfile}
            onCancel={handleCancelEdit}
            onProfileChange={handleProfileChange}
            onImageUpload={handleImageUpload}
            completionPercentage={completionPercentage}
            darkMode={darkMode}
          />
          {/* Token Balance */}
          <div
            className={`mt-4 px-4 py-2 rounded-lg inline-block ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}
          >
            <div
              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
            >
              Token Balance
            </div>
            <div
              className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              {tokenBalance}
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            {success}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {error}
          </p>
        </div>
      )}

      {/* Profile Content - Single Column Layout */}
      <div className="space-y-8">
        {/* Overview Section */}
        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Overview
          </h3>
          <div className="space-y-6">
            {/* Education */}
            <div>
              <label
                className={`flex items-center text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Education
              </label>
              {editing ? (
                <textarea
                  value={formData.education || ""}
                  onChange={(e) =>
                    handleInputChange("education", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  rows={3}
                  placeholder="Enter your education details..."
                />
              ) : (
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {profile.education || "Not specified"}
                </p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label
                className={`flex items-center text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Experience
              </label>
              {editing ? (
                <textarea
                  value={formData.experience || ""}
                  onChange={(e) =>
                    handleInputChange("experience", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  rows={4}
                  placeholder="Describe your work experience..."
                />
              ) : (
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {profile.experience || "Not specified"}
                </p>
              )}
            </div>

            {/* Languages */}
            <div>
              <label
                className={`flex items-center text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}
              >
                <Globe className="w-4 h-4 mr-2" />
                Languages
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.languages || ""}
                  onChange={(e) =>
                    handleInputChange("languages", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  placeholder="e.g., English, Spanish, French"
                />
              ) : (
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {profile.languages || "Not specified"}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div>
          <h3
            className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Links & Portfolio
          </h3>
          <div className="space-y-6">
            {/* LinkedIn */}
            <div>
              <label
                className={`flex items-center text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}
              >
                <Link className="w-4 h-4 mr-2" />
                LinkedIn Profile
              </label>
              {editing ? (
                <input
                  type="url"
                  value={formData.linkedin || ""}
                  onChange={(e) =>
                    handleInputChange("linkedin", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              ) : (
                <a
                  href={profile.linkedin || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block ${profile.linkedin ? "text-blue-600 hover:text-blue-800" : darkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  {profile.linkedin || "Not specified"}
                </a>
              )}
            </div>

            {/* GitHub */}
            <div>
              <label
                className={`flex items-center text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}
              >
                <Link className="w-4 h-4 mr-2" />
                GitHub Profile
              </label>
              {editing ? (
                <input
                  type="url"
                  value={formData.github || ""}
                  onChange={(e) => handleInputChange("github", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  placeholder="https://github.com/yourusername"
                />
              ) : (
                <a
                  href={profile.github || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block ${profile.github ? "text-blue-600 hover:text-blue-800" : darkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  {profile.github || "Not specified"}
                </a>
              )}
            </div>

            {/* Resume URL */}
            <div>
              <label
                className={`flex items-center text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Resume URL
              </label>
              {editing ? (
                <input
                  type="url"
                  value={formData.resume_url || ""}
                  onChange={(e) =>
                    handleInputChange("resume_url", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300"
                  }`}
                  placeholder="https://example.com/resume.pdf"
                />
              ) : (
                <a
                  href={profile.resume_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block ${profile.resume_url ? "text-blue-600 hover:text-blue-800" : darkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  {profile.resume_url || "Not specified"}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3
          className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          Skills
        </h3>

        <div className="space-y-6">
          {/* Skills Display */}
          <div>
            <label
              className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2 block`}
            >
              Your Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm ${
                    darkMode
                      ? "bg-blue-900 text-blue-200"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {skill}
                </span>
              ))}
              {profile.skills.length === 0 && (
                <p
                  className={`${darkMode ? "text-gray-500" : "text-gray-400"}`}
                >
                  No skills added yet
                </p>
              )}
            </div>
          </div>

          {/* Add Skill */}
          <div>
            <label
              className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"} mb-2 block`}
            >
              Add New Skill
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
                placeholder="Enter a skill name..."
              />
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
