import { API_BASE_URL } from "../../config/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface TalentProfile {
  name: string;
  email: string;
  education?: string;
  experience?: string;
  languages?: string;
  linkedin?: string;
  github?: string;
  resume_url?: string;
  skills: string[];
}

export interface UpdateProfileData {
  education?: string;
  experience?: string;
  languages?: string;
  linkedin?: string;
  github?: string;
  resume_url?: string;
}

// Get talent profile
export const getTalentProfile = async (): Promise<{
  message: string;
  data: TalentProfile;
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/talents/talentProfile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching talent profile:", error);
    throw error;
  }
};

// Update talent profile
export const updateTalentProfile = async (
  profileData: UpdateProfileData,
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/talents/talentProfile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating talent profile:", error);
    throw error;
  }
};

// Get token balance
export const getTokenBalance = async (): Promise<{ balance: number }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/talents/tokeBalance`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching token balance:", error);
    throw error;
  }
};

// Add skills to profile
export const addSkills = async (
  skill_name: string,
): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/talents/addSkills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ skill_name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add skills");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding skills:", error);
    throw error;
  }
};

// Get portfolio
export const getPortfolio = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/talents/portifolio`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    throw error;
  }
};

// Create portfolio
export const createPortfolio = async (portfolioData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/talents/portifolio`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(portfolioData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create portfolio");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating portfolio:", error);
    throw error;
  }
};

// Update portfolio
export const updatePortfolio = async (portfolioData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/talents/updatePortifolio`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(portfolioData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update portfolio");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating portfolio:", error);
    throw error;
  }
};

// Delete portfolio
export const deletePortfolio = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/talents/deletePortifolio`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete portfolio");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    throw error;
  }
};
