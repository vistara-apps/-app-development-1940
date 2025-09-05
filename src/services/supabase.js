/**
 * Supabase Service
 * Handles all Supabase client initialization and configuration
 */

import { createClient } from '@supabase/supabase-js'
import { config } from '../config'

// Initialize Supabase client
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
)

// Auth helpers
export const auth = {
  // Sign up new user
  signUp: async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  },

  // Sign in user
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
  },

  // Sign out user
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return { session, error: null }
    } catch (error) {
      console.error('Get session error:', error)
      return { session: null, error }
    }
  },

  // Get current user
  getUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error) throw error
      return { user, error: null }
    } catch (error) {
      console.error('Get user error:', error)
      return { user: null, error }
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${config.app.url}/reset-password`,
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { data: null, error }
    }
  },

  // Update password
  updatePassword: async (password) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password,
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Update password error:', error)
      return { data: null, error }
    }
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// Database helpers
export const db = {
  // Generic select
  select: (table, columns = '*') => {
    return supabase.from(table).select(columns)
  },

  // Generic insert
  insert: (table, data) => {
    return supabase.from(table).insert(data)
  },

  // Generic update
  update: (table, data) => {
    return supabase.from(table).update(data)
  },

  // Generic delete
  delete: (table) => {
    return supabase.from(table).delete()
  },

  // Generic upsert
  upsert: (table, data) => {
    return supabase.from(table).upsert(data)
  },
}

// Real-time helpers
export const realtime = {
  // Subscribe to table changes
  subscribe: (table, callback, filter = '*') => {
    return supabase
      .channel(`public:${table}`)
      .on('postgres_changes', 
        { 
          event: filter, 
          schema: 'public', 
          table: table 
        }, 
        callback
      )
      .subscribe()
  },

  // Unsubscribe from channel
  unsubscribe: (channel) => {
    return supabase.removeChannel(channel)
  },
}

// Storage helpers
export const storage = {
  // Upload file
  upload: async (bucket, path, file, options = {}) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, options)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Upload error:', error)
      return { data: null, error }
    }
  },

  // Download file
  download: async (bucket, path) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Download error:', error)
      return { data: null, error }
    }
  },

  // Get public URL
  getPublicUrl: (bucket, path) => {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },

  // Delete file
  remove: async (bucket, paths) => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove(paths)
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Remove error:', error)
      return { data: null, error }
    }
  },
}

// Error handling helper
export const handleSupabaseError = (error) => {
  if (!error) return null

  // Map common Supabase errors to user-friendly messages
  const errorMap = {
    'Invalid login credentials': 'Invalid email or password',
    'Email not confirmed': 'Please check your email and confirm your account',
    'User already registered': 'An account with this email already exists',
    'Password should be at least 6 characters': 'Password must be at least 6 characters long',
  }

  return errorMap[error.message] || error.message || 'An unexpected error occurred'
}

export default supabase
