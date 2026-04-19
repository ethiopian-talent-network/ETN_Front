import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import DropdownMenu from "../components/ui/DropdownMenu";
import { useDarkMode } from "../contexts/DarkModeContext";
import {
  MessageSquare,
  Bell,
  DollarSign,
  Clock,
  Filter,
  Moon,
  Sun,
} from "lucide-react";

export default function FreelancerDashboard() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState("");
  const [userImage, setUserImage] = useState<string | undefined>();
  const [activeSection, setActiveSection] = useState<
    "best-matches" | "most-recently" | "saved-jobs"
  >("best-matches");

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUserImage(result);
      console.log("Uploading image:", file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-gradient-to-br from-gray-50 to-gray-100"
      }`}
    >
      <header
        className={`sticky top-0 z-50 shadow-sm transition-colors duration-300 ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-b border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center group">
                <span className="etn-brand-fancy text-2xl transition-transform group-hover:scale-105">
                  ETN
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-8">
                <button
                  className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    darkMode
                      ? "text-gray-300 hover:text-[#0084ca]"
                      : "text-gray-700 hover:text-[#0084ca]"
                  }`}
                >
                  Find Jobs
                </button>
                <button
                  className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    darkMode
                      ? "text-gray-300 hover:text-[#0084ca]"
                      : "text-gray-700 hover:text-[#0084ca]"
                  }`}
                >
                  My Proposals
                </button>
                <button
                  className={`text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    darkMode
                      ? "text-gray-300 hover:text-[#0084ca]"
                      : "text-gray-700 hover:text-[#0084ca]"
                  }`}
                >
                  Deliver Works
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
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2
                className={`text-xl font-bold mb-6 transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Your Journey to Success
              </h2>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <div className="flex flex-col items-center text-center group">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0084ca] to-[#006ba6] text-white rounded-full flex items-center justify-center font-bold text-sm mb-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    1
                  </div>
                  <h3
                    className={`text-sm font-semibold mb-1 transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Complete Profile
                  </h3>
                  <p
                    className={`text-xs max-w-24 transition-colors duration-300 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Build your professional profile
                  </p>
                </div>

                <div className="text-gray-400 text-2xl self-start mt-4 animate-pulse">
                  →
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0084ca] to-[#006ba6] text-white rounded-full flex items-center justify-center font-bold text-sm mb-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    2
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Browse Jobs
                  </h3>
                  <p
                    className={`text-xs max-w-24 transition-colors duration-300 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Find perfect opportunities
                  </p>
                </div>

                <div
                  className={`text-2xl self-start mt-4 animate-pulse transition-colors duration-300 ${
                    darkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  →
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0084ca] to-[#006ba6] text-white rounded-full flex items-center justify-center font-bold text-sm mb-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    3
                  </div>
                  <h3
                    className={`text-sm font-semibold mb-1 transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Get Hired
                  </h3>
                  <p
                    className={`text-xs max-w-24 transition-colors duration-300 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Apply and win projects
                  </p>
                </div>

                <div
                  className={`text-2xl self-start mt-4 animate-pulse transition-colors duration-300 ${
                    darkMode ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  →
                </div>

                <div className="flex flex-col items-center text-center group">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0084ca] to-[#006ba6] text-white rounded-full flex items-center justify-center font-bold text-sm mb-2 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    4
                  </div>
                  <h3
                    className={`text-sm font-semibold mb-1 transition-colors duration-300 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Grow Career
                  </h3>
                  <p
                    className={`text-xs max-w-24 transition-colors duration-300 ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Build your reputation
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`rounded-xl shadow-lg overflow-hidden transition-colors duration-300 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="p-6">
                <div>
                  {/* Navigation Links */}
                  <div className="mb-6">
                    <div className="flex gap-6 mb-4">
                      <button
                        onClick={() => setActiveSection("best-matches")}
                        className={`text-sm font-medium transition-colors duration-200 ${
                          activeSection === "best-matches"
                            ? "text-[#0084ca]"
                            : "text-gray-600 hover:text-[#0084ca]"
                        }`}
                      >
                        Best Matches →
                      </button>
                      <button
                        onClick={() => setActiveSection("most-recently")}
                        className={`text-sm font-medium transition-colors duration-200 ${
                          activeSection === "most-recently"
                            ? "text-[#0084ca]"
                            : "text-gray-600 hover:text-[#0084ca]"
                        }`}
                      >
                        Most Recently →
                      </button>
                      <button
                        onClick={() => setActiveSection("saved-jobs")}
                        className={`text-sm font-medium transition-colors duration-200 ${
                          activeSection === "saved-jobs"
                            ? "text-[#0084ca]"
                            : "text-gray-600 hover:text-[#0084ca]"
                        }`}
                      >
                        Saved Jobs →
                      </button>
                    </div>
                  </div>

                  {/* Search and Filter */}
                  <div className="mb-6">
                    <div className="flex gap-2 mb-4">
                      <Input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1"
                      />
                      <Button variant="outline">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                    </div>
                  </div>

                  {/* Best Matches Section */}
                  {activeSection === "best-matches" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Best Matches
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-[#0084ca] hover:-translate-y-1 bg-white">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Senior React Developer
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                TechCorp Ethiopia • 2 hours ago
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-200">
                              95% Match
                            </span>
                          </div>
                          <p className="text-gray-700 mb-4">
                            Looking for an experienced React developer to build
                            a modern SaaS dashboard with TypeScript and Tailwind
                            CSS. Perfect match for your skills!
                          </p>
                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              $3,000 - $5,000
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              1-3 months
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <Button className="bg-gradient-to-r from-[#0084ca] to-[#006ba6] hover:from-[#006ba6] hover:to-[#005a8a] text-white shadow-md hover:shadow-lg transition-all duration-200">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-[#0084ca] hover:-translate-y-1 bg-white">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                UI/UX Designer
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                StartupHub • 5 hours ago
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-200">
                              88% Match
                            </span>
                          </div>
                          <p className="text-gray-700 mb-4">
                            Need a talented UI/UX designer to create a modern
                            mobile app design for our fintech startup. Great fit
                            for your design skills!
                          </p>
                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              $2,000 - $3,500
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              2-4 weeks
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <Button className="bg-gradient-to-r from-[#0084ca] to-[#006ba6] hover:from-[#006ba6] hover:to-[#005a8a] text-white shadow-md hover:shadow-lg transition-all duration-200">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === "most-recently" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Most Recently
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-[#0084ca] hover:-translate-y-1 bg-white">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Full Stack Developer
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                Digital Agency • 1 hour ago
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-200">
                              New
                            </span>
                          </div>
                          <p className="text-gray-700 mb-4">
                            Seeking a full stack developer for e-commerce
                            platform development with modern tech stack.
                          </p>
                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              $2,500 - $4,000
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              2-3 weeks
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <Button className="bg-gradient-to-r from-[#0084ca] to-[#006ba6] hover:from-[#006ba6] hover:to-[#005a8a] text-white shadow-md hover:shadow-lg transition-all duration-200">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-[#0084ca] hover:-translate-y-1 bg-white">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                Mobile App Developer
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                Innovation Lab • 3 hours ago
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-sm font-semibold rounded-full border border-blue-200">
                              New
                            </span>
                          </div>
                          <p className="text-gray-700 mb-4">
                            Looking for experienced mobile app developer for
                            fintech application with React Native.
                          </p>
                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              $3,000 - $5,000
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              1-2 months
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <Button className="bg-gradient-to-r from-[#0084ca] to-[#006ba6] hover:from-[#006ba6] hover:to-[#005a8a] text-white shadow-md hover:shadow-lg transition-all duration-200">
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === "saved-jobs" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Saved Jobs
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-[#0084ca] hover:-translate-y-1 bg-white">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                WordPress Developer
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                Digital Agency • 1 day ago
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 text-sm font-semibold rounded-full border border-yellow-200">
                              Saved
                            </span>
                          </div>
                          <p className="text-gray-700 mb-4">
                            Seeking a WordPress developer to customize and
                            optimize our client's e-commerce website with
                            WooCommerce integration.
                          </p>
                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              $1,500 - $2,500
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              2-3 weeks
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <Button className="bg-gradient-to-r from-[#0084ca] to-[#006ba6] hover:from-[#006ba6] hover:to-[#005a8a] text-white shadow-md hover:shadow-lg transition-all duration-200">
                              Apply Now
                            </Button>
                            <Button
                              variant="outline"
                              className="border-red-300 hover:border-red-500 hover:text-red-500 transition-all duration-200"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-[#0084ca] hover:-translate-y-1 bg-white">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                React Native Developer
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                Tech Startup • 2 days ago
                              </p>
                            </div>
                            <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-700 text-sm font-semibold rounded-full border border-yellow-200">
                              Saved
                            </span>
                          </div>
                          <p className="text-gray-700 mb-4">
                            Looking for experienced React Native developer to
                            build cross-platform mobile application for our
                            startup.
                          </p>
                          <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              $2,000 - $3,500
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              1-2 months
                            </span>
                          </div>
                          <div className="flex gap-3">
                            <Button className="bg-gradient-to-r from-[#0084ca] to-[#006ba6] hover:from-[#006ba6] hover:to-[#005a8a] text-white shadow-md hover:shadow-lg transition-all duration-200">
                              Apply Now
                            </Button>
                            <Button
                              variant="outline"
                              className="border-red-300 hover:border-red-500 hover:text-red-500 transition-all duration-200"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-lg p-6 sticky top-24">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center flex-shrink-0 shadow-inner">
                  <span className="text-gray-700 text-lg font-bold">AK</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 truncate">
                    Abebe Kebede
                  </h3>
                  <p className="text-sm text-gray-600 truncate">
                    Senior Full Stack Developer
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <a
                  href="/talent-profile"
                  className="text-sm text-green-600 hover:text-green-700 hover:underline font-medium transition-colors duration-200"
                >
                  Complete your profile →
                </a>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-gradient-to-r from-gray-700 to-gray-900 h-2 rounded-full transition-all duration-500"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-900">40%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
