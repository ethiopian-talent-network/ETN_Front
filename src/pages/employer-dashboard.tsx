import { useState } from "react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPostJobModal, setShowPostJobModal] = useState(false);

  const sidebarItems = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "jobs", label: "My Jobs", icon: "💼" },
    { id: "talents", label: "Find Talents", icon: "🔍" },
    { id: "proposals", label: "Proposals", icon: "📄" },
    { id: "contracts", label: "Contracts", icon: "📋" },
    { id: "messages", label: "Messages", icon: "💬" },
    { id: "reports", label: "Reports", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "jobs":
        return <JobsManagement onPostJob={() => setShowPostJobModal(true)} />;
      case "talents":
        return <TalentSearch />;
      case "proposals":
        return <ProposalsManagement />;
      case "contracts":
        return <ContractsManagement />;
      case "messages":
        return <MessagesSection />;
      case "reports":
        return <ReportsSection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-[#0084ca]">ETN</h1>
            <span className="text-sm text-gray-600">Employer</span>
          </Link>
        </div>
        
        <nav className="px-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg mb-1 flex items-center space-x-3 transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-[#0084ca] border-l-4 border-[#0084ca]"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {sidebarItems.find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back! Here's what's happening with your projects.
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <span>🔔</span>
                <span>Notifications</span>
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#0084ca] rounded-full flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Doe</p>
                  <p className="text-xs text-gray-600">john@example.com</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {renderContent()}
        </main>
      </div>

      {/* Post Job Modal */}
      {showPostJobModal && (
        <PostJobModal onClose={() => setShowPostJobModal(false)} />
      )}
    </div>
  );
}

// Dashboard Overview Component
function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <div className="text-3xl">💼</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Proposals</p>
              <p className="text-2xl font-bold text-gray-900">48</p>
            </div>
            <div className="text-3xl">📄</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <div className="text-3xl">📋</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">$12,450</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Proposals</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#0084ca] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    T{i}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Talent {i}</p>
                    <p className="text-xs text-gray-600">React Developer</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">$45/hr</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Messages</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    F{i}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Freelancer {i}</p>
                    <p className="text-xs text-gray-600">Project update...</p>
                  </div>
                </div>
                <p className="text-xs text-gray-600">1 hour ago</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Jobs Management Component
function JobsManagement({ onPostJob }: { onPostJob: () => void }) {
  const jobs = [
    { id: 1, title: "React Frontend Developer", status: "active", proposals: 12, budget: "$5,000" },
    { id: 2, title: "UI/UX Designer", status: "active", proposals: 8, budget: "$3,000" },
    { id: 3, title: "Full Stack Developer", status: "draft", proposals: 0, budget: "$8,000" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">My Job Postings</h3>
        <Button onClick={onPostJob} className="bg-[#0084ca] hover:bg-[#006ba6]">
          Post New Job
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proposals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{job.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      job.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.proposals}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.budget}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="outline" size="sm" className="mr-2">View</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Talent Search Component
function TalentSearch() {
  const talents = [
    { id: 1, name: "Sarah Johnson", title: "React Developer", rate: "$45/hr", rating: 4.8, jobs: 23 },
    { id: 2, name: "Mike Chen", title: "UI/UX Designer", rate: "$55/hr", rating: 4.9, jobs: 31 },
    { id: 3, name: "Emily Davis", title: "Full Stack Developer", rate: "$60/hr", rating: 4.7, jobs: 18 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-900">Find Talents</h3>
        <div className="flex space-x-2">
          <Input placeholder="Search talents..." className="w-64" />
          <Button variant="outline">Filter</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {talents.map((talent) => (
          <div key={talent.id} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-[#0084ca] rounded-full flex items-center justify-center text-white font-semibold">
                {talent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{talent.name}</h4>
                <p className="text-sm text-gray-600">{talent.title}</p>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rate:</span>
                <span className="font-medium">{talent.rate}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Rating:</span>
                <span className="font-medium">⭐ {talent.rating}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Jobs Completed:</span>
                <span className="font-medium">{talent.jobs}</span>
              </div>
            </div>
            
            <Button className="w-full bg-[#0084ca] hover:bg-[#006ba6]">
              View Profile
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Other placeholder components
function ProposalsManagement() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Proposals Management</h3>
      <p className="text-gray-600">Proposals management functionality coming soon...</p>
    </div>
  );
}

function ContractsManagement() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Contracts Management</h3>
      <p className="text-gray-600">Contracts management functionality coming soon...</p>
    </div>
  );
}

function MessagesSection() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Messages</h3>
      <p className="text-gray-600">Messaging functionality coming soon...</p>
    </div>
  );
}

function ReportsSection() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Reports</h3>
      <p className="text-gray-600">Reports functionality coming soon...</p>
    </div>
  );
}

function SettingsSection() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Settings</h3>
      <p className="text-gray-600">Settings functionality coming soon...</p>
    </div>
  );
}

// Post Job Modal Component
function PostJobModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Post a New Job</h3>
          <Button variant="outline" onClick={onClose}>✕</Button>
        </div>
        
        <form className="space-y-4">
          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input id="jobTitle" placeholder="e.g. React Frontend Developer" />
          </div>
          
          <div>
            <Label htmlFor="jobDescription">Job Description</Label>
            <textarea 
              id="jobDescription" 
              className="w-full p-3 border border-gray-300 rounded-lg"
              rows={6}
              placeholder="Describe the job requirements..."
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Budget</Label>
              <Input id="budget" placeholder="e.g. $5,000" />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input id="duration" placeholder="e.g. 2 weeks" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="skills">Required Skills</Label>
            <Input id="skills" placeholder="e.g. React, TypeScript, Node.js" />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button className="bg-[#0084ca] hover:bg-[#006ba6]">Post Job</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
