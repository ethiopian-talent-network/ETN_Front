import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  ArrowLeft,
  Camera,
  Plus,
  X,
  Edit,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Upload,
  Trash2,
  ExternalLink,
  Save,
} from "lucide-react";

export default function FreelancerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Yohannes Tadesse",
    title: "Senior Full Stack Developer",
    location: "Addis Ababa, Ethiopia",
    hourlyRate: "45",
    bio: "Passionate full-stack developer with 7+ years of experience building scalable web applications. Specialized in React, Node.js, and cloud technologies.",
    skills: [
      "React",
      "Node.js",
      "TypeScript",
      "MongoDB",
      "AWS",
      "Docker",
      "REST APIs",
      "GraphQL",
    ],
    languages: [
      { name: "English", level: "Fluent" },
      { name: "Amharic", level: "Native" },
    ],
    education: [
      {
        degree: "BSc in Computer Science",
        school: "Addis Ababa University",
        year: "2015 - 2019",
      },
    ],
    certifications: [
      { name: "AWS Certified Solutions Architect", issuer: "Amazon", year: "2022" },
      { name: "React Advanced Patterns", issuer: "Frontend Masters", year: "2023" },
    ],
    portfolio: [
      {
        id: 1,
        title: "E-commerce Platform",
        description: "Full-featured online store with payment integration",
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?w=400",
        url: "https://example.com",
      },
      {
        id: 2,
        title: "SaaS Dashboard",
        description: "Analytics dashboard for enterprise clients",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
        url: "https://example.com",
      },
      {
        id: 3,
        title: "Mobile Banking App",
        description: "Secure banking application for iOS and Android",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400",
        url: "https://example.com",
      },
    ],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newPortfolioItem, setNewPortfolioItem] = useState({
    title: "",
    description: "",
    url: "",
  });
  const [showAddPortfolio, setShowAddPortfolio] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({ ...profileData, skills: [...profileData.skills, newSkill.trim()] });
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData({ ...profileData, skills: profileData.skills.filter((s) => s !== skill) });
  };

  const addPortfolioItem = () => {
    if (newPortfolioItem.title.trim()) {
      const newItem = {
        id: Date.now(),
        ...newPortfolioItem,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
      };
      setProfileData({ ...profileData, portfolio: [...profileData.portfolio, newItem] });
      setNewPortfolioItem({ title: "", description: "", url: "" });
      setShowAddPortfolio(false);
    }
  };

  const removePortfolioItem = (id: number) => {
    setProfileData({
      ...profileData,
      portfolio: profileData.portfolio.filter((item) => item.id !== id),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/freelancer-dashboard"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
            <Link to="/" className="text-2xl font-bold text-[#0084ca]">
              ETN
            </Link>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Edit Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            className={
              isEditing
                ? "bg-[#0084ca] hover:bg-[#006ba6] text-white"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            }
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-[#0084ca] text-white rounded-full hover:bg-[#006ba6]">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Your name"
                    className="text-2xl font-bold"
                  />
                  <Input
                    value={profileData.title}
                    onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                    placeholder="Your professional title"
                  />
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Input
                        value={profileData.location}
                        onChange={(e) =>
                          setProfileData({ ...profileData, location: e.target.value })
                        }
                        placeholder="Location"
                      />
                    </div>
                    <div className="w-40">
                      <Input
                        type="number"
                        value={profileData.hourlyRate}
                        onChange={(e) =>
                          setProfileData({ ...profileData, hourlyRate: e.target.value })
                        }
                        placeholder="Hourly rate"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
                  <p className="text-xl text-gray-700 mb-4">{profileData.title}</p>
                  <div className="flex items-center gap-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      <span>{profileData.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">4.9</span>
                      <span>(127 reviews)</span>
                    </div>
                    <div className="text-xl font-bold text-[#0084ca]">
                      ${profileData.hourlyRate}/hr
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-6">
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                rows={4}
                placeholder="Write a brief bio about yourself..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0084ca] focus:border-transparent resize-none"
              ></textarea>
            ) : (
              <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Skills</h3>
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill"
                  className="w-48"
                />
                <Button
                  onClick={addSkill}
                  size="sm"
                  className="bg-[#0084ca] hover:bg-[#006ba6] text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {profileData.skills.map((skill) => (
              <div
                key={skill}
                className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  isEditing
                    ? "bg-[#0084ca] bg-opacity-10 text-[#0084ca]"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                <span className="font-medium">{skill}</span>
                {isEditing && (
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-[#0084ca] hover:bg-opacity-20 rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Portfolio</h3>
            {isEditing && !showAddPortfolio && (
              <Button
                onClick={() => setShowAddPortfolio(true)}
                size="sm"
                className="bg-[#0084ca] hover:bg-[#006ba6] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>

          {showAddPortfolio && (
            <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="space-y-3">
                <Input
                  value={newPortfolioItem.title}
                  onChange={(e) =>
                    setNewPortfolioItem({ ...newPortfolioItem, title: e.target.value })
                  }
                  placeholder="Project title"
                />
                <Input
                  value={newPortfolioItem.description}
                  onChange={(e) =>
                    setNewPortfolioItem({ ...newPortfolioItem, description: e.target.value })
                  }
                  placeholder="Project description"
                />
                <Input
                  value={newPortfolioItem.url}
                  onChange={(e) =>
                    setNewPortfolioItem({ ...newPortfolioItem, url: e.target.value })
                  }
                  placeholder="Project URL (optional)"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={addPortfolioItem}
                    size="sm"
                    className="bg-[#0084ca] hover:bg-[#006ba6] text-white"
                  >
                    Add Project
                  </Button>
                  <Button
                    onClick={() => setShowAddPortfolio(false)}
                    size="sm"
                    variant="outline"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profileData.portfolio.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden group">
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {isEditing && (
                    <button
                      onClick={() => removePortfolioItem(item.id)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0084ca] hover:underline text-sm flex items-center gap-1"
                    >
                      View Project <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Certifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Education */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <GraduationCap className="w-6 h-6 text-[#0084ca]" />
              <h3 className="text-xl font-bold text-gray-900">Education</h3>
            </div>
            <div className="space-y-4">
              {profileData.education.map((edu, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-600">{edu.school}</p>
                  <p className="text-sm text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-6 h-6 text-[#0084ca]" />
              <h3 className="text-xl font-bold text-gray-900">Certifications</h3>
            </div>
            <div className="space-y-4">
              {profileData.certifications.map((cert, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                  <p className="text-gray-600">{cert.issuer}</p>
                  <p className="text-sm text-gray-500">{cert.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Languages</h3>
          <div className="flex flex-wrap gap-4">
            {profileData.languages.map((lang, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{lang.name}:</span>
                <span className="text-gray-600">{lang.level}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
