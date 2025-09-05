/**
 * Supabase Service
 * Database connection and utilities
 */

import { createClient } from '@supabase/supabase-js'
import { config } from '../config'

// Initialize Supabase client
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey
)

// Database query builder shorthand
export const db = {
  select: (table, columns = '*') => supabase.from(table).select(columns),
  insert: (table, data) => supabase.from(table).insert(data),
  update: (table, data) => supabase.from(table).update(data),
  delete: (table) => supabase.from(table).delete(),
  upsert: (table, data) => supabase.from(table).upsert(data),
}

// Error handling utility
export const handleSupabaseError = (error) => {
  console.error('Supabase error:', error)
  
  if (error.code === 'PGRST116') {
    return { message: 'No data found', code: 'NOT_FOUND' }
  }
  
  if (error.code === '23505') {
    return { message: 'Data already exists', code: 'DUPLICATE' }
  }
  
  if (error.code === '42501') {
    return { message: 'Permission denied', code: 'UNAUTHORIZED' }
  }
  
  return { 
    message: error.message || 'An unexpected error occurred', 
    code: error.code || 'UNKNOWN' 
  }
}

// Auth utilities
export const auth = {
  signUp: (email, password, options = {}) => supabase.auth.signUp({ email, password, options }),
  signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getUser: () => supabase.auth.getUser(),
  getSession: () => supabase.auth.getSession(),
  onAuthStateChange: (callback) => supabase.auth.onAuthStateChange(callback),
}

export default supabase
