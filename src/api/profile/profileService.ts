import { profileApi } from "./profileApi";
import type {
  ProfileData,
  ProfileStats,
  Education,
  Certification,
  Portfolio,
  Language,
} from "../../types/profile";

export class ProfileService {
  // Cache for profile data
  private profileCache: ProfileData | null = null;
  private statsCache: ProfileStats | null = null;

  // Get profile with caching
  async getProfile(forceRefresh = false): Promise<ProfileData> {
    if (!forceRefresh && this.profileCache) {
      return this.profileCache;
    }

    try {
      const profile = await profileApi.getProfile();
      this.profileCache = profile;
      return profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  }

  // Update profile
  async updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
    try {
      const updatedProfile = await profileApi.updateProfile(data);
      this.profileCache = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }

  // Upload profile image
  async uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const result = await profileApi.uploadProfileImage(file);
      return result;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw error;
    }
  }

  // Get profile stats
  async getProfileStats(forceRefresh = false): Promise<ProfileStats> {
    if (!forceRefresh && this.statsCache) {
      return this.statsCache;
    }

    try {
      const stats = await profileApi.getProfileStats();
      this.statsCache = stats;
      return stats;
    } catch (error) {
      console.error("Error fetching profile stats:", error);
      throw error;
    }
  }

  // Skills management
  async addSkill(skill: string): Promise<ProfileData> {
    try {
      await profileApi.addSkill(skill);
      // Fetch updated profile after adding skill
      const updatedProfile = await profileApi.getProfile();
      this.profileCache = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error("Error adding skill:", error);
      throw error;
    }
  }

  async removeSkill(skill: string): Promise<ProfileData> {
    try {
      await profileApi.removeSkill(skill);
      // Fetch updated profile after removing skill
      const updatedProfile = await profileApi.getProfile();
      this.profileCache = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error("Error removing skill:", error);
      throw error;
    }
  }

  // Portfolio management
  async addPortfolioItem(item: Omit<Portfolio, "id">): Promise<ProfileData> {
    try {
      await profileApi.addPortfolioItem(item);
      // Fetch updated profile after adding portfolio item
      const updatedProfile = await profileApi.getProfile();
      this.profileCache = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error("Error adding portfolio item:", error);
      throw error;
    }
  }

  async removePortfolioItem(itemId: number): Promise<ProfileData> {
    try {
      await profileApi.removePortfolioItem(itemId);
      // Fetch updated profile after removing portfolio item
      const updatedProfile = await profileApi.getProfile();
      this.profileCache = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error("Error removing portfolio item:", error);
      throw error;
    }
  }

  // Education management
  async addEducation(education: Omit<Education, "id">): Promise<ProfileData> {
    try {
      await profileApi.addEducation(education);
      // Fetch updated profile after adding education
      const updatedProfile = await profileApi.getProfile();
      this.profileCache = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error("Error adding education:", error);
      throw error;
    }
  }

  async removeEducation(itemId: number): Promise<ProfileData> {
    try {
      await profileApi.removeEducation(itemId);
      // Fetch updated profile after removing education
      const updatedProfile = await profileApi.getProfile();
      this.profileCache = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error("Error removing education:", error);
      throw error;
    }
  }

  // Certification management
  async addCertification(
    certification: Omit<Certification, "id">,
  ): Promise<ProfileData> {
    try {
      await profileApi.addCertification(certification);
      // Fetch updated profile after adding certification
      const updatedProfile = await profileApi.getProfile();
      this.profileCache = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error("Error adding certification:", error);
      throw error;
    }
  }

  async removeCertification(itemId: number): Promise<ProfileData> {
    try {
      await profileApi.removeCertification(itemId);
      // Fetch updated profile after removing certification
      const updatedProfile = await profileApi.getProfile();
      this.profileCache = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error("Error removing certification:", error);
      throw error;
    }
  }

  // Document management
  async uploadDocument(
    file: File,
    type: "certificate" | "transcript",
    itemId: number,
  ): Promise<ProfileData> {
    try {
      await profileApi.uploadDocument(file, type, itemId);
      // Fetch updated profile after uploading document
      const updatedProfile = await profileApi.getProfile();
      this.profileCache = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  }

  async deleteDocument(documentId: number): Promise<ProfileData> {
    try {
      await profileApi.deleteDocument(documentId);
      // Fetch updated profile after deleting document
      const updatedProfile = await profileApi.getProfile();
      this.profileCache = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  }

  // Languages management
  async updateLanguages(languages: Language[]): Promise<ProfileData> {
    try {
      const updatedProfile = await profileApi.updateLanguages(languages);
      this.profileCache = updatedProfile;
      return updatedProfile;
    } catch (error) {
      console.error("Error updating languages:", error);
      throw error;
    }
  }

  // Utility methods
  clearCache(): void {
    this.profileCache = null;
    this.statsCache = null;
  }

  // Get cached profile without API call
  getCachedProfile(): ProfileData | null {
    return this.profileCache;
  }

  // Get cached stats without API call
  getCachedStats(): ProfileStats | null {
    return this.statsCache;
  }

  // Validate profile data
  validateProfile(data: Partial<ProfileData>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (data.name && data.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    if (data.title && data.title.trim().length < 3) {
      errors.push("Title must be at least 3 characters long");
    }

    if (data.hourlyRate && isNaN(Number(data.hourlyRate))) {
      errors.push("Hourly rate must be a valid number");
    }

    if (data.bio && data.bio.length > 500) {
      errors.push("Bio must be less than 500 characters");
    }

    if (data.skills && data.skills.length > 20) {
      errors.push("Cannot have more than 20 skills");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Check if profile is empty (new talent)
  isProfileEmpty(profile: ProfileData): boolean {
    return (
      !profile.name.trim() &&
      !profile.title.trim() &&
      !profile.location.trim() &&
      !profile.hourlyRate.trim() &&
      !profile.bio.trim() &&
      profile.skills.length === 0 &&
      profile.languages.length === 0 &&
      profile.education.length === 0 &&
      profile.certifications.length === 0 &&
      profile.portfolio.length === 0
    );
  }

  // Format profile completion percentage
  getProfileCompletionPercentage(profile: ProfileData): number {
    const fields = [
      profile.name,
      profile.title,
      profile.location,
      profile.hourlyRate,
      profile.bio,
    ];

    const completedFields = fields.filter(
      (field) => field && field.trim().length > 0,
    ).length;
    const hasSkills = profile.skills.length > 0;
    const hasEducation = profile.education.length > 0;
    const hasPortfolio = profile.portfolio.length > 0;
    const hasLanguages = profile.languages.length > 0;

    const totalFields = 5 + 4; // basic fields + skills, education, portfolio, languages
    const completedTotal =
      completedFields +
      (hasSkills ? 1 : 0) +
      (hasEducation ? 1 : 0) +
      (hasPortfolio ? 1 : 0) +
      (hasLanguages ? 1 : 0);

    return Math.round((completedTotal / totalFields) * 100);
  }
}

// Export singleton instance
export const profileService = new ProfileService();
