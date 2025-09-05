import React from 'react'

const Tabs = ({ activeTab, setActiveTab, tabs }) => {
  return (
    <div className="border-b border-gray-800">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-dark-muted hover:text-dark-text hover:border-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}

export default Tabs