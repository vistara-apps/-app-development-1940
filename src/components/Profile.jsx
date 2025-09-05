import React, { useState } from 'react'
import { User, Mail, Crown, Calendar, Settings, Save } from 'lucide-react'

const Profile = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    goals: 'Build muscle and increase strength',
    experience: 'intermediate',
    preferredUnits: 'lbs'
  })

  const handleSave = () => {
    setUser({ ...user, ...formData })
    setIsEditing(false)
  }

  const subscriptionFeatures = {
    free: ['Basic workout logging', 'Limited insights', 'Manual tracking'],
    pro: ['Advanced analytics', 'AI recommendations', 'Progress tracking', 'Export data'],
    elite: ['Personal coaching', 'Custom meal plans', 'Priority support', 'Advanced metrics']
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
          <p className="text-white/70">Manage your account and preferences</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Settings className="w-5 h-5" />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <h3 className="text-xl font-semibold text-white">{user.name}</h3>
              <p className="text-white/70">{user.email}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 uppercase font-medium text-sm">
                  {user.subscriptionTier}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-white/70">
                <Calendar className="w-5 h-5" />
                <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <User className="w-5 h-5" />
                <span>Intermediate Level</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <Mail className="w-5 h-5" />
                <span>Email Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-6">Personal Information</h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Fitness Goals</label>
                  <textarea
                    value={formData.goals}
                    onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="3"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Experience Level</label>
                    <select
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="beginner" className="text-gray-900">Beginner</option>
                      <option value="intermediate" className="text-gray-900">Intermediate</option>
                      <option value="advanced" className="text-gray-900">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Preferred Units</label>
                    <select
                      value={formData.preferredUnits}
                      onChange={(e) => setFormData({ ...formData, preferredUnits: e.target.value })}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="lbs" className="text-gray-900">Pounds (lbs)</option>
                      <option value="kg" className="text-gray-900">Kilograms (kg)</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-white/70 text-sm">Name</p>
                  <p className="text-white font-medium">{formData.name}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Email</p>
                  <p className="text-white font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm">Fitness Goals</p>
                  <p className="text-white font-medium">{formData.goals}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/70 text-sm">Experience Level</p>
                    <p className="text-white font-medium capitalize">{formData.experience}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Preferred Units</p>
                    <p className="text-white font-medium">{formData.preferredUnits}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Subscription Info */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-6">Subscription Details</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white font-medium">Current Plan: {user.subscriptionTier.toUpperCase()}</p>
                <p className="text-white/70 text-sm">
                  {user.subscriptionTier === 'pro' ? '$9/month' : user.subscriptionTier === 'elite' ? '$19/month' : 'Free'}
                </p>
              </div>
              <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Upgrade Plan
              </button>
            </div>
            
            <div>
              <p className="text-white/70 text-sm mb-2">Features included:</p>
              <ul className="space-y-1">
                {subscriptionFeatures[user.subscriptionTier].map((feature, index) => (
                  <li key={index} className="text-white/70 text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile