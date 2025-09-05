-- FitFlow AI Database Schema
-- Initial migration for core tables and relationships

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'elite');
CREATE TYPE workout_status AS ENUM ('planned', 'in_progress', 'completed', 'cancelled');
CREATE TYPE exercise_category AS ENUM ('chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'full_body');
CREATE TYPE exercise_type AS ENUM ('strength', 'cardio', 'flexibility', 'balance', 'plyometric');
CREATE TYPE recommendation_type AS ENUM ('strength', 'frequency', 'balance', 'recovery', 'technique', 'progression', 'nutrition');
CREATE TYPE recommendation_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    subscription_tier subscription_tier DEFAULT 'free',
    subscription_id TEXT, -- Stripe subscription ID
    customer_id TEXT, -- Stripe customer ID
    subscription_status TEXT,
    subscription_current_period_end TIMESTAMPTZ,
    fitness_goals TEXT[],
    experience_level TEXT DEFAULT 'beginner',
    preferred_units TEXT DEFAULT 'imperial', -- imperial or metric
    timezone TEXT DEFAULT 'UTC',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    ai_recommendations_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workouts table
CREATE TABLE public.workouts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT,
    status workout_status DEFAULT 'planned',
    start_time TIMESTAMPTZ,
    end_time TIMESTAMPTZ,
    duration INTEGER, -- in minutes
    notes TEXT,
    total_volume DECIMAL, -- total weight * reps * sets
    calories_burned INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercise library table
CREATE TABLE public.exercise_library (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    category exercise_category NOT NULL,
    type exercise_type NOT NULL,
    muscle_groups TEXT[],
    equipment TEXT[],
    instructions TEXT,
    tips TEXT,
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    is_custom BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exercises table (workout exercises)
CREATE TABLE public.exercises (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE NOT NULL,
    exercise_library_id UUID REFERENCES public.exercise_library(id) ON DELETE SET NULL,
    exercise_name TEXT NOT NULL, -- Denormalized for performance
    sets INTEGER NOT NULL CHECK (sets > 0),
    reps INTEGER NOT NULL CHECK (reps > 0),
    weight DECIMAL DEFAULT 0,
    rest_time INTEGER, -- in seconds
    notes TEXT,
    order_index INTEGER DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Personal records table
CREATE TABLE public.personal_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    exercise_library_id UUID REFERENCES public.exercise_library(id) ON DELETE CASCADE NOT NULL,
    exercise_name TEXT NOT NULL,
    record_type TEXT NOT NULL, -- '1rm', 'max_reps', 'max_volume', etc.
    value DECIMAL NOT NULL,
    unit TEXT DEFAULT 'lbs',
    achieved_at TIMESTAMPTZ DEFAULT NOW(),
    workout_id UUID REFERENCES public.workouts(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, exercise_library_id, record_type)
);

-- AI Recommendations table
CREATE TABLE public.recommendations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type recommendation_type NOT NULL,
    priority recommendation_priority DEFAULT 'medium',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    action TEXT,
    expected_outcome TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    is_applied BOOLEAN DEFAULT FALSE,
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    metadata JSONB, -- Additional data like OpenAI usage, context, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User preferences table
CREATE TABLE public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    theme TEXT DEFAULT 'system',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    workout_reminders BOOLEAN DEFAULT TRUE,
    progress_reports BOOLEAN DEFAULT TRUE,
    ai_recommendations_frequency TEXT DEFAULT 'weekly', -- daily, weekly, monthly
    default_rest_time INTEGER DEFAULT 60, -- seconds
    auto_start_rest_timer BOOLEAN DEFAULT TRUE,
    preferred_charts TEXT[] DEFAULT ARRAY['line', 'bar'],
    dashboard_widgets TEXT[] DEFAULT ARRAY['stats', 'recent_workouts', 'progress'],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workout templates table
CREATE TABLE public.workout_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    exercises JSONB NOT NULL, -- Array of exercise objects
    estimated_duration INTEGER, -- minutes
    difficulty_level INTEGER CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
    tags TEXT[],
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Analytics cache table (for performance)
CREATE TABLE public.analytics_cache (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    metric_type TEXT NOT NULL, -- 'strength_progress', 'volume_trend', etc.
    time_period TEXT NOT NULL, -- 'week', 'month', 'quarter', 'year'
    data JSONB NOT NULL,
    calculated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    
    UNIQUE(user_id, metric_type, time_period)
);

-- Subscription usage tracking
CREATE TABLE public.subscription_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
    workouts_logged INTEGER DEFAULT 0,
    ai_recommendations_used INTEGER DEFAULT 0,
    analytics_queries INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, month_year)
);

-- Create indexes for performance
CREATE INDEX idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX idx_workouts_created_at ON public.workouts(created_at DESC);
CREATE INDEX idx_workouts_status ON public.workouts(status);

CREATE INDEX idx_exercises_workout_id ON public.exercises(workout_id);
CREATE INDEX idx_exercises_exercise_name ON public.exercises(exercise_name);
CREATE INDEX idx_exercises_created_at ON public.exercises(created_at DESC);

CREATE INDEX idx_exercise_library_category ON public.exercise_library(category);
CREATE INDEX idx_exercise_library_type ON public.exercise_library(type);
CREATE INDEX idx_exercise_library_name ON public.exercise_library(name);

CREATE INDEX idx_personal_records_user_id ON public.personal_records(user_id);
CREATE INDEX idx_personal_records_exercise ON public.personal_records(exercise_library_id);
CREATE INDEX idx_personal_records_achieved_at ON public.personal_records(achieved_at DESC);

