import { useState } from "react";
import { Camera } from "lucide-react";
import type { ProfileData } from "../../types/profile";
import { ProfileActions } from "./profileAction";
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
}: {
  profile: ProfileData;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onProfileChange: (p: ProfileData) => void;
  onImageUpload: (file: File) => Promise<string>;
  completionPercentage: number;
  darkMode: boolean;
}) {
  const [uploading, setUploading] = useState(false);

  const handleChange = (field: keyof ProfileData, value: string) => {
    onProfileChange({ ...profile, [field]: value });
  };

  const handleFileChange = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);
      const url = await onImageUpload(file);

      onProfileChange({
        ...profile,
        image: url,
      });
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border rounded-xl p-4 sm:p-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 sm:gap-6">
        {/* LEFT SIDE */}
        <div className="flex gap-3 sm:gap-5">
          {/* AVATAR */}
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-gray-200">
              {uploading ? (
                <div className="flex items-center justify-center h-full text-sm">
                  Uploading...
                </div>
              ) : (
                <img
                  src={profile.image || "https://via.placeholder.com/150"}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-black text-white p-1.5 sm:p-2 rounded-full cursor-pointer">
                <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files?.[0] && handleFileChange(e.target.files[0])
                  }
                />
              </label>
            )}
          </div>

          {/* INFO */}
          <div className="space-y-1.5 sm:space-y-2">
            {isEditing ? (
              <>
                <input
                  value={profile.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="text-xl sm:text-2xl font-semibold border-b outline-none w-full"
                />

                <input
                  value={profile.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="text-sm sm:text-base text-gray-600 border-b outline-none w-full"
                />
              </>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-semibold">
                  {profile.name}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {profile.title}
                </p>
              </>
            )}

            {/* META */}
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-1">
                📍 {profile.location}
              </div>

              <div className="flex items-center gap-1 font-medium text-gray-800 dark:text-gray-200">
                💰 ${profile.hourlyRate}/hr
              </div>
            </div>
          </div>
        </div>

        <ProfileActions
          isEditing={isEditing}
          uploading={uploading}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
        />
      </div>

      {/* ABOUT */}
      <div className="mt-4 sm:mt-6 border-t pt-4 sm:pt-6">
        <h4 className="font-semibold mb-2 text-sm sm:text-base">About</h4>

        {isEditing ? (
          <textarea
            value={profile.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            className="w-full border rounded-lg p-2 sm:p-3 text-sm"
            rows={4}
          />
        ) : (
          <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
            {profile.bio || "No bio added yet"}
          </p>
        )}
      </div>
    </div>
  );
}
