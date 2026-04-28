import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, Bell, Moon, Sun, LogOut, Building2, User, ChevronDown, MessageCircle } from "lucide-react";
import { useDarkMode } from "../../../contexts/DarkModeContext";
import { useAuth } from "../../../contexts/AuthContext";
import { EMPLOYER_ROUTES } from "../../../config/routes";
import { API_BASE_URL } from "../../../config/api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const Header: React.FC = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  // Fetch employer profile image on mount
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/employer/employerProfile`, {
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.data?.profile_url) setProfileImage(data.data.profile_url);
      } catch {}
    };
    fetchImage();
  }, []);

  // Listen for profile image updates from the profile page
  useEffect(() => {
    const handler = (e: CustomEvent) => setProfileImage(e.detail);
    window.addEventListener("employer-profile-updated" as any, handler);
    return () => window.removeEventListener("employer-profile-updated" as any, handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const dm = darkMode;

  return (
    <header className={`sticky top-0 z-40 border-b ${dm ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0084ca] to-[#006ba6] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className={`text-lg font-bold ${dm ? "text-white" : "text-gray-900"}`}>
              ETN<span className="text-[#0084ca]">.</span>
            </span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/messages")}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                dm ? "text-gray-300 hover:bg-gray-800 hover:text-white" : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Messages</span>
            </button>

            <button
              onClick={() => navigate(EMPLOYER_ROUTES.POST_JOB.path)}
              className="flex items-center gap-2 px-4 py-2 bg-[#0084ca] hover:bg-[#006ba6] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Post a Job
            </button>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${dm ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              {dm ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className={`relative p-2 rounded-lg transition-colors ${dm ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className={`h-6 w-px mx-1 ${dm ? "bg-gray-700" : "bg-gray-200"}`} />

            {/* Avatar dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
                  dm ? "hover:bg-gray-800" : "hover:bg-gray-100"
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#0084ca]/30">
                  {profileImage ? (
                    <img src={profileImage} alt={user?.name || ""} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#0084ca] to-[#006ba6] flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{getInitials(user?.name || "E")}</span>
                    </div>
                  )}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${dm ? "text-gray-300" : "text-gray-700"}`}>
                  {user?.name}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 hidden sm:block transition-transform duration-200 ${
                  dropdownOpen ? "rotate-180" : ""
                } ${dm ? "text-gray-400" : "text-gray-500"}`} />
              </button>

              {dropdownOpen && (
                <div className={`absolute right-0 top-full mt-2 w-52 rounded-xl shadow-2xl border z-50 overflow-hidden ${
                  dm ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                }`}>
                  {/* User info */}
                  <div className={`px-4 py-3 border-b ${dm ? "border-gray-700" : "border-gray-100"}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-[#0084ca]/20">
                        {profileImage ? (
                          <img src={profileImage} alt={user?.name || ""} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[#0084ca] to-[#006ba6] flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{getInitials(user?.name || "E")}</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${dm ? "text-white" : "text-gray-900"}`}>
                          {user?.name}
                        </p>
                        <p className={`text-xs truncate mt-0.5 ${dm ? "text-gray-400" : "text-gray-500"}`}>
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    <button
                      onClick={() => { navigate(EMPLOYER_ROUTES.PROFILE.path); setDropdownOpen(false); }}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                        dm
                          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Building2 className="w-4 h-4 flex-shrink-0" />
                      Company Profile
                    </button>

                    <button
                      onClick={() => { navigate(EMPLOYER_ROUTES.DASHBOARD.path); setDropdownOpen(false); }}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                        dm
                          ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <User className="w-4 h-4 flex-shrink-0" />
                      Dashboard
                    </button>
                  </div>

                  {/* Logout */}
                  <div className={`border-t py-1.5 ${dm ? "border-gray-700" : "border-gray-100"}`}>
                    <button
                      onClick={() => { logout(); navigate("/login"); }}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors ${
                        dm ? "text-red-400 hover:bg-red-900/30" : "text-red-600 hover:bg-red-50"
                      }`}
                    >
                      <LogOut className="w-4 h-4 flex-shrink-0" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
