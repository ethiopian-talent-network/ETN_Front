import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import DropdownMenu from "../components/ui/DropdownMenu";
import { useDarkMode } from "../contexts/DarkModeContext";
import { useAuth } from "../contexts/AuthContext";
import {
  getEmployerJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobApplications,
  updateApplicationStatus,
  type Job,
  type JobFormData,
  type Applicant,
} from "../api/employer/employerApi";
import { getCategories, type Category } from "../api/categories/categoriesApi";
import {
  Search,
  Plus,
  Briefcase,
  MessageSquare,
  Bell,
  Star,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  Moon,
  Sun,
  Edit,
  Trash2,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  Tag,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

export default function EmployerDashboard() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "jobs" | "talent" | "contracts" | "messages"
  >("jobs");
  const [searchQuery, setSearchQuery] = useState("");
  const [userImage, setUserImage] = useState<string | undefined>();
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobFilter, setJobFilter] = useState<
    "all" | "active" | "draft" | "closed"
  >("all");
  const [categories, setCategories] = useState<Category[]>([]);

  // Proposals state
  const [showProposalsModal, setShowProposalsModal] = useState(false);
  const [selectedJobForProposals, setSelectedJobForProposals] = useState<
    number | null
  >(null);
  const [proposals, setProposals] = useState<Applicant[]>([]);
  const [proposalsLoading, setProposalsLoading] = useState(false);
  const [proposalsError, setProposalsError] = useState<string | null>(null);

  // API state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch jobs on component mount and when filter changes
  useEffect(() => {
    if (token) {
      fetchJobs();
    }
  }, [token, jobFilter, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const fetchJobs = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await getEmployerJobs(token, {
        page: 1,
        limit: 20,
        status: jobFilter === "all" ? undefined : jobFilter,
        search: searchQuery || undefined,
      });

      setJobs(response.jobs || []);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message || "Failed to fetch jobs");
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const [newJob, setNewJob] = useState<Partial<JobFormData>>({
    title: "",
    description: "",
    category_id: 0,
    experience_level: "",
    salary: "",
    budget_type: "fixed",
    duration: "",
    location: "",
    remote_allowed: false,
    skills: [],
  });

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUserImage(result);
      console.log("Uploading image:", file);
    };
    reader.readAsDataURL(file);
  };

  // Map old experience level values to new database enum values
  const mapExperienceLevel = (level: string) => {
    const levelMap: { [key: string]: string } = {
      Junior: "entry",
      Mid: "intermediate",
      Senior: "expert",
    };
    return levelMap[level] || level;
  };

  const handleCreateJob = async () => {
    if (!token) return;

    // Validate required fields
    const requiredFields = [
      { field: "title", message: "Job title is required" },
      { field: "description", message: "Job description is required" },
      {
        field: "category_id",
        message: "Category is required",
        condition: (val: any) => val && val > 0,
      },
      { field: "experience_level", message: "Experience level is required" },
      { field: "salary", message: "Salary is required" },
      { field: "budget_type", message: "Budget type is required" },
      { field: "duration", message: "Duration is required" },
      { field: "location", message: "Location is required" },
    ];

    for (const { field, message, condition } of requiredFields) {
      const value = newJob[field as keyof JobFormData];
      const isValid = condition
        ? condition(value)
        : value && value.toString().trim() !== "";

      if (!isValid) {
        setError(message);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      if (editingJob) {
        // Update existing job
        await updateJob(token, editingJob.id, newJob as JobFormData);
        setEditingJob(null);
      } else {
        // Create new job
        const mappedJobData = {
          ...newJob,
          experience_level: mapExperienceLevel(newJob.experience_level || ""),
        };
        await createJob(token, mappedJobData as JobFormData);
      }

      // Refresh jobs list
      await fetchJobs();

      // Reset form
      setNewJob({
        title: "",
        description: "",
        category_id: 0,
        experience_level: "",
        salary: "",
        budget_type: "fixed",
        duration: "",
        location: "",
        remote_allowed: false,
        skills: [],
      });
      setShowJobForm(false);
    } catch (err: any) {
      setError(err.message || "Failed to save job");
      console.error("Error saving job:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    if (!token) return;

    if (!confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await deleteJob(token, jobId);

      // Refresh jobs list
      await fetchJobs();
    } catch (err: any) {
      setError(err.message || "Failed to delete job");
      console.error("Error deleting job:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProposals = async (jobId: number) => {
    if (!token) return;

    try {
      setProposalsLoading(true);
      setProposalsError(null);
      setSelectedJobForProposals(jobId);
      setShowProposalsModal(true);

      const response = await getJobApplications(token, jobId);
      setProposals(response.applications || []);
    } catch (err: any) {
      setProposalsError(err.message || "Failed to fetch proposals");
      console.error("Error fetching proposals:", err);
    } finally {
      setProposalsLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (
    applicationId: number,
    status: Applicant["status"],
  ) => {
    if (!token) return;

    try {
      await updateApplicationStatus(token, applicationId, status);

      // Refresh proposals list
      if (selectedJobForProposals) {
        handleViewProposals(selectedJobForProposals);
      }

      // Refresh jobs list to update application counts
      await fetchJobs();
    } catch (err: any) {
      setProposalsError(err.message || "Failed to update application status");
      console.error("Error updating application status:", err);
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setNewJob({
      title: job.title,
      description: job.description,
      category_id: job.category_id,
      experience_level: job.experience_level,
      salary: job.salary,
      budget_type: job.budget_type,
      duration: job.duration,
      location: job.location,
      remote_allowed: job.remote_allowed,
      skills: job.skills,
    });
    setShowJobForm(true);
  };

  const filteredJobs = jobs.filter((job) => {
    if (jobFilter === "all") return true;
    return job.status === jobFilter;
  });

  const activeContracts = [
    {
      id: 1,
      freelancer: "Abebe Kebede",
      role: "React Developer",
      project: "E-commerce Dashboard",
      earnings: "$2,450",
      progress: 75,
      status: "In Progress",
    },
    {
      id: 2,
      freelancer: "Sara Mohammed",
      role: "Graphic Designer",
      project: "Brand Identity Design",
      earnings: "$1,200",
      progress: 40,
      status: "In Progress",
    },
  ];

  const recommendedTalent = [
    {
      id: 1,
      name: "Yohannes Tadesse",
      title: "Senior Full Stack Developer",
      rating: 4.9,
      reviews: 127,
      hourlyRate: "$45/hr",
      skills: ["React", "Node.js", "MongoDB", "TypeScript"],
      location: "Addis Ababa",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    },
    {
      id: 2,
      name: "Meron Alemayehu",
      title: "UI/UX Designer & Illustrator",
      rating: 5.0,
      reviews: 89,
      hourlyRate: "$35/hr",
      skills: ["Figma", "Adobe XD", "Illustration", "Prototyping"],
      location: "Addis Ababa",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    },
    {
      id: 3,
      name: "Daniel Haile",
      title: "Mobile App Developer",
      rating: 4.8,
      reviews: 64,
      hourlyRate: "$40/hr",
      skills: ["React Native", "Flutter", "iOS", "Android"],
      location: "Bahir Dar",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
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
        className={`sticky top-0 z-50 transition-colors duration-300 ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center">
                <span className="etn-brand-fancy text-2xl">ETN</span>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                <button
                  className={`text-upwork-body-medium transition-colors duration-200 ${
                    darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  My Jobs
                </button>
                <button
                  className={`text-upwork-body-medium transition-colors duration-200 ${
                    darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  All Contracts
                </button>
                <button
                  className={`text-upwork-body-medium transition-colors duration-200 ${
                    darkMode
                      ? "text-gray-300 hover:text-white"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Reports
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-105 ${
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

              <button
                className={`relative p-2.5 rounded-lg transition-all duration-200 ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <Link to="/messages">
                <button
                  className={`relative p-2.5 rounded-lg transition-all duration-200 group ${
                    darkMode
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <MessageSquare
                    className={`w-5 h-5 ${darkMode ? "group-hover:text-gray-300" : "group-hover:text-gray-700"}`}
                  />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="sr-only">Messages</span>
                </button>
              </Link>

              <DropdownMenu
                userName="Abebe Kebede"
                userEmail="abebe.kebede@example.com"
                userImage={userImage}
                userId="current-user"
                onImageUpload={handleImageUpload}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-upwork-h1 text-gray-900 mb-2">
            Welcome back, Employer
          </h1>
          <p className="text-upwork-body text-gray-600">
            Manage your jobs, contracts, and find the perfect talent
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-upwork-small text-gray-600">
                Active Jobs
              </span>
              <Briefcase className="w-5 h-5 text-[#0084ca]" />
            </div>
            <p className="text-upwork-h2 font-bold text-gray-900">2</p>
            <p className="text-upwork-small text-green-600 mt-1">
              12 new proposals
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-upwork-small text-gray-600">
                Active Contracts
              </span>
              <FileText className="w-5 h-5 text-[#0084ca]" />
            </div>
            <p className="text-upwork-h2 font-bold text-gray-900">2</p>
            <p className="text-upwork-small text-gray-500 mt-1">In progress</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-upwork-small text-gray-600">
                Total Spent
              </span>
              <DollarSign className="w-5 h-5 text-[#0084ca]" />
            </div>
            <p className="text-upwork-h2 font-bold text-gray-900">$3,650</p>
            <p className="text-upwork-small text-gray-500 mt-1">This month</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-upwork-small text-gray-600">Messages</span>
              <MessageSquare className="w-5 h-5 text-[#0084ca]" />
            </div>
            <p className="text-upwork-h2 font-bold text-gray-900">5</p>
            <p className="text-upwork-small text-green-600 mt-1">Unread</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab("jobs")}
                className={`py-4 border-b-2 btn-upwork-secondary text-sm transition-colors ${
                  activeTab === "jobs"
                    ? "border-[#0084ca] text-[#0084ca]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                My Jobs
              </button>
              <button
                onClick={() => setActiveTab("talent")}
                className={`py-4 border-b-2 btn-upwork-secondary text-sm transition-colors ${
                  activeTab === "talent"
                    ? "border-[#0084ca] text-[#0084ca]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Find Talent
              </button>
              <button
                onClick={() => setActiveTab("contracts")}
                className={`py-4 border-b-2 btn-upwork-secondary text-sm transition-colors ${
                  activeTab === "contracts"
                    ? "border-[#0084ca] text-[#0084ca]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Active Contracts
              </button>
              <button
                onClick={() => setActiveTab("messages")}
                className={`py-4 border-b-2 btn-upwork-secondary text-sm transition-colors ${
                  activeTab === "messages"
                    ? "border-[#0084ca] text-[#0084ca]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Messages
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "jobs" && (
              <div>
                {/* Job Management Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-4">
                    <h2 className="text-upwork-h3 text-gray-900">
                      Job Postings
                    </h2>
                    <div className="flex gap-2">
                      {["all", "active", "draft", "closed"].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setJobFilter(filter as any)}
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            jobFilter === filter
                              ? "bg-[#0084ca] text-white"
                              : darkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowJobForm(true)}
                    className="bg-[#0084ca] hover:bg-[#006ba6] text-white btn-upwork-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Job
                  </Button>
                </div>

                {/* Job Form Modal */}
                {showJobForm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div
                      className={`w-full max-w-2xl rounded-xl p-6 ${darkMode ? "bg-gray-800" : "bg-white"}`}
                    >
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">
                          {editingJob ? "Edit Job" : "Post New Job"}
                        </h3>
                        <button
                          onClick={() => setShowJobForm(false)}
                          className={`p-2 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Job Title
                          </label>
                          <Input
                            value={newJob.title}
                            onChange={(e) =>
                              setNewJob({ ...newJob, title: e.target.value })
                            }
                            placeholder="Enter job title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Description
                          </label>
                          <textarea
                            value={newJob.description}
                            onChange={(e) =>
                              setNewJob({
                                ...newJob,
                                description: e.target.value,
                              })
                            }
                            placeholder="Describe the job requirements"
                            className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                            rows={4}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Category
                            </label>
                            <select
                              value={newJob.category_id}
                              onChange={(e) =>
                                setNewJob({
                                  ...newJob,
                                  category_id: parseInt(e.target.value),
                                })
                              }
                              className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                            >
                              <option value="">Select category</option>
                              {(categories || []).map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Experience Level
                            </label>
                            <select
                              value={newJob.experience_level}
                              onChange={(e) =>
                                setNewJob({
                                  ...newJob,
                                  experience_level: e.target.value,
                                })
                              }
                              className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                            >
                              <option value="">Select level</option>
                              <option value="entry">Entry Level</option>
                              <option value="intermediate">Intermediate</option>
                              <option value="expert">Expert</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Budget
                            </label>
                            <Input
                              value={newJob.salary}
                              onChange={(e) =>
                                setNewJob({ ...newJob, salary: e.target.value })
                              }
                              placeholder="$1,000 - $5,000"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Duration
                            </label>
                            <Input
                              value={newJob.duration}
                              onChange={(e) =>
                                setNewJob({
                                  ...newJob,
                                  duration: e.target.value,
                                })
                              }
                              placeholder="1-3 months"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Location
                            </label>
                            <Input
                              value={newJob.location}
                              onChange={(e) =>
                                setNewJob({
                                  ...newJob,
                                  location: e.target.value,
                                })
                              }
                              placeholder="Addis Ababa"
                            />
                          </div>

                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={newJob.remote_allowed}
                              onChange={(e) =>
                                setNewJob({
                                  ...newJob,
                                  remote_allowed: e.target.checked,
                                })
                              }
                              className="mr-2"
                            />
                            <label className="text-sm font-medium">
                              Remote work allowed
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-6">
                        <Button
                          onClick={handleCreateJob}
                          className="bg-[#0084ca] hover:bg-[#006ba6] text-white"
                        >
                          {editingJob ? "Update Job" : "Post Job"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowJobForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading State */}
                {loading && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0084ca]"></div>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Jobs List */}
                {!loading && !error && (
                  <div className="space-y-4">
                    {filteredJobs.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">
                          No jobs found. Create your first job to get started!
                        </p>
                      </div>
                    ) : (
                      (filteredJobs || []).map((job) => (
                        <div
                          key={job.id}
                          className={`border rounded-lg p-6 hover:shadow-md transition-shadow ${
                            darkMode
                              ? "border-gray-700 bg-gray-800"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-upwork-h4 text-gray-900">
                                  {job.title}
                                </h3>
                                <span
                                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    job.status === "active"
                                      ? "bg-green-100 text-green-700"
                                      : job.status === "draft"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : job.status === "closed"
                                          ? "bg-red-100 text-red-700"
                                          : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {job.status}
                                </span>
                                {job.remote_allowed && (
                                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                    Remote
                                  </span>
                                )}
                              </div>

                              <p
                                className={`text-sm mb-3 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
                              >
                                {job.description}
                              </p>

                              <div className="flex items-center gap-4 text-upwork-small text-gray-600">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  Posted{" "}
                                  {new Date(
                                    job.created_at,
                                  ).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText className="w-4 h-4" />
                                  {job.applications_count || 0} proposals
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {job.salary}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {job.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  {job.location}
                                </span>
                              </div>

                              <div className="flex flex-wrap gap-2 mt-3">
                                {(job.skills || []).map((skill, index) => (
                                  <span
                                    key={index}
                                    className={`px-2 py-1 text-xs rounded-full ${
                                      darkMode
                                        ? "bg-gray-700 text-gray-300"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedJob(job)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProposals(job.id)}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              View Proposals ({job.applications_count || 0})
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditJob(job)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteJob(job.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "talent" && (
              <div>
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for freelancers by skills, name, or expertise..."
                      className="flex-1"
                    />
                    <Button className="bg-[#0084ca] hover:bg-[#006ba6] text-white">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Recommended Talent
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recommendedTalent.map((talent) => (
                    <div
                      key={talent.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-4 mb-4">
                        <img
                          src={talent.image}
                          alt={talent.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {talent.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {talent.title}
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">
                                {talent.rating}
                              </span>
                            </div>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">
                              {talent.reviews} reviews
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            {talent.hourlyRate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{talent.location}</span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {talent.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 bg-[#0084ca] hover:bg-[#006ba6] text-white">
                          Invite to Job
                        </Button>
                        <Link
                          to={`/freelancer-public-profile/${talent.id}`}
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full">
                            View Profile
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "contracts" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Active Contracts
                </h2>

                <div className="space-y-4">
                  {activeContracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {contract.project}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {contract.freelancer} • {contract.role}
                          </p>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                            {contract.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total Paid</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {contract.earnings}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">
                            Project Progress
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {contract.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#0084ca] h-2 rounded-full transition-all"
                            style={{ width: `${contract.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Button variant="outline" size="sm">
                          View Contract
                        </Button>
                        <Button variant="outline" size="sm">
                          Message
                        </Button>
                        <Button variant="outline" size="sm">
                          View Work
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-600">
                  Start a conversation with freelancers you're interested in
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  {
    /* Proposals Modal */
  }
  {
    showProposalsModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div
          className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2
                className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Job Proposals
              </h2>
              <button
                onClick={() => setShowProposalsModal(false)}
                className={`p-2 rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {proposalsLoading && (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading proposals...</p>
              </div>
            )}

            {proposalsError && (
              <div className="text-center py-8">
                <p className="text-red-500">{proposalsError}</p>
              </div>
            )}

            {!proposalsLoading && !proposalsError && proposals.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No proposals yet for this job.</p>
              </div>
            )}

            {!proposalsLoading && !proposalsError && proposals.length > 0 && (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className={`border rounded-lg p-6 ${darkMode ? "border-gray-700 bg-gray-700" : "border-gray-200 bg-gray-50"}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        {proposal.profile_image && (
                          <img
                            src={proposal.profile_image}
                            alt={proposal.talent_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h3
                            className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                          >
                            {proposal.talent_name}
                          </h3>
                          <p
                            className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            {proposal.talent_email}
                          </p>
                          {proposal.profile_title && (
                            <p
                              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                            >
                              {proposal.profile_title}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            proposal.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : proposal.status === "reviewed"
                                ? "bg-blue-100 text-blue-700"
                                : proposal.status === "shortlisted"
                                  ? "bg-purple-100 text-purple-700"
                                  : proposal.status === "rejected"
                                    ? "bg-red-100 text-red-700"
                                    : proposal.status === "hired"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {proposal.status}
                        </span>
                      </div>
                    </div>

                    {proposal.cover_letter && (
                      <div className="mb-4">
                        <h4
                          className={`font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          Cover Letter
                        </h4>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          {proposal.cover_letter}
                        </p>
                      </div>
                    )}

                    {proposal.proposal && (
                      <div className="mb-4">
                        <h4
                          className={`font-medium mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          Proposal
                        </h4>
                        <p
                          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          {proposal.proposal}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      {proposal.hourly_rate && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {proposal.hourly_rate}/hour
                        </span>
                      )}
                      {proposal.talent_location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {proposal.talent_location}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Applied{" "}
                        {new Date(proposal.applied_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {proposal.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateApplicationStatus(
                                proposal.id,
                                "reviewed",
                              )
                            }
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600"
                          >
                            Mark as Reviewed
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateApplicationStatus(
                                proposal.id,
                                "shortlisted",
                              )
                            }
                            className="bg-purple-50 hover:bg-purple-100 text-purple-600"
                          >
                            Shortlist
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateApplicationStatus(
                                proposal.id,
                                "rejected",
                              )
                            }
                            className="bg-red-50 hover:bg-red-100 text-red-600"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {proposal.status === "reviewed" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateApplicationStatus(
                                proposal.id,
                                "shortlisted",
                              )
                            }
                            className="bg-purple-50 hover:bg-purple-100 text-purple-600"
                          >
                            Shortlist
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateApplicationStatus(
                                proposal.id,
                                "rejected",
                              )
                            }
                            className="bg-red-50 hover:bg-red-100 text-red-600"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {proposal.status === "shortlisted" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateApplicationStatus(
                                proposal.id,
                                "hired",
                              )
                            }
                            className="bg-green-50 hover:bg-green-100 text-green-600"
                          >
                            Hire
                          </Button>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateApplicationStatus(
                                proposal.id,
                                "rejected",
                              )
                            }
                            className="bg-red-50 hover:bg-red-100 text-red-600"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
