import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Search,
  Briefcase,
  MessageSquare,
  Bell,
  User,
  ChevronDown,
  Star,
  MapPin,
  DollarSign,
  Clock,
  FileText,
  TrendingUp,
  Send,
  Filter,
  Bookmark,
  CheckCircle2,
} from "lucide-react";

export default function FreelancerDashboard() {
  const [activeTab, setActiveTab] = useState<"jobs" | "proposals" | "contracts" | "earnings">(
    "jobs"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const availableJobs = [
    {
      id: 1,
      title: "React Developer for SaaS Dashboard",
      client: "TechCorp Ethiopia",
      posted: "3 hours ago",
      budget: "$2,500 - $4,000",
      duration: "1-3 months",
      proposals: 5,
      description:
        "Looking for an experienced React developer to build a modern dashboard for our SaaS platform...",
      skills: ["React", "TypeScript", "Tailwind CSS", "API Integration"],
      level: "Intermediate",
    },
    {
      id: 2,
      title: "Mobile App UI/UX Designer",
      client: "StartupHub",
      posted: "1 day ago",
      budget: "$1,000 - $2,000",
      duration: "Less than 1 month",
      proposals: 12,
      description:
        "We need a creative designer to create modern, user-friendly designs for our mobile application...",
      skills: ["Figma", "UI/UX Design", "Mobile Design", "Prototyping"],
      level: "Expert",
    },
    {
      id: 3,
      title: "Full Stack Developer - E-commerce Platform",
      client: "ShopEthiopia",
      posted: "2 days ago",
      budget: "$5,000 - $8,000",
      duration: "3-6 months",
      proposals: 8,
      description:
        "Build a complete e-commerce platform with payment integration and inventory management...",
      skills: ["Node.js", "React", "MongoDB", "Payment APIs"],
      level: "Expert",
    },
  ];

  const myProposals = [
    {
      id: 1,
      job: "WordPress Website Development",
      client: "Creative Agency",
      submitted: "2 days ago",
      bidAmount: "$1,500",
      status: "Active",
      cover: "Highlighted my 5 years of WordPress experience...",
    },
    {
      id: 2,
      job: "Logo Design for Coffee Shop",
      client: "Buna Cafe",
      submitted: "5 days ago",
      bidAmount: "$300",
      status: "Under Review",
      cover: "Shared portfolio with similar restaurant branding projects...",
    },
  ];

  const activeProjects = [
    {
      id: 1,
      title: "E-commerce Dashboard",
      client: "TechVenture Ltd",
      earnings: "$2,450",
      progress: 75,
      deadline: "May 15, 2026",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Mobile App Design",
      client: "Innovation Hub",
      earnings: "$1,800",
      progress: 90,
      deadline: "April 25, 2026",
      status: "In Progress",
    },
  ];

  const earningsData = {
    thisMonth: "$4,250",
    pending: "$1,200",
    available: "$3,050",
    lifetime: "$28,450",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-[#0084ca]">ETN</span>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Find Jobs
                </button>
                <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  My Proposals
                </button>
                <button className="text-sm font-medium text-gray-700 hover:text-gray-900">
                  Reports
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <Link to="/messages">
                <button className="relative p-2 text-gray-400 hover:text-gray-600">
                  <MessageSquare className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </Link>

              <Link to="/freelancer-profile">
                <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Freelancer</h1>
          <p className="text-gray-600">Find your next opportunity and manage your projects</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">This Month</span>
              <DollarSign className="w-5 h-5 text-[#0084ca]" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{earningsData.thisMonth}</p>
            <p className="text-sm text-green-600 mt-1">+15% from last month</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active Projects</span>
              <Briefcase className="w-5 h-5 text-[#0084ca]" />
            </div>
            <p className="text-3xl font-bold text-gray-900">2</p>
            <p className="text-sm text-gray-500 mt-1">In progress</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Pending Proposals</span>
              <FileText className="w-5 h-5 text-[#0084ca]" />
            </div>
            <p className="text-3xl font-bold text-gray-900">2</p>
            <p className="text-sm text-gray-500 mt-1">Awaiting response</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Job Success</span>
              <TrendingUp className="w-5 h-5 text-[#0084ca]" />
            </div>
            <p className="text-3xl font-bold text-gray-900">95%</p>
            <p className="text-sm text-green-600 mt-1">Excellent rating</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              <button
                onClick={() => setActiveTab("jobs")}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "jobs"
                    ? "border-[#0084ca] text-[#0084ca]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Find Jobs
              </button>
              <button
                onClick={() => setActiveTab("proposals")}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "proposals"
                    ? "border-[#0084ca] text-[#0084ca]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                My Proposals
              </button>
              <button
                onClick={() => setActiveTab("contracts")}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "contracts"
                    ? "border-[#0084ca] text-[#0084ca]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Active Contracts
              </button>
              <button
                onClick={() => setActiveTab("earnings")}
                className={`py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "earnings"
                    ? "border-[#0084ca] text-[#0084ca]"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Earnings
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "jobs" && (
              <div>
                <div className="mb-6">
                  <div className="flex gap-2 mb-4">
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for jobs by skills, title, or keywords..."
                      className="flex-1"
                    />
                    <Button className="bg-[#0084ca] hover:bg-[#006ba6] text-white">
                      <Search className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filters
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600">Quick filters:</span>
                    {["Best matches", "Most recent", "Hourly rate", "Fixed price"].map((filter) => (
                      <button
                        key={filter}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:border-gray-400 transition-colors"
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Jobs you might like ({availableJobs.length})
                </h2>

                <div className="space-y-6">
                  {availableJobs.map((job) => (
                    <div
                      key={job.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            <button className="text-gray-400 hover:text-[#0084ca]">
                              <Bookmark className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Posted by {job.client} • {job.posted}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                          {job.level}
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {job.budget}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {job.proposals} proposals
                        </span>
                      </div>

                      <div className="flex gap-3">
                        <Button className="bg-[#0084ca] hover:bg-[#006ba6] text-white">
                          <Send className="w-4 h-4 mr-2" />
                          Submit Proposal
                        </Button>
                        <Button variant="outline">View Details</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "proposals" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  My Proposals ({myProposals.length})
                </h2>

                <div className="space-y-4">
                  {myProposals.map((proposal) => (
                    <div
                      key={proposal.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {proposal.job}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Client: {proposal.client} • Submitted {proposal.submitted}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-1">Your bid</p>
                          <p className="text-xl font-bold text-gray-900">{proposal.bidAmount}</p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-4 italic">
                        Cover letter: "{proposal.cover}"
                      </p>

                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-1 text-sm font-medium rounded-full ${
                            proposal.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {proposal.status}
                        </span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit Proposal
                          </Button>
                          <Button variant="outline" size="sm">
                            Withdraw
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "contracts" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Active Contracts</h2>

                <div className="space-y-4">
                  {activeProjects.map((project) => (
                    <div
                      key={project.id}
                      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {project.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">Client: {project.client}</p>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                            {project.status}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Earned so far</p>
                          <p className="text-2xl font-bold text-gray-900">{project.earnings}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-medium text-gray-900">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#0084ca] h-2 rounded-full transition-all"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          Deadline: <span className="font-medium">{project.deadline}</span>
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Contract
                          </Button>
                          <Button variant="outline" size="sm">
                            Submit Work
                          </Button>
                          <Button variant="outline" size="sm">
                            Message Client
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "earnings" && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Earnings Overview</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-br from-[#0084ca] to-[#006ba6] rounded-xl p-6 text-white">
                    <p className="text-sm opacity-90 mb-2">Available to Withdraw</p>
                    <p className="text-3xl font-bold mb-1">{earningsData.available}</p>
                    <Button className="mt-4 bg-white text-[#0084ca] hover:bg-gray-100 w-full">
                      Withdraw Funds
                    </Button>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Pending Clearance</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {earningsData.pending}
                    </p>
                    <p className="text-sm text-gray-500">Available in 5-7 days</p>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Lifetime Earnings</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">
                      {earningsData.lifetime}
                    </p>
                    <p className="text-sm text-green-600 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      Growing steadily
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Recent Transactions
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        type: "Payment received",
                        project: "E-commerce Dashboard",
                        amount: "+$1,200",
                        date: "April 15, 2026",
                      },
                      {
                        type: "Payment received",
                        project: "Mobile App Design",
                        amount: "+$900",
                        date: "April 10, 2026",
                      },
                      {
                        type: "Withdrawal",
                        project: "To bank account",
                        amount: "-$2,000",
                        date: "April 5, 2026",
                      },
                    ].map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.amount.startsWith("+")
                                ? "bg-green-100"
                                : "bg-gray-100"
                            }`}
                          >
                            {transaction.amount.startsWith("+") ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                              <DollarSign className="w-5 h-5 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.type}</p>
                            <p className="text-sm text-gray-600">{transaction.project}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${
                              transaction.amount.startsWith("+")
                                ? "text-green-600"
                                : "text-gray-900"
                            }`}
                          >
                            {transaction.amount}
                          </p>
                          <p className="text-sm text-gray-500">{transaction.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
