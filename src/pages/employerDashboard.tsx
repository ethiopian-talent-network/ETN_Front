import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import DropdownMenu from "../components/ui/DropdownMenu";
import { useDarkMode } from "../contexts/DarkModeContext";
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

interface Job {
  id: number;
  title: string;
  description: string;
  category: string;
  experience: string;
  budget: string;
  duration: string;
  location: string;
  remote: boolean;
  posted: string;
  proposals: number;
  status: "active" | "draft" | "closed" | "paused";
  skills: string[];
  applicants: Applicant[];
}

interface Applicant {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  proposals: number;
  earnings: string;
  match: number;
  applied: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "hired";
}

export default function EmployerDashboard() {
  const { darkMode, toggleDarkMode } = useDarkMode();
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

  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 1,
      title: "Senior React Developer for E-commerce Platform",
      description:
        "Looking for an experienced React developer to build a modern SaaS dashboard with TypeScript and Tailwind CSS. The project involves creating a comprehensive e-commerce management system.",
      category: "Web Development",
      experience: "Senior",
      budget: "$3,000 - $5,000",
      duration: "1-3 months",
      location: "Addis Ababa",
      remote: true,
      posted: "2 days ago",
      proposals: 12,
      status: "active",
      skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB"],
      applicants: [
        {
          id: 1,
          name: "Yohannes Tadesse",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
          rating: 4.9,
          proposals: 45,
          earnings: "$12,500",
          match: 95,
          applied: "2 hours ago",
          status: "pending",
        },
        {
          id: 2,
          name: "Sara Mohammed",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
          rating: 4.7,
          proposals: 32,
          earnings: "$8,900",
          match: 88,
          applied: "5 hours ago",
          status: "reviewed",
        },
      ],
    },
    {
      id: 2,
      title: "UI/UX Designer for Mobile Banking App",
      description:
        "Need a talented UI/UX designer to create a modern mobile app design for our fintech startup. Great fit for your design skills! The app will serve thousands of Ethiopian users.",
      category: "Design",
      experience: "Mid",
      budget: "$1,500 - $2,500",
      duration: "2-4 weeks",
      location: "Addis Ababa",
      remote: true,
      posted: "5 days ago",
      proposals: 8,
      status: "active",
      skills: [
        "Figma",
        "Adobe XD",
        "Mobile Design",
        "Prototyping",
        "User Research",
      ],
      applicants: [
        {
          id: 3,
          name: "Meron Alemayehu",
          avatar:
            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
          rating: 5.0,
          proposals: 28,
          earnings: "$6,200",
          match: 92,
          applied: "1 day ago",
          status: "shortlisted",
        },
      ],
    },
    {
      id: 3,
      title: "Full Stack Developer - Healthcare Platform",
      description:
        "Seeking a full stack developer for healthcare platform development with modern tech stack. Must have experience with HIPAA compliance.",
      category: "Web Development",
      experience: "Senior",
      budget: "$4,000 - $6,000",
      duration: "2-3 months",
      location: "Bahir Dar",
      remote: false,
      posted: "1 week ago",
      proposals: 6,
      status: "draft",
      skills: ["React", "Python", "Django", "PostgreSQL", "AWS"],
      applicants: [],
    },
  ]);

  const [newJob, setNewJob] = useState<Partial<Job>>({
    title: "",
    description: "",
    category: "",
    experience: "",
    budget: "",
    duration: "",
    location: "",
    remote: false,
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

  const handleCreateJob = () => {
    if (editingJob) {
      setJobs(
        jobs.map((job) =>
          job.id === editingJob.id
            ? { ...editingJob, ...(newJob as Job) }
            : job,
        ),
      );
      setEditingJob(null);
    } else {
      const job: Job = {
        id: jobs.length + 1,
        title: newJob.title || "",
        description: newJob.description || "",
        category: newJob.category || "",
        experience: newJob.experience || "",
        budget: newJob.budget || "",
        duration: newJob.duration || "",
        location: newJob.location || "",
        remote: newJob.remote || false,
        posted: "Just now",
        proposals: 0,
        status: "draft",
        skills: newJob.skills || [],
        applicants: [],
      };
      setJobs([...jobs, job]);
    }
    setNewJob({
      title: "",
      description: "",
      category: "",
      experience: "",
      budget: "",
      duration: "",
      location: "",
      remote: false,
      skills: [],
    });
    setShowJobForm(false);
  };

  const handleDeleteJob = (jobId: number) => {
    setJobs(jobs.filter((job) => job.id !== jobId));
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setNewJob(job);
    setShowJobForm(true);
  };

  const handleUpdateApplicantStatus = (
    jobId: number,
    applicantId: number,
    status: Applicant["status"],
  ) => {
    setJobs(
      jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              applicants: job.applicants.map((applicant) =>
                applicant.id === applicantId
                  ? { ...applicant, status }
                  : applicant,
              ),
            }
          : job,
      ),
    );
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
                              value={newJob.category}
                              onChange={(e) =>
                                setNewJob({
                                  ...newJob,
                                  category: e.target.value,
                                })
                              }
                              className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                            >
                              <option value="">Select category</option>
                              <option value="Web Development">
                                Web Development
                              </option>
                              <option value="Mobile Development">
                                Mobile Development
                              </option>
                              <option value="Design">Design</option>
                              <option value="Marketing">Marketing</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Experience Level
                            </label>
                            <select
                              value={newJob.experience}
                              onChange={(e) =>
                                setNewJob({
                                  ...newJob,
                                  experience: e.target.value,
                                })
                              }
                              className={`w-full p-3 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}`}
                            >
                              <option value="">Select level</option>
                              <option value="Junior">Junior</option>
                              <option value="Mid">Mid</option>
                              <option value="Senior">Senior</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Budget
                            </label>
                            <Input
                              value={newJob.budget}
                              onChange={(e) =>
                                setNewJob({ ...newJob, budget: e.target.value })
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
                              checked={newJob.remote}
                              onChange={(e) =>
                                setNewJob({
                                  ...newJob,
                                  remote: e.target.checked,
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

                {/* Jobs List */}
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
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
                            {job.remote && (
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
                              Posted {job.posted}
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {job.proposals} proposals
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              {job.budget}
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
                            {job.skills.map((skill, index) => (
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

                      {/* Applicants Preview */}
                      {job.applicants.length > 0 && (
                        <div
                          className={`mt-4 pt-4 border-t ${darkMode ? "border-gray-700" : "border-gray-200"}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold">
                              Recent Applicants
                            </h4>
                            <Button variant="outline" size="sm">
                              View All ({job.applicants.length})
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {job.applicants.slice(0, 2).map((applicant) => (
                              <div
                                key={applicant.id}
                                className={`flex items-center justify-between p-3 rounded-lg ${
                                  darkMode ? "bg-gray-700" : "bg-gray-50"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={applicant.avatar}
                                    alt={applicant.name}
                                    className="w-8 h-8 rounded-full"
                                  />
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">
                                        {applicant.name}
                                      </span>
                                      <span className="text-xs text-yellow-600">
                                        {"\u2605"} {applicant.rating}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span>{applicant.match}% match</span>
                                      <span>\u2022</span>
                                      <span>{applicant.applied}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <select
                                    value={applicant.status}
                                    onChange={(e) =>
                                      handleUpdateApplicantStatus(
                                        job.id,
                                        applicant.id,
                                        e.target.value as Applicant["status"],
                                      )
                                    }
                                    className={`text-xs px-2 py-1 rounded ${
                                      applicant.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : applicant.status === "reviewed"
                                          ? "bg-blue-100 text-blue-700"
                                          : applicant.status === "shortlisted"
                                            ? "bg-green-100 text-green-700"
                                            : applicant.status === "rejected"
                                              ? "bg-red-100 text-red-700"
                                              : "bg-purple-100 text-purple-700"
                                    }`}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="shortlisted">
                                      Shortlisted
                                    </option>
                                    <option value="rejected">Rejected</option>
                                    <option value="hired">Hired</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
}
