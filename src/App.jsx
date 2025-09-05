import React, { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import WorkoutLogger from './components/WorkoutLogger'
import Analytics from './components/Analytics'
import Recommendations from './components/Recommendations'
import Profile from './components/Profile'
import { WorkoutProvider } from './context/WorkoutContext'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex@example.com',
    subscriptionTier: 'pro',
    joinDate: '2024-01-15'
  })

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />
      case 'workouts':
        return <WorkoutLogger />
      case 'analytics':
        return <Analytics />
      case 'recommendations':
        return <Recommendations />
      case 'profile':
        return <Profile user={user} setUser={setUser} />
      default:
        return <Dashboard />
    }
  }

  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800">
        <div className="flex">
          <Sidebar activeView={activeView} setActiveView={setActiveView} user={user} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 ml-64">
            <div className="max-w-7xl mx-auto">
              {renderActiveView()}
            </div>
          </main>
        </div>
      </div>
    </WorkoutProvider>
  )
}

export default App