import { Link, useNavigate } from "react-router";
import { MessageSquare, Bell, Moon, Sun, Menu, X } from "lucide-react";
import { PUBLIC_ROUTES, SHARED_ROUTES } from "../../../config/routes";
import DropdownMenu from "../../../components/ui/DropdownMenu";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { logout } from "../../../api/auth/authApi";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  userImage?: string;
  onImageUpload: (file: File) => void;
}

export function Header({
  darkMode,
  toggleDarkMode,
  userImage,
  onImageUpload,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, token, logout: authLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (token) {
        await logout(token);
      }
      authLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout locally even if API call fails
      authLogout();
      navigate("/");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 shadow-sm transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link
              to={PUBLIC_ROUTES.HOME.path}
              className="flex items-center group"
            >
              <span className="etn-brand-fancy text-xl sm:text-2xl transition-transform group-hover:scale-105">
                ETN
              </span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            <div className="hidden md:flex items-center gap-6 lg:gap-8">
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

          <div className="flex items-center gap-1 sm:gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                darkMode
                  ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            <button
              className={`relative p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                darkMode
                  ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            <Link to={SHARED_ROUTES.MESSAGES.path}>
              <button
                className={`relative p-1.5 sm:p-2 rounded-lg transition-all duration-200 group ${
                  darkMode
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
              >
                <MessageSquare
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? "group-hover:text-gray-300" : "group-hover:text-gray-700"}`}
                />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                <span className="sr-only">Messages</span>
              </button>
            </Link>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-40">
                <div className="flex flex-col p-4 space-y-3">
                  <button
                    className={`text-sm font-medium text-left ${
                      darkMode
                        ? "text-gray-300 hover:text-[#0084ca]"
                        : "text-gray-700 hover:text-[#0084ca]"
                    }`}
                  >
                    Find Jobs
                  </button>
                  <button
                    className={`text-sm font-medium text-left ${
                      darkMode
                        ? "text-gray-300 hover:text-[#0084ca]"
                        : "text-gray-700 hover:text-[#0084ca]"
                    }`}
                  >
                    My Proposals
                  </button>
                  <button
                    className={`text-sm font-medium text-left ${
                      darkMode
                        ? "text-gray-300 hover:text-[#0084ca]"
                        : "text-gray-700 hover:text-[#0084ca]"
                    }`}
                  >
                    Deliver Works
                  </button>
                </div>
              </div>
            )}

            <div className="hidden sm:block">
              <DropdownMenu
                userName={user?.name || "Current User"}
                userEmail={user?.email || "user@example.com"}
                userImage={userImage}
                userId={user?.id?.toString() || "current-user"}
                onImageUpload={onImageUpload}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
