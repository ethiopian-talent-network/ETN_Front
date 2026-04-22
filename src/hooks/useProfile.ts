import { useState, useEffect, useCallback } from "react";
import { profileService } from "../api/profile/profileService";
import type {
  ProfileData,
  ProfileStats,
  ProfileSection,
  Education,
  Certification,
  Portfolio,
  Language,
} from "../types/profile";

export interface UseProfileReturn {
  // Profile data
  profile: ProfileData | null;
  stats: ProfileStats | null;
  loading: boolean;
  error: string | null;

  // Editing state
  isEditing: boolean;
  activeSection: ProfileSection;

  // Form states
  newSkill: string;
  newPortfolioItem: Omit<Portfolio, "id">;
  newEducation: Omit<Education, "id">;
  newCertification: Omit<Certification, "id">;

  // UI states
  showAddPortfolio: boolean;
  showAddEducation: boolean;
  showAddCertification: boolean;

  // Actions
  setIsEditing: (editing: boolean) => void;
  setActiveSection: (section: ProfileSection) => void;
  setNewSkill: (skill: string) => void;
  setNewPortfolioItem: (item: Omit<Portfolio, "id">) => void;
  setNewEducation: (education: Omit<Education, "id">) => void;
  setNewCertification: (certification: Omit<Certification, "id">) => void;
  setShowAddPortfolio: (show: boolean) => void;
  setShowAddEducation: (show: boolean) => void;
  setShowAddCertification: (show: boolean) => void;

  // Profile operations
  loadProfile: () => Promise<void>;
  saveProfile: (data: Partial<ProfileData>) => Promise<void>;
  uploadImage: (file: File) => Promise<{ imageUrl: string }>;

  // Skills operations
  addSkill: () => Promise<void>;
  addSpecificSkill: (skill: string) => Promise<void>;
  removeSkill: (skill: string) => Promise<void>;

  // Portfolio operations
  addPortfolioItem: () => Promise<void>;
  removePortfolioItem: (itemId: number) => Promise<void>;

  // Education operations
  addEducation: () => Promise<void>;
  removeEducation: (itemId: number) => Promise<void>;

  // Certification operations
  addCertification: () => Promise<void>;
  removeCertification: (itemId: number) => Promise<void>;

  // Languages operations
  updateLanguages: (languages: Language[]) => Promise<void>;

  // Document operations
  uploadDocument: (
    file: File,
    type: "certificate" | "transcript",
    itemId: number,
  ) => Promise<void>;

