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
} from "lucide-react";

export default function EmployerDashboard() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [activeTab, setActiveTab] = useState<
    "jobs" | "talent" | "contracts" | "messages"
  >("jobs");
  const [searchQuery, setSearchQuery] = useState("");
  const [userImage, setUserImage] = useState<string | undefined>();

  const handleImageUpload = (file: File) => {
    // Create a preview URL for the uploaded image
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUserImage(result);

      // Here you would typically upload to your backend
      console.log("Uploading image:", file);
      // TODO: Implement actual upload logic to your API
    };
    reader.readAsDataURL(file);
  };

  const activeJobs = [
    {
      id: 1,
      title: "Full Stack Developer for E-commerce Platform",
      posted: "2 days ago",
      proposals: 12,
      budget: "$3,000 - $5,000",
      status: "active",
    },
    {
      id: 2,
      title: "UI/UX Designer for Mobile App",
      posted: "5 days ago",
      proposals: 8,
      budget: "$1,500 - $2,500",
      status: "active",
    },
  ];

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
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-upwork-h3 text-gray-900">
                    Active Job Postings
                  </h2>
                  <Link to="/post-job">
                    <Button className="bg-[#0084ca] hover:bg-[#006ba6] text-white btn-upwork-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Post New Job
                    </Button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {activeJobs.map((job) => (
                    <div
                      key={job.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-upwork-h4 text-gray-900 mb-2">
                            {job.title}
                          </h3>
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
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-upwork-small font-medium rounded-full">
                          {job.status}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" size="sm">
                          View Proposals
                        </Button>
                        <Button variant="outline" size="sm">
                          Edit Job
                        </Button>
                      </div>
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
