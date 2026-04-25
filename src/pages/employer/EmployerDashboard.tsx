import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDarkMode } from "../../contexts/DarkModeContext";
import { EMPLOYER_ROUTES } from "../../config/routes";
import { useJobs } from "../../features/employer/hooks/useJobs";
import { useProposals } from "../../features/employer/hooks/useProposals";
import { useCategories } from "../../features/employer/hooks/useCategories";
import { useTalents } from "../../features/employer/hooks/useTalents";
import { StatsCards } from "../../features/employer/components/StatsCards";
import { TabsNavigation } from "../../features/employer/components/TabsNavigation";
import { JobList } from "../../features/employer/components/JobList";
import { JobFormModal } from "../../features/employer/components/JobFormModal";
import { ProposalsModal } from "../../features/employer/components/ProposalsModal";
import { ProposalsPage } from "../../features/employer/components/ProposalsPage";
import { TalentProfileModal } from "../../features/employer/components/TalentProfileModal";
import { TalentList } from "../../features/employer/components/TalentList";
import { ContractList } from "../../features/employer/components/ContractList";
import { Header } from "../../features/employer/components/Header";
import { EmptyState } from "../../features/employer/components/EmptyState";
import type {
  TabType,
  EmployerStats,
  Job,
  Talent,
  Contract,
} from "../../features/employer/types/employer.types";

// Mock data for contracts (replace with actual API calls)

const mockContracts: Contract[] = [
  {
    id: 1,
    job_id: 1,
    talent_id: 1,
    talent_name: "John Doe",
    job_title: "Senior React Developer",
    status: "active",
    start_date: "2024-01-01",
    end_date: "2024-03-01",
    total_value: 15000,
    earnings: 7500,
    progress: 50,
    created_at: "2024-01-01",
  },
  {
    id: 2,
    job_id: 2,
    talent_id: 2,
    talent_name: "Jane Smith",
    job_title: "Full Stack Developer",
    status: "completed",
    start_date: "2023-10-01",
    end_date: "2023-12-01",
    total_value: 12000,
    earnings: 12000,
    progress: 100,
    created_at: "2023-10-01",
  },
];

export const EmployerDashboard: React.FC = () => {
  const { darkMode } = useDarkMode();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("jobs");
  const [showJobModal, setShowJobModal] = useState(false);
  const [showProposalsModal, setShowProposalsModal] = useState(false);
  const [showTalentProfileModal, setShowTalentProfileModal] = useState(false);
  const [selectedTalentId, setSelectedTalentId] = useState<number | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  // Custom hooks
  const {
    jobs,
    loading: jobsLoading,
    error: jobsError,
    fetchJobs,
    createNewJob,
    updateExistingJob,
    deleteExistingJob,
  } = useJobs();
  const {
    proposals,
    loading: proposalsLoading,
    error: proposalsError,
    fetchProposals,
    updateProposalStatus,
    clearProposals,
  } = useProposals();
  const { categories } = useCategories();
  const {
    talents,
    loading: talentsLoading,
    error: talentsError,
    getTalents,
    clearTalents,
  } = useTalents();

  // Calculate stats
  const stats: EmployerStats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((job) => job.status === "active").length,
    totalProposals: jobs.reduce(
      (sum, job) => sum + (job.applications_count || 0),
      0,
    ),
    activeContracts: mockContracts.filter(
      (contract) => contract.status === "active",
    ).length,
  };

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Fetch talents when talents tab is active
  useEffect(() => {
    if (activeTab === "talents") {
      getTalents();
    }
  }, [activeTab, getTalents]);

  // Handle job actions
  const handleCreateJob = () => {
    navigate(EMPLOYER_ROUTES.POST_JOB.path);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowJobModal(true);
  };

  const handleDeleteJob = async (job: Job) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await deleteExistingJob(job.id);
    }
  };

  const handleViewDetails = (job: Job) => {
    // Implement job details view
    console.log("View details for job:", job);
  };

  const handleViewProposals = (job: Job) => {
    console.log("Navigating to proposals for job:", job);
    console.log("Job ID:", job.id);
    navigate(
      EMPLOYER_ROUTES.PROPOSALS.path.replace(":jobId", job.id.toString()),
    );
  };

  const handleJobSubmit = async (jobData: any) => {
    const success = editingJob
      ? await updateExistingJob(editingJob.id, jobData)
      : await createNewJob(jobData);

    if (success) {
      setShowJobModal(false);
      setEditingJob(null);
    }
  };

  const handleUpdateProposalStatus = async (
    proposalId: number,
    status: string,
  ) => {
    await updateProposalStatus(proposalId, status);
  };

  const handleCloseProposalsModal = () => {
    setShowProposalsModal(false);
    clearProposals();
  };

  const handleInviteTalent = (talent: Talent) => {
    // Implement talent invitation logic
    console.log("Invite talent:", talent);
  };

  const handleViewTalentProfile = (talentId: number) => {
    setSelectedTalentId(talentId);
    setShowTalentProfileModal(true);
  };

  const handleViewContractDetails = (contract: Contract) => {
    // Implement contract details view
    console.log("View contract details:", contract);
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "jobs":
        return (
          <JobList
            jobs={jobs}
            loading={jobsLoading}
            error={jobsError}
            darkMode={darkMode}
            onViewDetails={handleViewDetails}
            onEdit={handleEditJob}
            onDelete={handleDeleteJob}
            onViewProposals={handleViewProposals}
          />
        );
      case "proposals":
        return <ProposalsPage darkMode={darkMode} />;
      case "talents":
        return (
          <TalentList
            talents={talents}
            loading={talentsLoading}
            error={talentsError}
            darkMode={darkMode}
            onInviteTalent={handleInviteTalent}
            onViewProfile={handleViewTalentProfile}
          />
        );
      case "contracts":
        return (
          <ContractList
            contracts={mockContracts}
            darkMode={darkMode}
            onViewDetails={handleViewContractDetails}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <Header
          title="Employer Dashboard"
          subtitle="Manage your jobs, proposals, and contracts"
          action={{
            label: "Create Job",
            onClick: handleCreateJob,
          }}
          darkMode={darkMode}
        />

        {/* Stats Cards */}
        <StatsCards stats={stats} darkMode={darkMode} />

        {/* Tabs Navigation */}
        <TabsNavigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
        />

        {/* Tab Content */}
        <div className="mt-8">{renderTabContent()}</div>

        {/* Job Form Modal */}
        <JobFormModal
          isOpen={showJobModal}
          onClose={() => setShowJobModal(false)}
          onSubmit={handleJobSubmit}
          editingJob={editingJob}
          categories={categories}
          loading={jobsLoading}
          darkMode={darkMode}
        />

        {/* Proposals Modal */}
        <ProposalsModal
          isOpen={showProposalsModal}
          onClose={handleCloseProposalsModal}
          proposals={proposals}
          loading={proposalsLoading}
          error={proposalsError}
          onUpdateStatus={handleUpdateProposalStatus}
          onViewProfile={handleViewTalentProfile}
          darkMode={darkMode}
        />

        {/* Talent Profile Modal */}
        <TalentProfileModal
          isOpen={showTalentProfileModal}
          onClose={() => setShowTalentProfileModal(false)}
          talentId={selectedTalentId}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export default EmployerDashboard;
