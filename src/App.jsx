import React, { useState, useEffect } from 'react'
import AppShell from './components/AppShell'
import Dashboard from './components/Dashboard'
import WorkoutLogger from './components/WorkoutLogger'
import Progress from './components/Progress'
import Recommendations from './components/Recommendations'
import Settings from './components/Settings'
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
        return <Dashboard user={user} />
      case 'logger':
        return <WorkoutLogger />
      case 'progress':
        return <Progress />
      case 'recommendations':
        return <Recommendations />
      case 'settings':
        return <Settings user={user} setUser={setUser} />
      default:
        return <Dashboard user={user} />
    }
  }

  return (
    <WorkoutProvider>
      <div className="min-h-screen bg-dark-bg text-dark-text">
        <AppShell 
          activeView={activeView} 
          setActiveView={setActiveView}
          user={user}
        >
          {renderActiveView()}
        </AppShell>
      </div>
    </WorkoutProvider>
  )
}

export default App