CREATE INDEX idx_recommendations_user_id ON public.recommendations(user_id);
CREATE INDEX idx_recommendations_generated_at ON public.recommendations(generated_at DESC);
CREATE INDEX idx_recommendations_priority ON public.recommendations(priority);
CREATE INDEX idx_recommendations_is_read ON public.recommendations(is_read);

CREATE INDEX idx_analytics_cache_user_id ON public.analytics_cache(user_id);
CREATE INDEX idx_analytics_cache_expires_at ON public.analytics_cache(expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON public.workouts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exercises_updated_at BEFORE UPDATE ON public.exercises FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exercise_library_updated_at BEFORE UPDATE ON public.exercise_library FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workout_templates_updated_at BEFORE UPDATE ON public.workout_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_usage_updated_at BEFORE UPDATE ON public.subscription_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_usage ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own workouts" ON public.workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workouts" ON public.workouts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workouts" ON public.workouts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workouts" ON public.workouts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own exercises" ON public.exercises FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.workouts WHERE id = workout_id));
CREATE POLICY "Users can insert own exercises" ON public.exercises FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM public.workouts WHERE id = workout_id));
CREATE POLICY "Users can update own exercises" ON public.exercises FOR UPDATE USING (auth.uid() = (SELECT user_id FROM public.workouts WHERE id = workout_id));
CREATE POLICY "Users can delete own exercises" ON public.exercises FOR DELETE USING (auth.uid() = (SELECT user_id FROM public.workouts WHERE id = workout_id));

CREATE POLICY "Users can view own personal records" ON public.personal_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own personal records" ON public.personal_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own personal records" ON public.personal_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own personal records" ON public.personal_records FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own recommendations" ON public.recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own recommendations" ON public.recommendations FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own workout templates" ON public.workout_templates FOR SELECT USING (auth.uid() = user_id OR is_public = true);
CREATE POLICY "Users can insert own workout templates" ON public.workout_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workout templates" ON public.workout_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own workout templates" ON public.workout_templates FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own analytics cache" ON public.analytics_cache FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analytics cache" ON public.analytics_cache FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own analytics cache" ON public.analytics_cache FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own analytics cache" ON public.analytics_cache FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscription usage" ON public.subscription_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscription usage" ON public.subscription_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription usage" ON public.subscription_usage FOR UPDATE USING (auth.uid() = user_id);

-- Exercise library is public for reading, but only admins/creators can modify
CREATE POLICY "Anyone can view exercise library" ON public.exercise_library FOR SELECT USING (true);
CREATE POLICY "Users can insert custom exercises" ON public.exercise_library FOR INSERT WITH CHECK (auth.uid() = created_by AND is_custom = true);
CREATE POLICY "Users can update own custom exercises" ON public.exercise_library FOR UPDATE USING (auth.uid() = created_by AND is_custom = true);
CREATE POLICY "Users can delete own custom exercises" ON public.exercise_library FOR DELETE USING (auth.uid() = created_by AND is_custom = true);

-- Functions for analytics and calculations
CREATE OR REPLACE FUNCTION calculate_workout_volume(workout_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    total_volume DECIMAL := 0;
BEGIN
    SELECT COALESCE(SUM(sets * reps * weight), 0)
    INTO total_volume
    FROM public.exercises
    WHERE exercises.workout_id = calculate_workout_volume.workout_id;
    
    RETURN total_volume;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update personal records
CREATE OR REPLACE FUNCTION update_personal_record(
    p_user_id UUID,
    p_exercise_library_id UUID,
    p_exercise_name TEXT,
    p_record_type TEXT,
    p_value DECIMAL,
    p_workout_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    current_record DECIMAL;
    record_updated BOOLEAN := FALSE;
BEGIN
    -- Get current record
    SELECT value INTO current_record
    FROM public.personal_records
    WHERE user_id = p_user_id 
    AND exercise_library_id = p_exercise_library_id 
    AND record_type = p_record_type;
    
    -- If no record exists or new value is better, update/insert
    IF current_record IS NULL OR p_value > current_record THEN
        INSERT INTO public.personal_records (
            user_id, exercise_library_id, exercise_name, record_type, value, workout_id
        ) VALUES (
            p_user_id, p_exercise_library_id, p_exercise_name, p_record_type, p_value, p_workout_id
        )
        ON CONFLICT (user_id, exercise_library_id, record_type)
        DO UPDATE SET
            value = p_value,
            achieved_at = NOW(),
            workout_id = p_workout_id;
        
        record_updated := TRUE;
    END IF;
    
    RETURN record_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track subscription usage
CREATE OR REPLACE FUNCTION track_subscription_usage(
    p_user_id UUID,
    p_usage_type TEXT,
    p_increment INTEGER DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
    current_month TEXT := TO_CHAR(NOW(), 'YYYY-MM');
BEGIN
    INSERT INTO public.subscription_usage (user_id, month_year)
    VALUES (p_user_id, current_month)
    ON CONFLICT (user_id, month_year) DO NOTHING;
    
    CASE p_usage_type
        WHEN 'workouts' THEN
            UPDATE public.subscription_usage
            SET workouts_logged = workouts_logged + p_increment
            WHERE user_id = p_user_id AND month_year = current_month;
        WHEN 'ai_recommendations' THEN
            UPDATE public.subscription_usage
            SET ai_recommendations_used = ai_recommendations_used + p_increment
            WHERE user_id = p_user_id AND month_year = current_month;
        WHEN 'analytics' THEN
            UPDATE public.subscription_usage
            SET analytics_queries = analytics_queries + p_increment
            WHERE user_id = p_user_id AND month_year = current_month;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
