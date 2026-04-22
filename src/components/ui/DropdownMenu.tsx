import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import {
  User,
  Settings,
  Bell,
  LogOut,
  Camera,
  CreditCard,
  HelpCircle,
  Shield,
} from "lucide-react";

interface DropdownMenuProps {
  userName: string;
  userEmail: string;
  userImage?: string;
  userId?: string;
  onImageUpload?: (file: File) => void;
  onLogout?: () => void;
}

export default function DropdownMenu({
  userName,
  userEmail,
  userImage,
  userId,
  onImageUpload,
  onLogout,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      // Validate file type and size
      if (file.type.startsWith("image/")) {
        if (file.size <= 5 * 1024 * 1024) {
          // 5MB limit
          onImageUpload(file);
        } else {
          alert("Image size should be less than 5MB");
        }
      } else {
        alert("Please select a valid image file");
      }
    }
    setIsOpen(false);
  };

  const menuItems = [
    {
      icon: User,
      label: "Profile",
      href: userId ? `/talent-profile/${userId}` : "/talent-profile",
      description: "View and edit your profile",
    },
    {
      icon: CreditCard,
      label: "Billing",
      href: "/billing",
      description: "Manage payment methods",
    },
    {
      icon: Bell,
      label: "Notifications",
      href: "/notifications",
      description: "Configure notifications",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/settings",
      description: "Account and preferences",
    },
    {
      icon: Shield,
      label: "Privacy & Security",
      href: "/security",
      description: "Manage your security settings",
    },
    {
      icon: HelpCircle,
      label: "Help & Support",
      href: "/help",
      description: "Get help and contact support",
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Profile menu"
        aria-expanded={isOpen}
      >
        <div className="relative">
          {userImage ? (
            <img
              src={userImage}
              alt={userName}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* User Profile Section */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-5 h-5 bg-[#0084ca] rounded-full flex items-center justify-center hover:bg-[#006ba6] transition-colors"
                  title="Change profile picture"
                >
                  <Camera className="w-2.5 h-2.5 text-white" />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-upwork-body-medium text-gray-900 truncate">
                  {userName}
                </p>
                <p className="text-upwork-small text-gray-500 truncate">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-upwork-body text-gray-900">
                      {item.label}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-200 p-1">
            <button
              onClick={() => {
                if (onLogout) {
                  onLogout();
                }
                setIsOpen(false);
              }}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-red-50 transition-colors group rounded-md"
            >
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <LogOut className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-upwork-body text-red-600">Log Out</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}
