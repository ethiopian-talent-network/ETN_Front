import { Link } from "react-router";
import { useState } from "react";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useProfile } from "../hooks/useProfile";
import { ProfileHeader } from "../components/profile/ProfileHeader";
import { SkillsSection } from "../components/profile/SkillsSection";
import LanguagesSection from "../components/profile/LanguagesSection";
import { PortfolioSection } from "../components/profile/PortfolioSection";
import { EducationSection } from "../components/profile/EducationSection";
import { CertificationsSection } from "../components/profile/CertificationsSection";
import type { ProfileData } from "../types/profile";
import {
  ArrowLeft,
  Moon,
  Sun,
  User,
  Code,
  Monitor,
  GraduationCap,
  Briefcase,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import type { ProfileSection } from "../types/profile";

export default function FreelancerProfile() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const {
    profile,
    stats,
    loading,
    error,
    isEditing,
    activeSection,
    newPortfolioItem,
    newEducation,
    newCertification,
    showAddPortfolio,
    showAddEducation,
    showAddCertification,
    setIsEditing,
    setActiveSection,
    setNewPortfolioItem,
    setNewEducation,
    setNewCertification,
    setShowAddPortfolio,
    setShowAddEducation,
    setShowAddCertification,
    loadProfile,
    saveProfile,
    uploadImage,
    addSpecificSkill,
    removeSkill,
    addPortfolioItem,
    removePortfolioItem,
    addEducation,
    removeEducation,
    addCertification,
    removeCertification,
    updateLanguages,
    uploadDocument,
    isProfileEmpty,
    getCompletionPercentage,
  } = useProfile();

  // Local editing state to prevent immediate API calls on every keystroke
  const [editingProfile, setEditingProfile] = useState<ProfileData | null>(
    null,
  );

  // Document handling functions
  const handleFileUpload = (
    file: File,
    type: "certificate" | "transcript",
    itemId: number,
  ) => {
    uploadDocument(file, type, itemId);
  };

  const viewDocument = (dataUrl: string) => {
    const newWindow = window.open();
    if (newWindow) {
      const isImageFile = dataUrl.startsWith("data:image/");
      newWindow.document.write(`
        <html>
          <head><title>Document</title></head>
          <body style="margin:0;padding:20px;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5;">
            ${
              isImageFile
                ? `<img src="${dataUrl}" style="max-width:100%;max-height:100%;object-fit:contain;" />`
                : `<embed src="${dataUrl}" type="application/pdf" width="100%" height="100%" />`
            }
          </body>
        </html>
      `);
    }
  };

  const handleRemoveDocument = (
    itemId: number,
    type: "certificate" | "transcript",
  ) => {
    if (profile) {
      const updatedProfile = { ...profile };

      if (type === "certificate") {
        // Update education or certification certificate
        const updatedEducation = profile.education.map((edu) =>
          edu.id === itemId ? { ...edu, certificate: undefined } : edu,
        );
        const updatedCertifications = profile.certifications.map((cert) =>
          cert.id === itemId ? { ...cert, certificate: undefined } : cert,
        );

        updatedProfile.education = updatedEducation.some(
          (edu) => edu.id === itemId,
        )
          ? updatedEducation
          : profile.education;
        updatedProfile.certifications = updatedCertifications.some(
          (cert) => cert.id === itemId,
        )
          ? updatedCertifications
          : profile.certifications;
      } else {
        // Update transcript
        updatedProfile.education = profile.education.map((edu) =>
          edu.id === itemId ? { ...edu, transcript: undefined } : edu,
        );
      }

      saveProfile(updatedProfile);
    }
  };

  const handleRemoveCertificationDocument = (itemId: number) => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        certifications: profile.certifications.map((cert) =>
          cert.id === itemId ? { ...cert, certificate: undefined } : cert,
        ),
      };
      saveProfile(updatedProfile);
    }
  };

  const handleSaveProfile = async () => {
    if (editingProfile) {
      await saveProfile(editingProfile);
      setEditingProfile(null);
      setIsEditing(false); // Exit editing mode after saving
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const result = await uploadImage(file);
    return result.imageUrl;
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingProfile(null);
    loadProfile(); // Reload to reset changes
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0084ca] mx-auto mb-4"></div>
            <p
              className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1
              className={`text-2xl font-bold mb-2 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Error Loading Profile
            </h1>
            <p
              className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {error}
            </p>
            <button
              onClick={loadProfile}
              className="bg-[#0084ca] hover:bg-[#006ba6] text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state for new talents (only when not editing)
  if (profile && isProfileEmpty() && !isEditing) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        {/* Header */}
        <header
          className={`transition-colors duration-300 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-b border-gray-200"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link
                to="/talent-dashboard"
                className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </Link>

              <div className="flex items-center gap-4">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                    darkMode
                      ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>

                <Link to="/" className="text-2xl font-bold text-[#0084ca]">
                  ETN
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Empty State Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="w-24 h-24 bg-[#0084ca] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-[#0084ca]" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to Your Talent Profile!
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Let's build your professional profile to showcase your skills and
              attract great opportunities. Start by adding your basic
              information and then build out your experience.
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Get Started with Your Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Basic Information
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Add your name, title, and bio
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Code className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Skills & Expertise
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      List your technical skills
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Portfolio
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Showcase your best work
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Education & Certs
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Add your qualifications
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#0084ca] hover:bg-[#006ba6] text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Start Building Your Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          darkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">👤</div>
            <h2
              className={`text-2xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              No Profile Found
            </h2>
            <p
              className={`mb-4 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Please create your profile to get started.
            </p>
            <Link
              to="/talent-dashboard"
              className="bg-[#0084ca] hover:bg-[#006ba6] text-white px-6 py-2 rounded-lg inline-block"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navigationTabs = [
    { id: "overview" as ProfileSection, label: "Overview", icon: User },
    { id: "skills" as ProfileSection, label: "Skills", icon: Code },
    { id: "portfolio" as ProfileSection, label: "Portfolio", icon: Monitor },
    {
      id: "education" as ProfileSection,
      label: "Education",
      icon: GraduationCap,
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <header
        className={`transition-colors duration-300 ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/talent-dashboard"
              className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
                darkMode
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 ${
                  darkMode
                    ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <Link to="/" className="text-2xl font-bold text-[#0084ca]">
                ETN
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Profile Header */}
        <ProfileHeader
          profile={editingProfile || profile}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onSave={handleSaveProfile}
          onCancel={handleCancelEdit}
          onProfileChange={setEditingProfile}
          onImageUpload={handleImageUpload}
          completionPercentage={getCompletionPercentage()}
          darkMode={darkMode}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Completed Projects
              </span>
              <Briefcase className="w-5 h-5 text-[#0084ca]" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.completedProjects || "47"}
            </p>
            <p className="text-sm text-green-600">+5 this month</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Earnings
              </span>
              <DollarSign className="w-5 h-5 text-[#0084ca]" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.totalEarnings || "$125,400"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">All time</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Success Rate
              </span>
              <TrendingUp className="w-5 h-5 text-[#0084ca]" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.successRate || "98%"}
            </p>
            <p className="text-sm text-green-600">Above average</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Response Time
              </span>
              <Clock className="w-5 h-5 text-[#0084ca]" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats?.responseTime || "2h"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Average</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 sm:gap-8 px-2 sm:px-6 overflow-x-auto scrollbar-hide">
              {navigationTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`py-3 sm:py-4 px-2 sm:px-0 border-b-2 text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                    activeSection === tab.id
                      ? "border-[#0084ca] text-[#0084ca]"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 sm:p-6">
            {/* Overview Section */}
            {activeSection === "overview" && (
              <div className="space-y-4 sm:space-y-6">
                <LanguagesSection
                  languages={profile.languages}
                  onLanguagesChange={updateLanguages}
                  darkMode={darkMode}
                />

                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
                    Availability
                  </h3>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Available for new projects
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      40+ hours per week
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Skills Section */}
            {activeSection === "skills" && (
              <SkillsSection
                skills={profile.skills}
                isEditing={isEditing}
                onAddSpecificSkill={addSpecificSkill}
                onRemoveSkill={removeSkill}
                darkMode={darkMode}
              />
            )}

            {/* Portfolio Section */}
            {activeSection === "portfolio" && (
              <PortfolioSection
                portfolio={profile.portfolio}
                isEditing={isEditing}
                showAddPortfolio={showAddPortfolio}
                newPortfolioItem={newPortfolioItem}
                onShowAddPortfolioChange={setShowAddPortfolio}
                onNewPortfolioItemChange={setNewPortfolioItem}
                onAddPortfolioItem={addPortfolioItem}
                onRemovePortfolioItem={removePortfolioItem}
              />
            )}

            {/* Education Section */}
            {activeSection === "education" && (
              <div className="space-y-6">
                <EducationSection
                  education={profile.education}
                  isEditing={isEditing}
                  darkMode={darkMode}
                  showAddEducation={showAddEducation}
                  newEducation={newEducation}
                  onShowAddEducationChange={setShowAddEducation}
                  onNewEducationChange={setNewEducation}
                  onAddEducation={addEducation}
                  onRemoveEducation={removeEducation}
                  onUploadDocument={handleFileUpload}
                  onViewDocument={viewDocument}
                  onRemoveDocument={handleRemoveDocument}
                />

                <CertificationsSection
                  certifications={profile.certifications}
                  isEditing={isEditing}
                  darkMode={darkMode}
                  showAddCertification={showAddCertification}
                  newCertification={newCertification}
                  onShowAddCertificationChange={setShowAddCertification}
                  onNewCertificationChange={setNewCertification}
                  onAddCertification={addCertification}
                  onRemoveCertification={removeCertification}
                  onUploadDocument={(file, type, itemId) =>
                    handleFileUpload(file, type, itemId)
                  }
                  onViewDocument={viewDocument}
                  onRemoveDocument={handleRemoveCertificationDocument}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
