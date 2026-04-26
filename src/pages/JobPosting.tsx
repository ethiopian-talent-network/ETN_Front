import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  ArrowLeft,
  Plus,
  X,
  DollarSign,
  Clock,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  Coins,
} from "lucide-react";
import { API_BASE_URL } from "../config/api";

export default function JobPosting() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/jobs/categories`)
      .then((r) => r.json())
      .then((data) => setCategories(data.data || []))
      .catch(() => {});
  }, []);

  const [jobData, setJobData] = useState({
    title: "",
    category: "",
    category_id: 0,
    description: "",
    skills: [] as string[],
    scope: "large",
    duration: "",
    experience: "intermediate",
    budget: {
      type: "fixed",
      min: "",
      max: "",
      fixed: "",
    },
    tokenCost: "10",
    attachments: [] as string[],
  });

  const [currentSkill, setCurrentSkill] = useState("");

  const addSkill = () => {
    if (currentSkill.trim() && !jobData.skills.includes(currentSkill.trim())) {
      setJobData({
        ...jobData,
        skills: [...jobData.skills, currentSkill.trim()],
      });
      setCurrentSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setJobData({
      ...jobData,
      skills: jobData.skills.filter((s) => s !== skill),
    });
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!jobData.title.trim()) {
        newErrors.title = "Job title is required";
      } else if (jobData.title.length < 10) {
        newErrors.title = "Job title must be at least 10 characters";
      }

      if (!jobData.category_id) {
        newErrors.category = "Please select a category";
      }

      if (!jobData.description.trim()) {
        newErrors.description = "Job description is required";
      } else if (jobData.description.length < 50) {
        newErrors.description =
          "Please provide more details (at least 50 characters)";
      }
    }

    if (currentStep === 2 && jobData.skills.length === 0) {
      newErrors.skills = "Please add at least one skill";
    }

    if (currentStep === 3) {
      if (!jobData.duration) {
        newErrors.duration = "Please select project duration";
      }

      if (jobData.budget.type === "hourly") {
        if (!jobData.budget.min || !jobData.budget.max) {
          newErrors.budget =
            "Please provide both minimum and maximum hourly rates";
        } else if (
          parseInt(jobData.budget.min) >= parseInt(jobData.budget.max)
        ) {
          newErrors.budget = "Maximum rate must be greater than minimum rate";
        }
      } else {
        if (!jobData.budget.fixed) {
          newErrors.budget = "Please provide a project budget";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    try {
      const jobPayload = {
        title: jobData.title,
        description: jobData.description,
        category_id: jobData.category_id,
        experience_level: jobData.experience,
        salary:
          jobData.budget.type === "fixed"
            ? jobData.budget.fixed
            : `${jobData.budget.min}-${jobData.budget.max}`,
        budget_type: jobData.budget.type,
        duration: jobData.duration,
        location: "Remote",
        remote_allowed: true,
        token_cost: parseInt(jobData.tokenCost) || 10,
        skills: jobData.skills,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/jobs/employer/jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(jobPayload),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create job");
      }

      navigate("/employer-dashboard");
    } catch (error: any) {
      console.error("Error posting job:", error);
      setErrors({
        submit: error.message || "Failed to post job. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              to="/employer-dashboard"
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
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    s < step
                      ? "bg-[#0084ca] text-white"
                      : s === step
                        ? "bg-[#0084ca] text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {s < step ? <CheckCircle className="w-6 h-6" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      s < step ? "bg-[#0084ca]" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className={step >= 1 ? "text-[#0084ca]" : "text-gray-600"}>
              Job Details
            </span>
            <span className={step >= 2 ? "text-[#0084ca]" : "text-gray-600"}>
              Skills
            </span>
            <span className={step >= 3 ? "text-[#0084ca]" : "text-gray-600"}>
              Scope & Budget
            </span>
            <span className={step >= 4 ? "text-[#0084ca]" : "text-gray-600"}>
              Review
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Step 1: Job Details */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Let's start with a strong title
              </h2>
              <p className="text-gray-600 mb-6">
                This helps your job post stand out to the right candidates. It's
                the first thing they'll see, so make it count!
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Write a title for your job post
                  </label>
                  <Input
                    type="text"
                    value={jobData.title}
                    onChange={(e) => {
                      setJobData({ ...jobData, title: e.target.value });
                      if (errors.title) setErrors({ ...errors, title: "" });
                    }}
                    placeholder="e.g. Build a responsive website for my business"
                    className={`text-base ${errors.title ? "border-red-500" : ""}`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-500">
                      {jobData.title.length}/100 characters
                    </p>
                    {errors.title && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.title}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select a category
                  </label>
                  <select
                    value={jobData.category_id}
                    onChange={(e) => {
                      const selected = categories.find((c) => c.id === parseInt(e.target.value));
                      setJobData({ ...jobData, category_id: parseInt(e.target.value), category: selected?.name || "" });
                      if (errors.category) setErrors({ ...errors, category: "" });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0084ca] focus:border-transparent ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value={0}>Choose a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe what you need
                  </label>
                  <textarea
                    value={jobData.description}
                    onChange={(e) => {
                      setJobData({ ...jobData, description: e.target.value });
                      if (errors.description)
                        setErrors({ ...errors, description: "" });
                    }}
                    rows={8}
                    placeholder="Describe your project in detail. Include information about what you're looking for, project requirements, and deliverables..."
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0084ca] focus:border-transparent resize-none ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    }`}
                  ></textarea>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-500">
                      {jobData.description.length}/5000 characters
                    </p>
                    {errors.description && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                What skills are required?
              </h2>
              <p className="text-gray-600 mb-6">
                Add the skills that best describe your project. Freelancers will
                use these to find projects they're a good fit for.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search skills or add your own
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSkill())
                      }
                      placeholder="e.g. React, Node.js, Graphic Design"
                      className="flex-1"
                    />
                    <Button
                      onClick={addSkill}
                      className="bg-[#0084ca] hover:bg-[#006ba6] text-white"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Press Enter or click + to add a skill
                  </p>
                </div>

                {jobData.skills.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Selected skills ({jobData.skills.length})
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {jobData.skills.map((skill) => (
                        <div
                          key={skill}
                          className="px-4 py-2 bg-[#0084ca] bg-opacity-10 text-[#0084ca] rounded-full flex items-center gap-2 font-medium"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="hover:bg-[#0084ca] hover:bg-opacity-20 rounded-full p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Popular skills for your category
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "JavaScript",
                      "React",
                      "Node.js",
                      "Python",
                      "UI/UX Design",
                      "WordPress",
                    ].map((skill) => (
                      <button
                        key={skill}
                        onClick={() => {
                          if (!jobData.skills.includes(skill)) {
                            setJobData({
                              ...jobData,
                              skills: [...jobData.skills, skill],
                            });
                          }
                        }}
                        className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm hover:border-[#0084ca] hover:text-[#0084ca] transition-colors"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Scope & Budget */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Tell us about your budget and timeline
              </h2>
              <p className="text-gray-600 mb-6">
                This helps us match you with freelancers who are the right fit.
              </p>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How large is this project?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        value: "small",
                        icon: FileText,
                        label: "Small",
                        desc: "Quick and straightforward",
                      },
                      {
                        value: "medium",
                        icon: Users,
                        label: "Medium",
                        desc: "Well-defined project",
                      },
                      {
                        value: "large",
                        icon: Clock,
                        label: "Large",
                        desc: "Longer-term or complex",
                      },
                    ].map((size) => {
                      const Icon = size.icon;
                      return (
                        <button
                          key={size.value}
                          onClick={() =>
                            setJobData({ ...jobData, scope: size.value })
                          }
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            jobData.scope === size.value
                              ? "border-[#0084ca] bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Icon
                            className={`w-6 h-6 mb-2 ${
                              jobData.scope === size.value
                                ? "text-[#0084ca]"
                                : "text-gray-600"
                            }`}
                          />
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {size.label}
                          </h3>
                          <p className="text-sm text-gray-600">{size.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How long will this project take?
                  </label>
                  <select
                    value={jobData.duration}
                    onChange={(e) =>
                      setJobData({ ...jobData, duration: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0084ca] focus:border-transparent"
                  >
                    <option value="">Select duration</option>
                    <option value="less-than-1-month">Less than 1 month</option>
                    <option value="1-3-months">1 to 3 months</option>
                    <option value="3-6-months">3 to 6 months</option>
                    <option value="more-than-6-months">
                      More than 6 months
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What level of experience will it need?
                  </label>
                  <div className="space-y-3">
                    {[
                      {
                        value: "entry",
                        label: "Entry Level",
                        desc: "Looking for someone relatively new to this field",
                      },
                      {
                        value: "intermediate",
                        label: "Intermediate",
                        desc: "Looking for substantial experience in this field",
                      },
                      {
                        value: "expert",
                        label: "Expert",
                        desc: "Looking for comprehensive expertise",
                      },
                    ].map((level) => (
                      <button
                        key={level.value}
                        onClick={() =>
                          setJobData({ ...jobData, experience: level.value })
                        }
                        className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                          jobData.experience === level.value
                            ? "border-[#0084ca] bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <h3 className="font-semibold text-gray-900">
                          {level.label}
                        </h3>
                        <p className="text-sm text-gray-600">{level.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Application Token Cost
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-600 mb-3">
                      Set how many tokens talents need to spend to apply for
                      this job. This helps filter serious applicants.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0084ca]" />
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={jobData.tokenCost}
                          onChange={(e) =>
                            setJobData({
                              ...jobData,
                              tokenCost: e.target.value,
                            })
                          }
                          placeholder="10"
                          className="pl-10"
                        />
                      </div>
                      <span className="text-sm text-gray-600">tokens</span>
                    </div>
                  </div>

                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    What is your budget?
                  </label>
                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() =>
                        setJobData({
                          ...jobData,
                          budget: { ...jobData.budget, type: "hourly" },
                        })
                      }
                      className={`px-6 py-2 rounded-full font-medium transition-colors ${
                        jobData.budget.type === "hourly"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Hourly rate
                    </button>
                    <button
                      onClick={() =>
                        setJobData({
                          ...jobData,
                          budget: { ...jobData.budget, type: "fixed" },
                        })
                      }
                      className={`px-6 py-2 rounded-full font-medium transition-colors ${
                        jobData.budget.type === "fixed"
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Fixed price
                    </button>
                  </div>

                  {jobData.budget.type === "hourly" ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          From ($/hr)
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            type="number"
                            value={jobData.budget.min}
                            onChange={(e) =>
                              setJobData({
                                ...jobData,
                                budget: {
                                  ...jobData.budget,
                                  min: e.target.value,
                                },
                              })
                            }
                            placeholder="15"
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          To ($/hr)
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input
                            type="number"
                            value={jobData.budget.max}
                            onChange={(e) =>
                              setJobData({
                                ...jobData,
                                budget: {
                                  ...jobData.budget,
                                  max: e.target.value,
                                },
                              })
                            }
                            placeholder="50"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Project budget ($)
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                          type="number"
                          value={jobData.budget.fixed}
                          onChange={(e) =>
                            setJobData({
                              ...jobData,
                              budget: {
                                ...jobData.budget,
                                fixed: e.target.value,
                              },
                            })
                          }
                          placeholder="5000"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Review your job post
              </h2>
              <p className="text-gray-600 mb-6">
                Make sure everything looks correct before posting your job.
              </p>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {jobData.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Category: {jobData.category}
                  </p>
                  <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                    {jobData.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {jobData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-white border border-gray-200 text-gray-700 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Project Size:</span>
                      <span className="ml-2 font-medium text-gray-900 capitalize">
                        {jobData.scope}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {jobData.duration.replace(/-/g, " ")}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Experience:</span>
                      <span className="ml-2 font-medium text-gray-900 capitalize">
                        {jobData.experience}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Budget:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {jobData.budget.type === "fixed"
                          ? `$${jobData.budget.fixed} (Fixed)`
                          : `$${jobData.budget.min} - $${jobData.budget.max}/hr`}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Token Cost:</span>
                      <span className="ml-2 font-medium text-[#0084ca]">
                        {jobData.tokenCost} tokens
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">
                    What happens next?
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#0084ca] flex-shrink-0 mt-0.5" />
                      <span>
                        Your job will be visible to qualified freelancers
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#0084ca] flex-shrink-0 mt-0.5" />
                      <span>
                        You'll start receiving proposals within 24 hours
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#0084ca] flex-shrink-0 mt-0.5" />
                      <span>
                        Review and interview candidates to find the perfect fit
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Back
            </Button>
            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                className="bg-[#0084ca] hover:bg-[#006ba6] text-white"
                disabled={
                  (step === 1 &&
                    (!jobData.title ||
                      !jobData.category_id ||
                      !jobData.description)) ||
                  (step === 2 && jobData.skills.length === 0) ||
                  (step === 3 && !jobData.duration)
                }
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-[#0084ca] hover:bg-[#006ba6] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post Job"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
