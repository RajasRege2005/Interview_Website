import React, { useState } from 'react';
import { Button } from '../components/ui/moving-border';
import { 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconBriefcase,
  IconEdit,
  IconDeviceFloppy,
  IconX,
  IconTrophy,
  IconCalendar
} from '@tabler/icons-react';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    title: 'Software Engineer',
    company: 'Tech Corp',
    bio: 'Experienced software engineer with 5+ years in web development. Passionate about creating efficient solutions and continuous learning.'
  });

  const [editProfile, setEditProfile] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditProfile(profile);
  };

  const handleSave = () => {
    setProfile(editProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditProfile(profile);
  };

  const handleChange = (field, value) => {
    setEditProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Mock interview stats
  const interviewStats = {
    totalInterviews: 12,
    averageScore: 8.3,
    bestScore: 9.2,
    totalHours: 6.5
  };

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-12 mt-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">My Profile</h1>
          <p className="text-xl text-white/70">Manage your account and track your progress</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                {!isEditing ? (
                  <Button
                    borderRadius="0.5rem"
                    className="bg-blue-500/80 text-white px-4 py-2 hover:bg-blue-600/80 transition-all duration-300"
                    onClick={handleEdit}
                  >
                    <div className="flex items-center space-x-2">
                      <IconEdit className="w-4 h-4" />
                      <span>Edit</span>
                    </div>
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      borderRadius="0.5rem"
                      className="bg-green-500/80 text-white px-4 py-2 hover:bg-green-600/80 transition-all duration-300"
                      onClick={handleSave}
                    >
                      <div className="flex items-center space-x-2">
                        <IconDeviceFloppy className="w-4 h-4" />
                        <span>Save</span>
                      </div>
                    </Button>
                    <Button
                      borderRadius="0.5rem"
                      className="bg-gray-500/80 text-white px-4 py-2 hover:bg-gray-600/80 transition-all duration-300"
                      onClick={handleCancel}
                    >
                      <div className="flex items-center space-x-2">
                        <IconX className="w-4 h-4" />
                        <span>Cancel</span>
                      </div>
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <IconUser className="w-4 h-4" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editProfile.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    />
                  ) : (
                    <p className="text-white text-lg">{profile.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <IconMail className="w-4 h-4" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editProfile.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    />
                  ) : (
                    <p className="text-white text-lg">{profile.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <IconPhone className="w-4 h-4" />
                    Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editProfile.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    />
                  ) : (
                    <p className="text-white text-lg">{profile.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <IconMapPin className="w-4 h-4" />
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editProfile.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    />
                  ) : (
                    <p className="text-white text-lg">{profile.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium flex items-center gap-2">
                    <IconBriefcase className="w-4 h-4" />
                    Job Title
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editProfile.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    />
                  ) : (
                    <p className="text-white text-lg">{profile.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">Company</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editProfile.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300"
                    />
                  ) : (
                    <p className="text-white text-lg">{profile.company}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="text-white/80 text-sm font-medium">Bio</label>
                {isEditing ? (
                  <textarea
                    value={editProfile.bio}
                    onChange={(e) => handleChange('bio', e.target.value)}
                    rows={4}
                    className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-all duration-300 resize-none"
                  />
                ) : (
                  <p className="text-white/90 leading-relaxed">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Interview Stats */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <IconTrophy className="w-5 h-5 text-yellow-400" />
                Interview Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Interviews</span>
                  <span className="text-white font-semibold">{interviewStats.totalInterviews}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Average Score</span>
                  <span className="text-green-400 font-semibold">{interviewStats.averageScore}/10</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Best Score</span>
                  <span className="text-blue-400 font-semibold">{interviewStats.bestScore}/10</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Practice Hours</span>
                  <span className="text-purple-400 font-semibold">{interviewStats.totalHours}h</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <IconCalendar className="w-5 h-5 text-blue-400" />
                Recent Activity
              </h3>
              
              <div className="space-y-3">
                <div className="border-l-2 border-green-400 pl-3">
                  <p className="text-white/90 text-sm">Completed Behavioral Interview</p>
                  <p className="text-white/60 text-xs">Score: 8.5/10 • 2 hours ago</p>
                </div>
                
                <div className="border-l-2 border-blue-400 pl-3">
                  <p className="text-white/90 text-sm">Completed Technical Interview</p>
                  <p className="text-white/60 text-xs">Score: 7.8/10 • 1 day ago</p>
                </div>
                
                <div className="border-l-2 border-purple-400 pl-3">
                  <p className="text-white/90 text-sm">Profile Updated</p>
                  <p className="text-white/60 text-xs">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;