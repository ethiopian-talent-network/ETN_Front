import type { ProfileData, ProfileStats } from "../../types/profile";

// Local storage keys
const PROFILE_STORAGE_KEY = "freelancer_profile";
const STATS_STORAGE_KEY = "freelancer_stats";

// Helper function to check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

export const profileApi = {
  // Get profile data from local storage
  async getProfile(): Promise<ProfileData> {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn("localStorage is not available, returning empty profile");
        return {
          name: "",
          title: "",
          location: "",
          hourlyRate: "",
          bio: "",
          skills: [],
          languages: [],
          education: [],
          certifications: [],
          portfolio: [],
        };
      }

      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (storedProfile) {
        return JSON.parse(storedProfile);
      }

      // Return empty profile if no stored data
      return {
        name: "",
        title: "",
        location: "",
        hourlyRate: "",
        bio: "",
        skills: [],
        languages: [],
        education: [],
        certifications: [],
        portfolio: [],
      };
    } catch (error) {
      console.error("Error loading profile from storage:", error);
      // Return empty profile as fallback
      return {
        name: "",
        title: "",
        location: "",
        hourlyRate: "",
        bio: "",
        skills: [],
        languages: [],
        education: [],
        certifications: [],
        portfolio: [],
      };
    }
  },

  // Update profile data
  async updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn("localStorage is not available, cannot update profile");
        throw new Error("localStorage is not available");
      }

      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (storedProfile) {
        const updatedProfile = { ...JSON.parse(storedProfile), ...data };
        localStorage.setItem(
          PROFILE_STORAGE_KEY,
          JSON.stringify(updatedProfile),
        );
        return updatedProfile;
      }

      // If no stored profile, create a new one
      const newProfile: ProfileData = {
        name: "",
        title: "",
        location: "",
        hourlyRate: "",
        bio: "",
        skills: [],
        languages: [],
        education: [],
        certifications: [],
        portfolio: [],
        ...data,
      };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    } catch (error) {
      console.error("Error updating profile in storage:", error);
      throw new Error("Failed to update profile");
    }
  },

  // Upload profile image (mock implementation)
  async uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
    try {
      // In a real app, this would upload to a server
      // For now, we'll create a mock URL
      const imageUrl = URL.createObjectURL(file);
      return { imageUrl };
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw new Error("Failed to upload image");
    }
  },

  // Get profile stats from local storage
  async getProfileStats(): Promise<ProfileStats> {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn("localStorage is not available, returning default stats");
        return {
          completedProjects: 0,
          totalEarnings: "$0",
          successRate: "N/A",
          responseTime: "N/A",
        };
      }

      const storedStats = localStorage.getItem(STATS_STORAGE_KEY);
      if (storedStats) {
        return JSON.parse(storedStats);
      }

      // Return default stats if no stored data
      return {
        completedProjects: 0,
        totalEarnings: "$0",
        successRate: "N/A",
        responseTime: "N/A",
      };
    } catch (error) {
      console.error("Error loading profile stats from storage:", error);
      return {
        completedProjects: 0,
        totalEarnings: "$0",
        successRate: "N/A",
        responseTime: "N/A",
      };
    }
  },

  // Add skill to local storage
  async addSkill(skill: string): Promise<ProfileData> {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn("localStorage is not available, cannot add skill");
        throw new Error("localStorage is not available");
      }

      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      const profile = storedProfile
        ? JSON.parse(storedProfile)
        : {
            name: "",
            title: "",
            location: "",
            hourlyRate: "",
            bio: "",
            skills: [],
            languages: [],
            education: [],
            certifications: [],
            portfolio: [],
          };

      // Add skill if it doesn't already exist
      if (!profile.skills.includes(skill)) {
        profile.skills.push(skill);
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      }

      return profile;
    } catch (error) {
      console.error("Error adding skill to storage:", error);
      throw new Error("Failed to add skill");
    }
  },

  // Remove skill from local storage
  async removeSkill(skill: string): Promise<ProfileData> {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn("localStorage is not available, cannot remove skill");
        throw new Error("localStorage is not available");
      }

      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!storedProfile) {
        throw new Error("No profile found");
      }

      const profile = JSON.parse(storedProfile);
      profile.skills = profile.skills.filter((s: string) => s !== skill);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error("Error removing skill from storage:", error);
      throw new Error("Failed to remove skill");
    }
  },

  // Add portfolio item to local storage
  async addPortfolioItem(
    item: Omit<import("../../types/profile").Portfolio, "id">,
  ): Promise<ProfileData> {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn(
          "localStorage is not available, cannot add portfolio item",
        );
        throw new Error("localStorage is not available");
      }

      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      const profile = storedProfile
        ? JSON.parse(storedProfile)
        : {
            name: "",
            title: "",
            location: "",
            hourlyRate: "",
            bio: "",
            skills: [],
            languages: [],
            education: [],
            certifications: [],
            portfolio: [],
          };

      // Add portfolio item with generated ID
      const newItem = { ...item, id: Date.now() };
      profile.portfolio.push(newItem);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error("Error adding portfolio item to storage:", error);
      throw new Error("Failed to add portfolio item");
    }
  },

  // Remove portfolio item from local storage
  async removePortfolioItem(itemId: number): Promise<ProfileData> {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn(
          "localStorage is not available, cannot remove portfolio item",
        );
        throw new Error("localStorage is not available");
      }

      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!storedProfile) {
        throw new Error("No profile found");
      }

      const profile = JSON.parse(storedProfile);
      profile.portfolio = profile.portfolio.filter(
        (item: any) => item.id !== itemId,
      );
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error("Error removing portfolio item from storage:", error);
      throw new Error("Failed to remove portfolio item");
    }
  },

  // Add education to local storage
  async addEducation(
    education: Omit<import("../../types/profile").Education, "id">,
  ): Promise<ProfileData> {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn("localStorage is not available, cannot add education");
        throw new Error("localStorage is not available");
      }

      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      const profile = storedProfile
        ? JSON.parse(storedProfile)
        : {
            name: "",
            title: "",
            location: "",
            hourlyRate: "",
            bio: "",
            skills: [],
            languages: [],
            education: [],
            certifications: [],
            portfolio: [],
          };

      // Add education with generated ID
      const newEducation = { ...education, id: Date.now() };
      profile.education.push(newEducation);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error("Error adding education to storage:", error);
      throw new Error("Failed to add education");
    }
  },

  // Remove education from local storage
  async removeEducation(itemId: number): Promise<ProfileData> {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn("localStorage is not available, cannot remove education");
        throw new Error("localStorage is not available");
      }

      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!storedProfile) {
        throw new Error("No profile found");
      }

      const profile = JSON.parse(storedProfile);
      profile.education = profile.education.filter(
        (item: any) => item.id !== itemId,
      );
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error("Error removing education from storage:", error);
      throw new Error("Failed to remove education");
    }
  },

  // Add certification to local storage
  async addCertification(
    certification: Omit<import("../../types/profile").Certification, "id">,
  ): Promise<ProfileData> {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn("localStorage is not available, cannot add certification");
        throw new Error("localStorage is not available");
      }

      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      const profile = storedProfile
        ? JSON.parse(storedProfile)
        : {
            name: "",
            title: "",
            location: "",
            hourlyRate: "",
            bio: "",
            skills: [],
            languages: [],
            education: [],
            certifications: [],
            portfolio: [],
          };

      // Add certification with generated ID
      const newCertification = { ...certification, id: Date.now() };
      profile.certifications.push(newCertification);
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error("Error adding certification to storage:", error);
      throw new Error("Failed to add certification");
    }
  },

  // Remove certification from local storage
  async removeCertification(itemId: number): Promise<ProfileData> {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn(
          "localStorage is not available, cannot remove certification",
        );
        throw new Error("localStorage is not available");
      }

      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (!storedProfile) {
        throw new Error("No profile found");
      }

      const profile = JSON.parse(storedProfile);
      profile.certifications = profile.certifications.filter(
        (item: any) => item.id !== itemId,
      );
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    } catch (error) {
      console.error("Error removing certification from storage:", error);
      throw new Error("Failed to remove certification");
    }
  },

  // Upload document (mock implementation)
  async uploadDocument(
    file: File,
    _type: "certificate" | "transcript",
    _itemId: number,
  ): Promise<{ documentUrl: string }> {
    try {
      // In a real app, this would upload to a server
      // For now, we'll create a mock URL
      const documentUrl = URL.createObjectURL(file);
      return { documentUrl };
    } catch (error) {
      console.error("Error uploading document:", error);
      throw new Error("Failed to upload document");
    }
  },

  // Delete document (mock implementation)
  async deleteDocument(documentId: number): Promise<void> {
    try {
      // In a real app, this would delete from server
      // For now, we'll just log the action
      console.log(`Document ${documentId} deleted (mock implementation)`);
    } catch (error) {
      console.error("Error deleting document:", error);
      throw new Error("Failed to delete document");
    }
  },

  // Update languages
  async updateLanguages(
    languages: import("../../types/profile").Language[],
  ): Promise<ProfileData> {
    try {
      if (!isLocalStorageAvailable()) {
        console.warn("localStorage is not available, cannot update languages");
        throw new Error("localStorage is not available");
      }

      const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (storedProfile) {
        const updatedProfile = { ...JSON.parse(storedProfile), languages };
        localStorage.setItem(
          PROFILE_STORAGE_KEY,
          JSON.stringify(updatedProfile),
        );
        return updatedProfile;
      }

      // If no stored profile, create a new one with languages
      const newProfile: ProfileData = {
        name: "",
        title: "",
        location: "",
        hourlyRate: "",
        bio: "",
        skills: [],
        languages,
        education: [],
        certifications: [],
        portfolio: [],
      };
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    } catch (error) {
      console.error("Error updating languages in storage:", error);
      throw new Error("Failed to update languages");
    }
  },
};
