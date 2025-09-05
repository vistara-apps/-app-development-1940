import React, { useState } from 'react'
import { User, Bell, Crown, CreditCard, Shield, HelpCircle } from 'lucide-react'
import Card from './ui/Card'
import Button from './ui/Button'
import Input from './ui/Input'
import Tabs from './ui/Tabs'

const Settings = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('profile')
  const [notifications, setNotifications] = useState({
    workoutReminders: true,
    progressUpdates: true,
    aiInsights: true,
    weeklyReports: false
  })

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'subscription', label: 'Subscription' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' }
  ]

  const subscriptionTiers = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Basic workout logging',
        'Limited progress tracking',
        '5 AI insights per month',
        'Basic charts'
      ],
      current: user.subscriptionTier === 'free'
    },
    {
      name: 'Pro',
      price: '$9',
      period: 'month',
      features: [
        'Unlimited workout logging',
        'Advanced analytics',
        'Unlimited AI insights',
        'Export data',
        'Goal setting'
      ],
      current: user.subscriptionTier === 'pro',
      popular: true
    },
    {
      name: 'Elite',
      price: '$19',
      period: 'month',
      features: [
        'Everything in Pro',
        'Personal AI coach',
        'Custom workout plans',
        'Priority support',
        'Advanced integrations'
      ],
      current: user.subscriptionTier === 'elite'
    }
  ]

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-text mb-2">Settings</h1>
        <p className="text-dark-muted">
          Manage your account, subscription, and preferences.
        </p>
      </div>

      {/* Tabs */}
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark-text">{user.name}</h3>
                <p className="text-dark-muted">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Crown className="w-4 h-4 text-accent" />
                  <span className="text-accent capitalize">{user.subscriptionTier} Member</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                value={user.name}
                onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                label="Email Address"
                type="email"
                value={user.email}
                onChange={(e) => setUser(prev => ({ ...prev, email: e.target.value }))}
              />
              <Input
                label="Current Goal"
                placeholder="e.g., Increase bench press to 225 lbs"
              />
              <Input
                label="Training Experience"
                placeholder="e.g., 2 years"
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Crown className="w-6 h-6 text-accent" />
              <h3 className="text-xl font-semibold text-dark-text">Subscription Plans</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {subscriptionTiers.map((tier) => (
                <div 
                  key={tier.name}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    tier.current 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-700 bg-dark-card hover:border-gray-600'
                  } ${tier.popular ? 'ring-2 ring-accent' : ''}`}
                >
                  {tier.popular && (
                    <div className="inline-block px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full mb-4">
                      Most Popular
                    </div>
                  )}
                  
                  <h4 className="text-lg font-semibold text-dark-text mb-2">{tier.name}</h4>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-dark-text">{tier.price}</span>
                    <span className="text-dark-muted">/{tier.period}</span>
                  </div>
                  
                  <ul className="space-y-2 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="text-dark-muted text-sm flex items-center">
                        <span className="w-2 h-2 bg-accent rounded-full mr-3"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={tier.current ? 'outline' : 'primary'} 
                    className="w-full"
                    disabled={tier.current}
                  >
                    {tier.current ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-dark-text">Billing Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-dark-card rounded-lg">
                <div>
                  <p className="font-medium text-dark-text">Next billing date</p>
                  <p className="text-dark-muted text-sm">February 15, 2024</p>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-dark-card rounded-lg">
                <div>
                  <p className="font-medium text-dark-text">Payment method</p>
                  <p className="text-dark-muted text-sm">•••• •••• •••• 4242</p>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card>
          <div className="flex items-center space-x-3 mb-6">
            <Bell className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold text-dark-text">Notification Preferences</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-dark-card rounded-lg">
                <div>
                  <p className="font-medium text-dark-text capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-dark-muted text-sm">
                    {key === 'workoutReminders' && 'Get reminded to log your workouts'}
                    {key === 'progressUpdates' && 'Receive updates on your fitness progress'}
                    {key === 'aiInsights' && 'Get notified when new AI insights are available'}
                    {key === 'weeklyReports' && 'Receive weekly summary reports'}
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Privacy Tab */}
      {activeTab === 'privacy' && (
        <div className="space-y-6">
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold text-dark-text">Privacy & Security</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-dark-card rounded-lg">
                <h4 className="font-medium text-dark-text mb-2">Data Export</h4>
                <p className="text-dark-muted text-sm mb-3">
                  Download all your workout data and progress history.
                </p>
                <Button variant="outline" size="sm">Export Data</Button>
              </div>

              <div className="p-4 bg-dark-card rounded-lg">
                <h4 className="font-medium text-dark-text mb-2">Account Deletion</h4>
                <p className="text-dark-muted text-sm mb-3">
                  Permanently delete your account and all associated data.
                </p>
                <Button variant="destructive" size="sm">Delete Account</Button>
              </div>

              <div className="p-4 bg-dark-card rounded-lg">
                <h4 className="font-medium text-dark-text mb-2">Data Sharing</h4>
                <p className="text-dark-muted text-sm mb-3">
                  Control how your anonymized data is used to improve our AI models.
                </p>
                <Button variant="outline" size="sm">Manage Preferences</Button>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center space-x-3 mb-4">
              <HelpCircle className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-dark-text">Support</h3>
            </div>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help Center
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Settings