import { Edit, Save, X } from "lucide-react";

type Props = {
  isEditing: boolean;
  uploading?: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
};

export function ProfileActions({
  isEditing,
  uploading = false,
  onEdit,
  onSave,
  onCancel,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      {/* VIEW MODE */}
      {!isEditing && (
        <button
          onClick={onEdit}
          className="
            px-4 py-2 text-sm font-medium
            border border-gray-200 dark:border-gray-700
            rounded-full
            hover:bg-gray-100 dark:hover:bg-gray-800
            transition flex items-center gap-2
          "
        >
          <Edit className="w-4 h-4" />
          Edit Profile
        </button>
      )}

      {/* EDIT MODE */}
      {isEditing && (
        <div
          className="
            flex items-center gap-1
            bg-gray-50 dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            rounded-full p-1 shadow-sm
          "
        >
          {/* CANCEL */}
          <button
            onClick={onCancel}
            className="
              px-3 py-1.5 text-sm
              text-gray-600 dark:text-gray-300
              hover:text-black dark:hover:text-white
              transition
            "
          >
            <X className="w-4 h-4 inline mr-1" />
            Cancel
          </button>

          {/* DIVIDER */}
          <div className="w-px h-5 bg-gray-300 dark:bg-gray-600" />

          {/* SAVE (PRIMARY) */}
          <button
            onClick={onSave}
            disabled={uploading}
            className="
              px-4 py-1.5 text-sm font-medium
              bg-black text-white
              rounded-full
              hover:bg-gray-800
              disabled:opacity-50
              transition
              flex items-center gap-2
            "
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      )}
    </div>
  );
}
