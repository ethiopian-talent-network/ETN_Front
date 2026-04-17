import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  AlertTriangle,
  Search,
  Bell,
  HelpCircle,
  User,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Edit,
  Menu,
  X,
} from "lucide-react";

export default function TalentDashboard() {
  const [activeTab, setActiveTab] = useState("bestMatches");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedJobs, setSavedJobs] = useState<number[]>([3]); // Start with one saved job

  const jobs = [
    {
      id: 1,
      title: "App support/maintenance",
      type: "Fixed-price",
      level: "Intermediate",
      budget: "$5",
      posted: "1 hour ago",
      description:
        "I am looking for a developer to support and maintain my app. The app is built with React Native and needs some bug fixes and feature updates. This is an ongoing project with potential for long-term collaboration.",
      skills: ["Android"],
      saved: false,
    },
    {
      id: 2,
      title: "React Frontend Developer",
      type: "Hourly",
      level: "Expert",
      budget: "$45-$55/hr",
      posted: "3 hours ago",
      description:
        "We need an experienced React developer to join our team and work on a large-scale web application. You'll be responsible for building new features and optimizing existing code.",
      skills: ["React", "TypeScript", "Node.js"],
      saved: false,
    },
    {
      id: 3,
      title: "UI/UX Designer for Mobile App",
      type: "Fixed-price",
      level: "Intermediate",
      budget: "$3,000",
      posted: "1 day ago",
      description:
        "Looking for a talented UI/UX designer to create beautiful and intuitive designs for our mobile app. Must have experience with mobile-first design principles.",
      skills: ["UI/UX", "Figma", "Mobile"],
      saved: true,
    },
  ];

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId],
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-[#4285F4]">ETN</div>
                <span className="text-sm text-gray-600 hidden md:inline">
                  Ethiopian Talent Network
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-6">
                <a
                  href="#"
                  className="text-gray-700 hover:text-[#4285F4] font-medium"
                >
                  Find work
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-[#4285F4] font-medium"
                >
                  Deliver work
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-[#4285F4] font-medium"
                >
                  Manage finances
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-[#4285F4] font-medium"
                >
                  Messages
                </a>
              </nav>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search"
                    className="pl-10 w-64 border-gray-300 focus:border-[#4285F4]"
                  />
                </div>
              </div>

              {/* Icons */}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900"
              >
                <Bell className="h-5 w-5" />
              </Button>

              {/* User Avatar */}
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold">
                BT
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <a
                  href="#"
                  className="text-gray-700 hover:text-green-600 font-medium py-2"
                >
                  Find work
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-green-600 font-medium py-2"
                >
                  Deliver work
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-green-600 font-medium py-2"
                >
                  Manage finances
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-green-600 font-medium py-2"
                >
                  Messages
                </a>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Get Hired Faster Section */}
            <div className="mb-6 bg-gradient-to-r from-[#4285F4] to-[#4285F4] text-white rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">Get hired faster</h2>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-white text-[#4285F4] px-2 py-1 rounded text-xs font-semibold">
                      BOOSTED
                    </span>
                    <span className="text-green-100">Proposals</span>
                  </div>
                  <p className="text-green-100 text-sm">
                    Boosted proposals are highlighted in clients' lists and are
                    seen on average 25% more often.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="bg-white text-[#4285F4] hover:bg-gray-100"
                >
                  Learn how
                </Button>
              </div>
            </div>

            {/* Search for Jobs */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for jobs"
                  className="pl-12 h-12 text-lg border-gray-300 focus:border-[#4285F4]"
                />
              </div>
            </div>

            {/* Jobs You Might Like */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  Jobs you might like
                </h2>
              </div>
              <div className="p-6">
                {/* Tabs */}
                <div className="flex space-x-8 mb-6 border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("bestMatches")}
                    className={`pb-3 px-1 font-medium text-sm ${
                      activeTab === "bestMatches"
                        ? "text-[#4285F4] border-b-2 border-[#4285F4]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Best Matches
                  </button>
                  <button
                    onClick={() => setActiveTab("mostRecent")}
                    className={`pb-3 px-1 font-medium text-sm ${
                      activeTab === "mostRecent"
                        ? "text-[#4285F4] border-b-2 border-[#4285F4]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Most Recent
                  </button>
                  <button
                    onClick={() => setActiveTab("savedJobs")}
                    className={`pb-3 px-1 font-medium text-sm flex items-center ${
                      activeTab === "savedJobs"
                        ? "text-[#4285F4] border-b-2 border-[#4285F4]"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Saved Jobs{" "}
                    {savedJobs.length > 0 && (
                      <span className="ml-2 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                        {savedJobs.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Job Listings */}
                <div className="space-y-4">
                  {activeTab === "bestMatches" &&
                    jobs
                      .filter((job) => !savedJobs.includes(job.id))
                      .map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          onSave={() => toggleSaveJob(job.id)}
                        />
                      ))}
                  {activeTab === "mostRecent" &&
                    jobs
                      .slice()
                      .reverse()
                      .filter((job) => !savedJobs.includes(job.id))
                      .map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          onSave={() => toggleSaveJob(job.id)}
                        />
                      ))}
                  {activeTab === "savedJobs" &&
                    jobs
                      .filter((job) => savedJobs.includes(job.id))
                      .map((job) => (
                        <JobCard
                          key={job.id}
                          job={job}
                          onSave={() => toggleSaveJob(job.id)}
                        />
                      ))}
                  {activeTab === "savedJobs" && savedJobs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No saved jobs yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-80">
            {/* Profile Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xl font-semibold">
                  BT
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Bonsa T.</h3>
                  <p className="text-sm text-gray-600">Web and Mobile App...</p>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Complete your profile
                  </span>
                  <span className="text-sm font-medium text-[#4285F4]">
                    40%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#4285F4] h-2 rounded-full"
                    style={{ width: "40%" }}
                  ></div>
                </div>
              </div>

              <Button
                variant="link"
                className="text-[#4285F4] hover:text-[#4285F4] p-0 h-auto"
              >
                Complete your profile
              </Button>
            </div>

            {/* Identity Verification */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Identity verification
                  </h3>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Verify your identity to build trust with clients and access more
                features.
              </p>
              <Button
                variant="link"
                className="text-[#4285F4] hover:text-[#4285F4] p-0 h-auto"
              >
                Get an IDV Badge
              </Button>
            </div>

            {/* Promote with Ads */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Promote with ads
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Availability badge
                    </h4>
                    <p className="text-sm text-gray-600">
                      Show clients you're available
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Off</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Boost your profile
                    </h4>
                    <p className="text-sm text-gray-600">
                      Get seen by more clients
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Off</span>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Connects */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Connects</h3>
                <span className="text-2xl font-bold text-gray-900">20</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Use connects to submit proposals for jobs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="text-2xl font-bold text-[#4285F4]">ETN</div>
                <span className="text-sm text-gray-400">
                  Ethiopian Talent Network
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting Ethiopian talent with global opportunities. Your
                gateway to freelance success.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] text-sm"
                  >
                    Find Work
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] text-sm"
                  >
                    Deliver Work
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] text-sm"
                  >
                    Manage Finances
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] text-sm"
                  >
                    Messages
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] text-sm"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] text-sm"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] text-sm"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] text-sm"
                  >
                    Success Stories
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-white mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] text-sm"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] text-sm"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] text-sm"
                  >
                    Twitter
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-[#4285F4] text-sm"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Ethiopian Talent Network (ETN). All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#4285F4] text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#4285F4] text-sm"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-[#4285F4] text-sm"
                >
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Job Card Component
function JobCard({ job, onSave }: { job: any; onSave: () => void }) {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const isSaved = job.saved;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <span>Posted {job.posted}</span>
            <span>•</span>
            <span>{job.type}</span>
            <span>•</span>
            <span>{job.level}</span>
            <span>•</span>
            <span>Est. Budget: {job.budget}</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {job.title}
          </h3>
          <p className="text-gray-700 text-sm mb-3">
            {showFullDescription
              ? job.description
              : `${job.description.substring(0, 150)}...`}
            <Button
              variant="link"
              className="text-[#4285F4] hover:text-[#4285F4] p-0 h-auto ml-1"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "less" : "more"}
            </Button>
          </p>
          <div className="flex items-center space-x-2">
            {job.skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <ThumbsUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <ThumbsDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={
              isSaved ? "text-red-600" : "text-gray-600 hover:text-red-600"
            }
            onClick={onSave}
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}
