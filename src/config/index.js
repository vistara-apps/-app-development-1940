/**
 * Application Configuration
 * Centralized configuration management for FitFlow AI
 */

// Environment variables with fallbacks
export const config = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    serviceRoleKey: import.meta.env.SUPABASE_SERVICE_ROLE_KEY || '',
  },

  // OpenAI Configuration
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    organizationId: import.meta.env.OPENAI_ORGANIZATION_ID || '',
    model: 'gpt-3.5-turbo',
    maxTokens: 1000,
    temperature: 0.7,
  },

  // Stripe Configuration
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: import.meta.env.STRIPE_SECRET_KEY || '',
    webhookSecret: import.meta.env.STRIPE_WEBHOOK_SECRET || '',
  },

  // Application Configuration
  app: {
    url: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5173/api',
    name: 'FitFlow AI',
    version: '1.0.0',
    environment: import.meta.env.NODE_ENV || 'development',
  },

  // Feature Flags
  features: {
    aiRecommendations: import.meta.env.VITE_ENABLE_AI_RECOMMENDATIONS === 'true',
    realTimeTracking: import.meta.env.VITE_ENABLE_REAL_TIME_TRACKING === 'true',
    subscriptionFeatures: import.meta.env.VITE_ENABLE_SUBSCRIPTION_FEATURES === 'true',
  },

  // API Configuration
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Subscription Tiers
  subscriptionTiers: {
    free: {
      name: 'Free',
      price: 0,
      features: ['Basic workout logging', 'Limited analytics', 'Basic progress tracking'],
      limits: {
        workoutsPerMonth: 50,
        aiRecommendationsPerMonth: 5,
        analyticsHistory: 30, // days
      },
    },
    pro: {
      name: 'Pro',
      price: 9,
      priceId: 'price_pro_monthly', // Stripe price ID
      features: [
        'Unlimited workout logging',
        'Advanced analytics',
        'AI-powered recommendations',
        'Progress insights',
        'Export data',
      ],
      limits: {
        workoutsPerMonth: -1, // unlimited
        aiRecommendationsPerMonth: 100,
        analyticsHistory: 365, // days
      },
    },
    elite: {
      name: 'Elite',
      price: 19,
      priceId: 'price_elite_monthly', // Stripe price ID
      features: [
        'Everything in Pro',
        'Real-time workout tracking',
        'Advanced AI coaching',
        'Custom workout plans',
        'Priority support',
        'Beta features access',
      ],
      limits: {
        workoutsPerMonth: -1, // unlimited
        aiRecommendationsPerMonth: -1, // unlimited
        analyticsHistory: -1, // unlimited
      },
    },
  },
}

// Validation function to check if required config is present
export const validateConfig = () => {
  const errors = []

  if (!config.supabase.url) {
    errors.push('VITE_SUPABASE_URL is required')
  }

  if (!config.supabase.anonKey) {
    errors.push('VITE_SUPABASE_ANON_KEY is required')
  }

  if (config.features.aiRecommendations && !config.openai.apiKey) {
    errors.push('VITE_OPENAI_API_KEY is required when AI recommendations are enabled')
  }

  if (config.features.subscriptionFeatures && !config.stripe.publishableKey) {
    errors.push('VITE_STRIPE_PUBLISHABLE_KEY is required when subscription features are enabled')
  }

  return errors
}

// Development mode check
export const isDevelopment = () => config.app.environment === 'development'
export const isProduction = () => config.app.environment === 'production'

export default config
