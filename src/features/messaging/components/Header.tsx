import { Link } from "react-router";
import { ArrowLeft, Moon, Sun } from "lucide-react";

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Header({ darkMode, toggleDarkMode }: HeaderProps) {
  return (
    <header
      className={`transition-colors duration-300 ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/talent-profile"
            className={`flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
              darkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </Link>
          <Link to="/talent-profile" className="etn-brand-fancy text-2xl">
            ETN
          </Link>
          <div className="flex items-center gap-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
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
          </div>
        </div>
      </div>
    </header>
  );
}
