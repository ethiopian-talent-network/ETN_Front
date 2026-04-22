import { useDarkMode } from "../contexts/DarkModeContext";
import { TalentProfile } from "../components/talent/TalentProfile";

export default function TalentProfilePage() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div
      className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <header className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <span
              className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              ETN
            </span>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TalentProfile darkMode={darkMode} />
        </div>
      </main>
    </div>
  );
}
