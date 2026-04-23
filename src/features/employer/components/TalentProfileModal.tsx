import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import type { Talent } from '../types/employer.types';

interface TalentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  talentId: number | null;
  darkMode?: boolean;
}

export const TalentProfileModal: React.FC<TalentProfileModalProps> = ({
  isOpen,
  onClose,
  talentId,
  darkMode = false,
}) => {
  const [talent, setTalent] = useState<Talent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock talent data - replace with actual API call
  const mockTalentData: Record<number, Talent> = {
    1: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      profile_title: 'Senior React Developer',
      profile_image: '',
      hourly_rate: 75,
      location: 'New York, USA',
      skills: ['React', 'TypeScript', 'Node.js', 'Redux', 'GraphQL'],
      created_at: '2024-01-01',
    },
    2: {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      profile_title: 'Full Stack Developer',
      profile_image: '',
      hourly_rate: 65,
      location: 'San Francisco, USA',
      skills: ['JavaScript', 'Python', 'Django', 'PostgreSQL', 'Docker'],
      created_at: '2024-01-01',
    },
  };

  useEffect(() => {
    if (isOpen && talentId) {
      fetchTalentProfile(talentId);
    }
  }, [isOpen, talentId]);

  const fetchTalentProfile = async (id: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      const talentData = mockTalentData[id];
      
      if (talentData) {
        setTalent(talentData);
      } else {
        setError('Talent profile not found');
      }
    } catch (err) {
      setError('Failed to load talent profile');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTalent(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Talent Profile
            </h2>
            <button
              onClick={handleClose}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className={`text-gray-500 ${darkMode ? 'text-gray-400' : ''}`}>Loading profile...</p>
            </div>
          )}

          {error && (
            <div className={`text-center py-8 px-4 rounded-lg border ${
              darkMode ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium mb-2">Error Loading Profile</h3>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {talent && !loading && !error && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-6">
                {talent.profile_image ? (
                  <img
                    src={talent.profile_image}
                    alt={talent.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <span className={`text-2xl font-bold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {talent.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {talent.name}
                  </h3>
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {talent.profile_title}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    {talent.location && (
                      <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {talent.location}
                      </span>
                    )}
                    {talent.hourly_rate && (
                      <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        ${talent.hourly_rate}/hour
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Contact Information
                </h4>
                <div className="space-y-2">
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Email:</span> {talent.email}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Member Since:</span> {new Date(talent.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Skills */}
              {talent.skills && talent.skills.length > 0 && (
                <div>
                  <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {talent.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 text-sm rounded-full ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button className="flex-1">
                  Send Message
                </Button>
                <Button variant="outline" className={darkMode ? 'border-gray-600 text-gray-300' : ''}>
                  Save Profile
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
