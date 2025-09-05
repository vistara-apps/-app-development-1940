import React from 'react'
import { 
  Home, 
  Dumbbell, 
  BarChart3, 
  Brain, 
  User, 
  Crown,
  Settings
} from 'lucide-react'

const Sidebar = ({ activeView, setActiveView, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'workouts', label: 'Log Workout', icon: Dumbbell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'recommendations', label: 'AI Insights', icon: Brain },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white/10 backdrop-blur-lg border-r border-white/20 z-10">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">FitFlow AI</h1>
        </div>

        <div className="mb-6">
          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-white font-medium">{user.name}</p>
                <div className="flex items-center gap-1">
                  <Crown className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-yellow-400 uppercase font-medium">
                    {user.subscriptionTier}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeView === item.id
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="mt-8 pt-6 border-t border-white/20">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar