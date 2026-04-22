import { useState } from "react";
import { Check, ChevronDown, ChevronUp, MapPin } from "lucide-react";

interface LocationSelectorProps {
  value: string;
  onChange: (location: string) => void;
  placeholder?: string;
  darkMode?: boolean;
  disabled?: boolean;
}

// Ethiopian cities and regions organized by region
const ETHIOPIAN_LOCATIONS = {
  "Addis Ababa": ["Addis Ababa"],
  Afar: ["Semera", "Dubti", "Awash"],
  Amhara: ["Bahir Dar", "Gondar", "Dessie", "Debre Birhan", "Debre Markos"],
  "Benishangul-Gumuz": ["Assosa", "Gambela", "Mekane Selam"],
  "Dire Dawa": ["Dire Dawa"],
  Gambela: ["Gambela", "Itang"],
  Harari: ["Harar"],
  Oromia: [
    "Adama",
    "Jimma",
    "Shashamane",
    "Nekemte",
    "Goba",
    "Asella",
    "Ambo",
    "Metu",
    "Gore",
    "Bishoftu",
    "Sebeta",
    "Woliso",
  ],
  Sidama: ["Hawassa", "Yirgalem", "Aleta Wendo"],
  Somali: ["Jigjiga", "Gode", "Degahbur", "Kebridehar"],
  "Southern Nations": ["Arba Minch", "Sodo", "Wolaita", "Hosaena", "Dilla"],
  Tigray: ["Mekelle", "Axum", "Adigrat", "Shire", "Humera", "Alamata"],
};

// Popular international cities for remote work
const INTERNATIONAL_CITIES = [
  "Nairobi",
  "Kenya",
  "London",
  "United Kingdom",
  "New York",
  "USA",
  "San Francisco",
  "USA",
  "Toronto",
  "Canada",
  "Dubai",
  "UAE",
  "Tel Aviv",
  "Israel",
  "Cairo",
  "Egypt",
  "Johannesburg",
  "South Africa",
];

export function LocationSelector({
  value,
  onChange,
  placeholder = "Select location",
  darkMode = false,
  disabled = false,
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"ethiopia" | "international">(
    "ethiopia",
  );
  const [expandedRegions, setExpandedRegions] = useState<Set<string>>(
    new Set(),
  );

  const toggleRegion = (region: string) => {
    const newExpanded = new Set(expandedRegions);
    if (newExpanded.has(region)) {
      newExpanded.delete(region);
    } else {
      newExpanded.add(region);
    }
    setExpandedRegions(newExpanded);
  };

  const handleLocationSelect = (location: string) => {
    onChange(location);
    setIsOpen(false);
  };

  const clearSelection = () => {
    onChange("");
    setIsOpen(false);
  };

  const displayValue = value || placeholder;

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-3 text-left border-2 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md ${
          disabled
            ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
            : isOpen
              ? "border-[#0084ca] bg-[#0084ca]5 shadow-lg"
              : darkMode
                ? "bg-gray-800 border-gray-700 text-white hover:border-[#0084ca] hover:bg-gray-700"
                : "bg-white border-gray-300 text-gray-900 hover:border-[#0084ca] hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-1.5 rounded-lg ${
                value
                  ? "bg-[#0084ca] text-white"
                  : darkMode
                    ? "bg-gray-700 text-gray-400"
                    : "bg-gray-100 text-gray-500"
              }`}
            >
              <MapPin className="w-4 h-4" />
            </div>
            <span
              className={`font-medium ${
                value
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {displayValue}
            </span>
          </div>
          <div
            className={`p-1 rounded-md transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`absolute z-50 w-full mt-2 border-2 rounded-xl shadow-xl backdrop-blur-sm ${
            darkMode
              ? "bg-gray-900/95 border-gray-700"
              : "bg-white/95 border-gray-200"
          }`}
        >
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-xl">
            <button
              onClick={() => setActiveTab("ethiopia")}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === "ethiopia"
                  ? "bg-[#0084ca] text-white shadow-sm"
                  : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Ethiopia
            </button>
            <button
              onClick={() => setActiveTab("international")}
              className={`flex-1 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                activeTab === "international"
                  ? "bg-[#0084ca] text-white shadow-sm"
                  : darkMode
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              International
            </button>
          </div>

          {/* Content */}
          <div className="max-h-64 overflow-y-auto">
            {activeTab === "ethiopia" ? (
              <div className="p-2">
                {Object.entries(ETHIOPIAN_LOCATIONS).map(([region, cities]) => (
                  <div key={region} className="mb-2">
                    <button
                      onClick={() => toggleRegion(region)}
                      className={`w-full px-3 py-2 text-left flex items-center justify-between rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        expandedRegions.has(region)
                          ? "bg-gray-100 dark:bg-gray-700"
                          : ""
                      }`}
                    >
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {region}
                      </span>
                      {expandedRegions.has(region) ? (
                        <ChevronUp className="w-3 h-3 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      )}
                    </button>

                    {expandedRegions.has(region) && (
                      <div className="ml-2 mt-1 space-y-1">
                        {cities.map((city) => (
                          <button
                            key={city}
                            onClick={() => handleLocationSelect(city)}
                            className={`w-full px-3 py-1.5 text-left flex items-center justify-between rounded text-sm transition-colors ${
                              value === city
                                ? "bg-[#0084ca] text-white"
                                : darkMode
                                  ? "text-gray-300 hover:bg-gray-700"
                                  : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <span>{city}</span>
                            {value === city && <Check className="w-3 h-3" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2">
                {Array.from(
                  { length: INTERNATIONAL_CITIES.length / 2 },
                  (_, i) => {
                    const city = INTERNATIONAL_CITIES[i * 2];
                    const country = INTERNATIONAL_CITIES[i * 2 + 1];
                    return (
                      <button
                        key={`${city}-${country}`}
                        onClick={() =>
                          handleLocationSelect(`${city}, ${country}`)
                        }
                        className={`w-full px-3 py-2 text-left flex items-center justify-between rounded text-sm transition-colors ${
                          value === `${city}, ${country}`
                            ? "bg-[#0084ca] text-white"
                            : darkMode
                              ? "text-gray-300 hover:bg-gray-700"
                              : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div>
                          <div className="font-medium">{city}</div>
                          <div className="text-xs opacity-75">{country}</div>
                        </div>
                        {value === `${city}, ${country}` && (
                          <Check className="w-3 h-3" />
                        )}
                      </button>
                    );
                  },
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {value && (
            <div className="p-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={clearSelection}
                className="w-full px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
