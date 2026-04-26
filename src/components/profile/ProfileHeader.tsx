import { useState } from "react";
import { Camera, MapPin, DollarSign, Edit3, Save, X, Loader } from "lucide-react";
import type { ProfileData } from "../../types/profile";
import { ProfileActions } from "./profileAction";

interface ProfileHeaderProps {
  profile: ProfileData;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onProfileChange: (p: ProfileData) => void;
  onImageUpload: (file: File) => Promise<string>;
  completionPercentage: number;
  darkMode: boolean;
}

export function ProfileHeader({
  profile,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onProfileChange,
  onImageUpload,
  completionPercentage,
  darkMode,
}: ProfileHeaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleChange = (field: keyof ProfileData, value: string) => {
    onProfileChange({ ...profile, [field]: value });
  };

  const handleFileChange = async (file: File) => {
    if (!file) return;
    try {
      setUploading(true);
      const url = await onImageUpload(file);
      onProfileChange({ ...profile, image: url });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;
  const completionColor =
    completionPercentage === 100 ? "#22c55e" :
    completionPercentage >= 75 ? "#3b82f6" :
    completionPercentage >= 50 ? "#f59e0b" : "#f97316";

  return (
    <div className={`relative rounded-2xl overflow-hidden ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100 shadow-sm"}`}>
      {/* Banner */}
      <div className="h-28 bg-gradient-to-r from-[#0084ca] via-[#0099e6] to-[#006ba6] relative">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
      </div>

      <div className="px-6 pb-6">
        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-12 mb-4">
          <div className="relative">
            {/* Completion ring */}
            <svg className="absolute -inset-1.5 w-[88px] h-[88px] -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke={darkMode ? "#374151" : "#e5e7eb"} strokeWidth="3" />
              <circle cx="32" cy="32" r="28" fill="none" stroke={completionColor} strokeWidth="3"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                strokeLinecap="round" style={{ transition: "stroke-dashoffset 0.6s ease" }}
              />
            </svg>
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 bg-gradient-to-br from-[#0084ca] to-[#006ba6] flex items-center justify-center shadow-md">
              {uploading ? (
                <Loader className="w-6 h-6 text-white animate-spin" />
              ) : profile.image ? (
                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-xl font-bold">{getInitials(profile.name || "U")}</span>
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 w-7 h-7 bg-[#0084ca] hover:bg-[#006ba6] text-white rounded-full flex items-center justify-center cursor-pointer shadow-md transition-colors">
                <Camera className="w-3.5 h-3.5" />
                <input type="file" className="hidden" accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])} />
              </label>
            )}
          </div>

          {/* Completion badge + actions */}
          <div className="flex items-center gap-3 mb-1">
            <div className="text-right">
              <div className="text-xs font-medium" style={{ color: completionColor }}>
                {completionPercentage === 100 ? "Complete ✓" : `${completionPercentage}% complete`}
              </div>
              <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                {completionPercentage < 100 ? "Fill in missing fields" : "Profile fully optimized"}
              </div>
            </div>
            <ProfileActions isEditing={isEditing} uploading={uploading} onEdit={onEdit} onSave={onSave} onCancel={onCancel} />
          </div>
        </div>

        {/* Name & title */}
        <div className="space-y-1 mb-3">
          {isEditing ? (
            <div className="space-y-2">
              <input value={profile.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`text-2xl font-bold w-full bg-transparent border-b-2 border-[#0084ca] outline-none pb-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}
                placeholder="Your full name"
              />
              <input value={profile.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={`text-sm w-full bg-transparent border-b border-gray-300 outline-none pb-0.5 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                placeholder="Your professional title"
              />
            </div>
          ) : (
            <>
              <h2 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>{profile.name || "Your Name"}</h2>
              <p className={`text-sm font-medium ${darkMode ? "text-[#60b4e8]" : "text-[#0084ca]"}`}>{profile.title || "Add your title"}</p>
            </>
          )}
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {isEditing ? (
            <>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${darkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`}>
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <input value={profile.location} onChange={(e) => handleChange("location", e.target.value)}
                  className={`bg-transparent outline-none w-28 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  placeholder="Location" />
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm ${darkMode ? "border-gray-600 bg-gray-700" : "border-gray-200 bg-gray-50"}`}>
                <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                <input value={profile.hourlyRate} onChange={(e) => handleChange("hourlyRate", e.target.value)}
                  className={`bg-transparent outline-none w-16 text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  placeholder="Rate" />
                <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>/hr</span>
              </div>
            </>
          ) : (
            <>
              {profile.location && (
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                  <MapPin className="w-3 h-3" />{profile.location}
                </span>
              )}
              {profile.hourlyRate && profile.hourlyRate !== "0" && (
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"}`}>
                  <DollarSign className="w-3 h-3" />${profile.hourlyRate}/hr
                </span>
              )}
            </>
          )}
        </div>

        {/* About */}
        <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-700/50" : "bg-gray-50"}`}>
          <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>About</h4>
          {isEditing ? (
            <textarea value={profile.bio} onChange={(e) => handleChange("bio", e.target.value)}
              className={`w-full bg-transparent outline-none text-sm leading-relaxed resize-none ${darkMode ? "text-gray-300" : "text-gray-700"}`}
              rows={3} placeholder="Write a short bio about yourself..." />
          ) : (
            <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {profile.bio || <span className="italic text-gray-400">No bio added yet. Click Edit to add one.</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
