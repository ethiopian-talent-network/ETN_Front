import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import {
  Search,
  Code,
  Palette,
  TrendingUp,
  Users,
  Scale,
  GraduationCap,
  Wrench,
  DollarSign,
  Menu,
  X,
  ArrowRight,
  CheckCircle,
  Star,
  Globe,
  Moon,
  Sun,
} from "lucide-react";

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const categories = [
    { icon: Code, title: "Development & IT", color: "text-[#0084ca]" },
    { icon: Palette, title: "Design & Creative", color: "text-[#0084ca]" },
    { icon: TrendingUp, title: "Sales & Marketing", color: "text-[#0084ca]" },
    { icon: Users, title: "Admin & Support", color: "text-[#0084ca]" },
    {
      icon: DollarSign,
      title: "Finance & Accounting",
      color: "text-[#0084ca]",
    },
    { icon: Scale, title: "Legal", color: "text-[#0084ca]" },
    { icon: GraduationCap, title: "HR & Training", color: "text-[#0084ca]" },
    {
      icon: Wrench,
      title: "Engineering & Architecture",
      color: "text-[#0084ca]",
    },
  ];

  useEffect(() => {
    setIsLoaded(true);
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-900" : "bg-white"}`}
    >
      {/* Navigation */}
      <nav
        className={`sticky top-0 z-50 border-b transition-all duration-500 backdrop-blur-lg ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        } ${darkMode ? "border-gray-700 bg-gray-800/95" : "border-gray-200 bg-white/95"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <span
                className={`text-2xl font-bold transition-transform duration-300 group-hover:scale-110 ${
                  darkMode ? "text-blue-400" : "text-[#0084ca]"
                }`}
              >
                ETN
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                className={`text-sm flex items-center transition-all duration-300 hover:translate-y-[-2px] group ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Find Talent
                <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button
                className={`text-sm flex items-center transition-all duration-300 hover:translate-y-[-2px] group ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Find Work
                <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <button
                className={`text-sm flex items-center transition-all duration-300 hover:translate-y-[-2px] group ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Why ETN
                <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              <Link
                to="/login"
                className={`text-sm transition-all duration-300 hover:translate-y-[-2px] ${
                  darkMode
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Log in
              </Link>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
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

              <Link to="/signup">
                <Button className="bg-[#0084ca] hover:bg-[#006ba6] text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Sign up
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div
                className={`transition-transform duration-300 ${
                  mobileMenuOpen ? "rotate-180" : ""
                }`}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden border-t transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          } ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
        >
          <div className="px-4 py-4 space-y-3">
            <button
              className={`block w-full text-left py-2 px-3 rounded-lg transition-all duration-300 ${
                darkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Find Talent
            </button>
            <button
              className={`block w-full text-left py-2 px-3 rounded-lg transition-all duration-300 ${
                darkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Find Work
            </button>
            <button
              className={`block w-full text-left py-2 px-3 rounded-lg transition-all duration-300 ${
                darkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Why ETN
            </button>
            <Link
              to="/login"
              className={`block py-2 px-3 rounded-lg transition-all duration-300 ${
                darkMode
                  ? "text-gray-300 hover:text-white hover:bg-gray-700"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Log in
            </Link>
            <Link to="/signup" className="block">
              <Button className="w-full bg-[#0084ca] hover:bg-[#006ba6] text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className={`relative py-20 transition-all duration-1000 delay-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        } ${darkMode ? "bg-gray-900" : "bg-white"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1
              className={`text-5xl lg:text-6xl font-bold mb-6 leading-tight ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Ethiopian Talent Network
            </h1>
            <p
              className={`text-xl mb-12 max-w-3xl mx-auto ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Connect with skilled Ethiopian professionals. Post jobs as an
              employer or find work as a talented freelancer.
            </p>

            {/* User Type Selection */}
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
              {/* Employer Card */}
              <div
                className={`p-8 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  darkMode
                    ? "border-gray-700 bg-gray-800 hover:border-blue-500"
                    : "border-gray-200 bg-white hover:border-blue-500"
                }`}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3
                  className={`text-2xl font-semibold mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  I'm an Employer
                </h3>
                <p
                  className={`mb-6 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Post jobs, review proposals, and hire talented Ethiopian
                  professionals for your projects.
                </p>
                <Link to="/login?role=employer">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors">
                    Post a Job
                  </Button>
                </Link>
              </div>

              {/* Talent Card */}
              <div
                className={`p-8 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                  darkMode
                    ? "border-gray-700 bg-gray-800 hover:border-green-500"
                    : "border-gray-200 bg-white hover:border-green-500"
                }`}
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-green-600" />
                </div>
                <h3
                  className={`text-2xl font-semibold mb-3 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  I'm a Talent
                </h3>
                <p
                  className={`mb-6 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Create your profile, find exciting opportunities, and work
                  with great companies.
                </p>
                <Link to="/login?role=talent">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors">
                    Find Work
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className={`py-16 transition-all duration-700 delay-500 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        } ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10,000+", label: "Freelancers", icon: Users },
              {
                number: "5,000+",
                label: "Projects Completed",
                icon: CheckCircle,
              },
              { number: "500+", label: "Companies", icon: Globe },
              { number: "98%", label: "Satisfaction Rate", icon: Star },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`p-6 rounded-xl transition-all duration-500 hover:scale-105 ${
                    darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  style={{ animationDelay: `${600 + index * 100}ms` }}
                >
                  <Icon
                    className={`w-8 h-8 mx-auto mb-3 ${
                      darkMode ? "text-blue-400" : "text-[#0084ca]"
                    }`}
                  />
                  <div
                    className={`text-3xl font-bold mb-2 ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {stat.number}
                  </div>
                  <div
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section
        className={`py-20 transition-all duration-700 delay-700 ${
          darkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className={`text-4xl font-bold mb-12 transition-all duration-700 delay-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            } ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Find freelancers for every type of work
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <button
                  key={index}
                  className={`p-6 border rounded-xl hover:shadow-xl transition-all duration-500 text-left group relative overflow-hidden ${
                    darkMode
                      ? "border-gray-700 hover:border-blue-400"
                      : "border-gray-200 hover:border-[#0084ca]"
                  } ${
                    hoveredCategory === index
                      ? darkMode
                        ? "transform -translate-y-2 bg-gradient-to-br from-blue-900/20 to-gray-800"
                        : "transform -translate-y-2 bg-gradient-to-br from-[#0084ca]/5 to-white"
                      : ""
                  }`}
                  onMouseEnter={() => setHoveredCategory(index)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#0084ca]/10 to-transparent rounded-full translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700" />
                  <Icon
                    className={`w-8 h-8 mb-3 ${category.color} group-hover:scale-110 transition-transform duration-300 relative z-10`}
                  />
                  <h3
                    className={`font-medium transition-colors duration-300 relative z-10 ${
                      darkMode
                        ? "text-gray-100 group-hover:text-blue-400"
                        : "text-gray-900 group-hover:text-[#0084ca]"
                    }`}
                  >
                    {category.title}
                  </h3>
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span
                      className={`text-xs font-medium ${
                        darkMode ? "text-blue-400" : "text-[#0084ca]"
                      }`}
                    >
                      Explore →
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className={`py-20 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2
              className={`text-4xl font-bold mb-4 ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              How It Works
            </h2>
            <p
              className={`text-xl mb-8 ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Simple steps to get started as an employer or talent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div
              className={`p-8 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                darkMode
                  ? "border-gray-600 bg-gray-700"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3
                className={`text-xl font-semibold mb-3 text-center ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Sign Up & Create Profile
              </h3>
              <p
                className={`text-center mb-4 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Register as an employer to post jobs or as talent to showcase
                your skills and experience.
              </p>
              <div className="text-center">
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  2 minutes setup
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className={`p-8 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                darkMode
                  ? "border-gray-600 bg-gray-700"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <h3
                className={`text-xl font-semibold mb-3 text-center ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Post Jobs or Find Work
              </h3>
              <p
                className={`text-center mb-4 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Employers post detailed job requirements. Talents browse and
                apply for matching opportunities.
              </p>
              <div className="text-center">
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-green-400" : "text-green-600"
                  }`}
                >
                  Instant matching
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div
              className={`p-8 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                darkMode
                  ? "border-gray-600 bg-gray-700"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3
                className={`text-xl font-semibold mb-3 text-center ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Collaborate & Complete
              </h3>
              <p
                className={`text-center mb-4 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Work together through our platform, track progress, and complete
                projects with secure payments.
              </p>
              <div className="text-center">
                <span
                  className={`text-sm font-medium ${
                    darkMode ? "text-purple-400" : "text-purple-600"
                  }`}
                >
                  Secure payments
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`py-20 bg-gradient-to-r from-[#0084ca] to-[#006ba6] relative overflow-hidden transition-all duration-700 delay-1200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform rotate-45 translate-x-full animate-pulse" />
          <div
            className="absolute bottom-0 right-0 w-full h-full bg-white/10 transform -rotate-45 -translate-x-full animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4 transition-all duration-500 hover:scale-105">
            Find freelancers who can help you build what's next
          </h2>
          <p className="text-xl text-white/90 mb-8 transition-all duration-500 delay-100">
            Join thousands of businesses already using ETN to grow their teams
          </p>
          <Link to="/signup">
            <Button className="bg-white text-[#0084ca] hover:bg-gray-100 px-8 h-12 rounded-full font-medium mt-6 transition-all duration-300 hover:scale-110 hover:shadow-2xl group">
              <span className="flex items-center gap-2">
                Explore freelancers
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
              </span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* For Clients */}
            <div>
              <h3 className="text-white font-semibold mb-4">For Clients</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button className="hover:text-white">How to hire</button>
                </li>
                <li>
                  <button className="hover:text-white">
                    Talent Marketplace
                  </button>
                </li>
                <li>
                  <button className="hover:text-white">Project Catalog</button>
                </li>
                <li>
                  <button className="hover:text-white">Enterprise</button>
                </li>
                <li>
                  <button className="hover:text-white">Any Hire</button>
                </li>
              </ul>
            </div>

            {/* For Talent */}
            <div>
              <h3 className="text-white font-semibold mb-4">For Talent</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button className="hover:text-white">How to find work</button>
                </li>
                <li>
                  <button className="hover:text-white">Direct Contracts</button>
                </li>
                <li>
                  <button className="hover:text-white">
                    Find freelance jobs
                  </button>
                </li>
                <li>
                  <button className="hover:text-white">Find local jobs</button>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button className="hover:text-white">Help & support</button>
                </li>
                <li>
                  <button className="hover:text-white">Success stories</button>
                </li>
                <li>
                  <button className="hover:text-white">Reviews</button>
                </li>
                <li>
                  <button className="hover:text-white">Resources</button>
                </li>
                <li>
                  <button className="hover:text-white">Blog</button>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button className="hover:text-white">About us</button>
                </li>
                <li>
                  <button className="hover:text-white">Leadership</button>
                </li>
                <li>
                  <button className="hover:text-white">Careers</button>
                </li>
                <li>
                  <button className="hover:text-white">Press</button>
                </li>
                <li>
                  <button className="hover:text-white">Contact us</button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-500 mb-4 md:mb-0 transition-all duration-300 hover:text-gray-400">
                © 2026 ETN - Ethiopian Talent Network
              </p>
              <div className="flex gap-6 text-sm">
                {["Terms of Service", "Privacy Policy", "Accessibility"].map(
                  (item, index) => (
                    <button
                      key={item}
                      className="hover:text-white transition-all duration-300 hover:translate-y-[-1px]"
                      style={{ animationDelay: `${1700 + index * 100}ms` }}
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
