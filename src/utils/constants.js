/**
 * Application Constants
 * Centralized constants for FitFlow AI
 */

// Exercise Categories
export const EXERCISE_CATEGORIES = {
  CHEST: 'chest',
  BACK: 'back',
  SHOULDERS: 'shoulders',
  ARMS: 'arms',
  LEGS: 'legs',
  CORE: 'core',
  CARDIO: 'cardio',
  FULL_BODY: 'full_body',
}

// Exercise Types
export const EXERCISE_TYPES = {
  STRENGTH: 'strength',
  CARDIO: 'cardio',
  FLEXIBILITY: 'flexibility',
  BALANCE: 'balance',
  PLYOMETRIC: 'plyometric',
}

// Workout Status
export const WORKOUT_STATUS = {
  PLANNED: 'planned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

// Subscription Tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  ELITE: 'elite',
}

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  COACH: 'coach',
}

// Recommendation Types
export const RECOMMENDATION_TYPES = {
  STRENGTH: 'strength',
  FREQUENCY: 'frequency',
  BALANCE: 'balance',
  RECOVERY: 'recovery',
  TECHNIQUE: 'technique',
  PROGRESSION: 'progression',
  NUTRITION: 'nutrition',
}

// Recommendation Priorities
export const RECOMMENDATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
}

// Analytics Time Periods
export const TIME_PERIODS = {
  WEEK: 'week',
  MONTH: 'month',
  QUARTER: 'quarter',
  YEAR: 'year',
  ALL_TIME: 'all_time',
}

// Chart Types
export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  AREA: 'area',
  SCATTER: 'scatter',
}

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // Users
  PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  DELETE_ACCOUNT: '/users/delete',

  // Workouts
  WORKOUTS: '/workouts',
  WORKOUT_BY_ID: '/workouts/:id',
  START_WORKOUT: '/workouts/start',
  END_WORKOUT: '/workouts/:id/end',

  // Exercises
  EXERCISES: '/exercises',
  EXERCISE_BY_ID: '/exercises/:id',
  EXERCISE_LIBRARY: '/exercises/library',

  // Analytics
  ANALYTICS: '/analytics',
  PROGRESS: '/analytics/progress',
  STATS: '/analytics/stats',

  // Recommendations
  RECOMMENDATIONS: '/recommendations',
  GENERATE_RECOMMENDATIONS: '/recommendations/generate',

  // Subscriptions
  SUBSCRIPTION: '/subscription',
  CREATE_SUBSCRIPTION: '/subscription/create',
  CANCEL_SUBSCRIPTION: '/subscription/cancel',
  UPDATE_SUBSCRIPTION: '/subscription/update',

  // Payments
  CREATE_PAYMENT_INTENT: '/payments/create-intent',
  WEBHOOK: '/payments/webhook',
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. Please check your permissions.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  WORKOUT_SAVED: 'Workout saved successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  SUBSCRIPTION_CREATED: 'Subscription created successfully!',
  SUBSCRIPTION_CANCELLED: 'Subscription cancelled successfully!',
  PASSWORD_RESET: 'Password reset email sent!',
  ACCOUNT_CREATED: 'Account created successfully!',
  LOGIN_SUCCESS: 'Welcome back!',
  LOGOUT_SUCCESS: 'Logged out successfully!',
}

// Loading Messages
export const LOADING_MESSAGES = {
  SAVING_WORKOUT: 'Saving workout...',
  LOADING_WORKOUTS: 'Loading workouts...',
  GENERATING_RECOMMENDATIONS: 'Generating AI recommendations...',
  PROCESSING_PAYMENT: 'Processing payment...',
  UPDATING_PROFILE: 'Updating profile...',
  AUTHENTICATING: 'Authenticating...',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'fitflow_auth_token',
  USER_PREFERENCES: 'fitflow_user_preferences',
  WORKOUT_DRAFT: 'fitflow_workout_draft',
  THEME: 'fitflow_theme',
  ONBOARDING_COMPLETED: 'fitflow_onboarding_completed',
}

// Default Values
export const DEFAULTS = {
  WORKOUT_DURATION: 60, // minutes
  REST_TIME: 60, // seconds
  SETS: 3,
  REPS: 10,
  WEIGHT: 0,
  PAGE_SIZE: 20,
  CHART_COLORS: [
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // yellow
    '#EF4444', // red
    '#8B5CF6', // purple
    '#F97316', // orange
    '#06B6D4', // cyan
    '#84CC16', // lime
  ],
}

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  WEIGHT_MIN: 0,
  WEIGHT_MAX: 1000,
  REPS_MIN: 1,
  REPS_MAX: 100,
  SETS_MIN: 1,
  SETS_MAX: 20,
  DURATION_MIN: 1,
  DURATION_MAX: 480, // 8 hours
}

// Feature Flags
export const FEATURE_FLAGS = {
  AI_RECOMMENDATIONS: 'ai_recommendations',
  REAL_TIME_TRACKING: 'real_time_tracking',
  SUBSCRIPTION_FEATURES: 'subscription_features',
  SOCIAL_FEATURES: 'social_features',
  WEARABLE_INTEGRATION: 'wearable_integration',
}

export default {
  EXERCISE_CATEGORIES,
  EXERCISE_TYPES,
  WORKOUT_STATUS,
  SUBSCRIPTION_TIERS,
  USER_ROLES,
  RECOMMENDATION_TYPES,
  RECOMMENDATION_PRIORITIES,
  TIME_PERIODS,
  CHART_TYPES,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  LOADING_MESSAGES,
  STORAGE_KEYS,
  DEFAULTS,
  VALIDATION_RULES,
  FEATURE_FLAGS,
}
