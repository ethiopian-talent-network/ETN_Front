import React from "react";
import { useNavigate } from "react-router";
import { Plus, Bell, Moon, Sun, LogOut } from "lucide-react";
import { useDarkMode } from "../../../contexts/DarkModeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { EMPLOYER_ROUTES } from "../../../config/routes";

export const Header: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <header className={`sticky top-0 z-40 border-b ${darkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0084ca] to-[#006ba6] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              ETN<span className="text-[#0084ca]">.</span>
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(EMPLOYER_ROUTES.POST_JOB.path)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0084ca] hover:bg-[#006ba6] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Post a Job
            </button>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className={`relative p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className={`h-6 w-px mx-1 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0084ca] to-[#006ba6] flex items-center justify-center">
                <span className="text-white text-xs font-bold">{getInitials(user?.name || "E")}</span>
              </div>
              <span className={`text-sm font-medium hidden sm:block ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                {user?.name}
              </span>
            </div>

            <button
              onClick={() => { logout(); navigate("/login"); }}
              className={`p-2 rounded-lg transition-colors ${darkMode ? "text-gray-400 hover:text-red-400 hover:bg-gray-800" : "text-gray-500 hover:text-red-600 hover:bg-gray-100"}`}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
