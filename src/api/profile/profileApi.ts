import type { ProfileData, ProfileStats } from "../../types/profile";
import { API_BASE_URL } from "../../config/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const profileApi = {
  // Get profile data from backend
  async getProfile(): Promise<ProfileData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/talents/talentProfile`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error fetching profile:", error);
      throw error;
    }
  },

  // Get profile stats from backend
  async getProfileStats(): Promise<ProfileStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/talents/stats`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        // If stats endpoint doesn't exist, return default stats
        return {
          completedProjects: 0,
          totalEarnings: "$0",
          successRate: "N/A",
          responseTime: "N/A",
        };
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error fetching profile stats:", error);
      // Return default stats on error
      return {
        completedProjects: 0,
        totalEarnings: "$0",
        successRate: "N/A",
        responseTime: "N/A",
      };
    }
  },

  // Update profile data
  async updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/talents/talentProfile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Upload profile image (mock implementation)
  async uploadProfileImage(file: File): Promise<{ imageUrl: string }> {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(`${API_BASE_URL}/api/talents/upload-image`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw new Error("Failed to upload image");
    }
  },

  // Add skill
  async addSkill(skill: string): Promise<ProfileData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/talents/skills`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ skill }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error adding skill:", error);
      throw error;
    }
  },

  // Remove skill
  async removeSkill(skill: string): Promise<ProfileData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/talents/skills`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ skill }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error removing skill:", error);
      throw error;
    }
  },

  // Add portfolio item
  async addPortfolioItem(
    item: Omit<import("../../types/profile").Portfolio, "id">,
  ): Promise<ProfileData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/talents/portfolio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error adding portfolio item:", error);
      throw error;
    }
  },

  // Remove portfolio item
  async removePortfolioItem(itemId: number): Promise<ProfileData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/talents/portfolio/${itemId}`,
        {
          method: "DELETE",
          headers: {
            ...getAuthHeaders(),
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error removing portfolio item:", error);
      throw error;
    }
  },

  // Add education
  async addEducation(
    education: Omit<import("../../types/profile").Education, "id">,
  ): Promise<ProfileData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/talents/education`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(education),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error adding education:", error);
      throw error;
    }
  },

  // Remove education
  async removeEducation(itemId: number): Promise<ProfileData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/talents/education/${itemId}`,
        {
          method: "DELETE",
          headers: {
            ...getAuthHeaders(),
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error removing education:", error);
      throw error;
    }
  },

  // Add certification
  async addCertification(
    certification: Omit<import("../../types/profile").Certification, "id">,
  ): Promise<ProfileData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/talents/certifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify(certification),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error adding certification:", error);
      throw error;
    }
  },

  // Remove certification
  async removeCertification(itemId: number): Promise<ProfileData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/talents/certifications/${itemId}`,
        {
          method: "DELETE",
          headers: {
            ...getAuthHeaders(),
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error removing certification:", error);
      throw error;
    }
  },

  // Update languages
  async updateLanguages(
    languages: import("../../types/profile").Language[],
  ): Promise<ProfileData> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/talents/languages`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ languages }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error updating languages:", error);
      throw error;
    }
  },

  // Upload document (certificate or transcript)
  async uploadDocument(
    file: File,
    type: "certificate" | "transcript",
    itemId: number,
  ): Promise<ProfileData> {
    try {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("type", type);
      formData.append("itemId", itemId.toString());

      const response = await fetch(`${API_BASE_URL}/api/talents/documents`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error uploading document:", error);
      throw error;
    }
  },

  // Delete document
  async deleteDocument(documentId: number): Promise<ProfileData> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/talents/documents/${documentId}`,
        {
          method: "DELETE",
          headers: {
            ...getAuthHeaders(),
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  },
};