  // Utility
  getCompletionPercentage: () => number;
  validateProfile: (data: Partial<ProfileData>) => {
    isValid: boolean;
    errors: string[];
  };
  isProfileEmpty: () => boolean;
  refreshProfile: () => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  // State
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] =
    useState<ProfileSection>("overview");

  // Form states
  const [newSkill, setNewSkill] = useState("");
  const [newPortfolioItem, setNewPortfolioItem] = useState<
    Omit<Portfolio, "id">
  >({
    title: "",
    description: "",
    image: "",
    url: "",
  });
  const [newEducation, setNewEducation] = useState<Omit<Education, "id">>({
    degree: "",
    school: "",
    year: "",
  });
  const [newCertification, setNewCertification] = useState<
    Omit<Certification, "id">
  >({
    name: "",
    issuer: "",
    year: "",
  });

  // UI states
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);
  const [showAddEducation, setShowAddEducation] = useState(false);
  const [showAddCertification, setShowAddCertification] = useState(false);

  // Load profile data
  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [profileData, statsData] = await Promise.all([
        profileService.getProfile(),
        profileService.getProfileStats(),
      ]);

      setProfile(profileData);
      setStats(statsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load profile";
      setError(errorMessage);
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save profile
  const saveProfile = useCallback(async (data: Partial<ProfileData>) => {
    try {
      setError(null);
      const updatedProfile = await profileService.updateProfile(data);
      setProfile(updatedProfile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save profile";
      setError(errorMessage);
      console.error("Error saving profile:", err);
      throw err;
    }
  }, []);

  // Upload image
  const uploadImage = useCallback(async (file: File) => {
    try {
      setError(null);
      const result = await profileService.uploadProfileImage(file);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload image";
      setError(errorMessage);
      console.error("Error uploading image:", err);
      throw err;
    }
  }, []);

  // Skills operations
  const addSkill = useCallback(async () => {
    if (!newSkill.trim()) return;

    try {
      setError(null);
      const updatedProfile = await profileService.addSkill(newSkill.trim());
      setProfile(updatedProfile);
      setNewSkill("");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add skill";
      setError(errorMessage);
      console.error("Error adding skill:", err);
    }
  }, [newSkill]);

  const addSpecificSkill = useCallback(async (skill: string) => {
    if (!skill.trim()) return;

    try {
      setError(null);
      const updatedProfile = await profileService.addSkill(skill.trim());
      setProfile(updatedProfile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add skill";
      setError(errorMessage);
      console.error("Error adding skill:", err);
    }
  }, []);

  const removeSkill = useCallback(async (skill: string) => {
    try {
      setError(null);
      const updatedProfile = await profileService.removeSkill(skill);
      setProfile(updatedProfile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove skill";
      setError(errorMessage);
      console.error("Error removing skill:", err);
    }
  }, []);

  // Portfolio operations
  const addPortfolioItem = useCallback(async () => {
    if (!newPortfolioItem.title.trim()) return;

    try {
      setError(null);
      const updatedProfile = await profileService.addPortfolioItem({
        ...newPortfolioItem,
        image:
          newPortfolioItem.image ||
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
      });
      setProfile(updatedProfile);
      setNewPortfolioItem({ title: "", description: "", url: "", image: "" });
      setShowAddPortfolio(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add portfolio item";
      setError(errorMessage);
      console.error("Error adding portfolio item:", err);
    }
  }, [newPortfolioItem]);

  const removePortfolioItem = useCallback(async (id: number) => {
    try {
      setError(null);
      const updatedProfile = await profileService.removePortfolioItem(id);
      setProfile(updatedProfile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove portfolio item";
      setError(errorMessage);
      console.error("Error removing portfolio item:", err);
    }
  }, []);

  // Education operations
  const addEducation = useCallback(async () => {
    if (
      !newEducation.degree.trim() ||
      !newEducation.school.trim() ||
      !newEducation.year.trim()
    )
      return;

    try {
      setError(null);
      const updatedProfile = await profileService.addEducation(newEducation);
      setProfile(updatedProfile);
      setNewEducation({ degree: "", school: "", year: "" });
      setShowAddEducation(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add education";
      setError(errorMessage);
      console.error("Error adding education:", err);
    }
  }, [newEducation]);

  const removeEducation = useCallback(async (id: number) => {
    try {
      setError(null);
      const updatedProfile = await profileService.removeEducation(id);
      setProfile(updatedProfile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove education";
      setError(errorMessage);
      console.error("Error removing education:", err);
    }
  }, []);

  // Certification operations
  const addCertification = useCallback(async () => {
    if (
      !newCertification.name.trim() ||
      !newCertification.issuer.trim() ||
      !newCertification.year.trim()
    )
      return;

    try {
      setError(null);
      const updatedProfile =
        await profileService.addCertification(newCertification);
      setProfile(updatedProfile);
      setNewCertification({ name: "", issuer: "", year: "" });
      setShowAddCertification(false);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to add certification";
      setError(errorMessage);
      console.error("Error adding certification:", err);
    }
  }, [newCertification]);

  const removeCertification = useCallback(async (id: number) => {
    try {
      setError(null);
      const updatedProfile = await profileService.removeCertification(id);
      setProfile(updatedProfile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove certification";
      setError(errorMessage);
      console.error("Error removing certification:", err);
    }
  }, []);

  // Document operations
  const uploadDocument = useCallback(
    async (file: File, type: "certificate" | "transcript", itemId: number) => {
      try {
        setError(null);
        const updatedProfile = await profileService.uploadDocument(
          file,
          type,
          itemId,
        );
        setProfile(updatedProfile);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to upload document";
        setError(errorMessage);
        console.error("Error uploading document:", err);
      }
    },
    [],
  );

  // Languages operations
  const updateLanguages = useCallback(async (languages: Language[]) => {
    try {
      setError(null);
      const updatedProfile = await profileService.updateLanguages(languages);
      setProfile(updatedProfile);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update languages";
      setError(errorMessage);
      console.error("Error updating languages:", err);
    }
  }, []);

  // Utility methods
  const getCompletionPercentage = useCallback(() => {
    if (!profile) return 0;
    return profileService.getProfileCompletionPercentage(profile);
  }, [profile]);

  const validateProfile = useCallback((data: Partial<ProfileData>) => {
    return profileService.validateProfile(data);
  }, []);

  const refreshProfile = useCallback(async () => {
    await loadProfile();
  }, [loadProfile]);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    // Profile data
    profile,
    stats,
    loading,
    error,

    // Editing state
    isEditing,
    activeSection,

    // Form states
    newSkill,
    newPortfolioItem,
    newEducation,
    newCertification,

    // UI states
    showAddPortfolio,
    showAddEducation,
    showAddCertification,

    // Actions
    setIsEditing,
    setActiveSection,
    setNewSkill,
    setNewPortfolioItem,
    setNewEducation,
    setNewCertification,
    setShowAddPortfolio,
    setShowAddEducation,
    setShowAddCertification,

    // Profile operations
    loadProfile,
    saveProfile,
    uploadImage,

    // Skills operations
    addSkill,
    addSpecificSkill,
    removeSkill,

    // Portfolio operations
    addPortfolioItem,
    removePortfolioItem,

    // Education operations
    addEducation,
    removeEducation,

    // Certification operations
    addCertification,
    removeCertification,

    // Languages operations
    updateLanguages,

    // Document operations
    uploadDocument,

    // Utility
    getCompletionPercentage,
    validateProfile,
    isProfileEmpty: () =>
      profile ? profileService.isProfileEmpty(profile) : true,
    refreshProfile,
  };
}
