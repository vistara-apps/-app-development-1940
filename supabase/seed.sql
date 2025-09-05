-- FitFlow AI Seed Data
-- Populate the database with initial exercise library and sample data

-- Insert exercise library data
INSERT INTO public.exercise_library (name, category, type, muscle_groups, equipment, instructions, tips, difficulty_level, is_custom) VALUES
-- Chest exercises
('Bench Press', 'chest', 'strength', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['barbell', 'bench'], 'Lie on bench, grip bar slightly wider than shoulders, lower to chest, press up', 'Keep feet flat on floor, maintain arch in back', 3, false),
('Incline Dumbbell Press', 'chest', 'strength', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['dumbbells', 'incline bench'], 'Set bench to 30-45 degrees, press dumbbells from chest level', 'Control the weight, squeeze chest at top', 3, false),
('Push-ups', 'chest', 'strength', ARRAY['chest', 'triceps', 'shoulders', 'core'], ARRAY['bodyweight'], 'Start in plank position, lower chest to ground, push back up', 'Keep body straight, engage core', 2, false),
('Dumbbell Flyes', 'chest', 'strength', ARRAY['chest'], ARRAY['dumbbells', 'bench'], 'Lie on bench, arms wide, bring dumbbells together above chest', 'Slight bend in elbows, feel stretch in chest', 3, false),
('Dips', 'chest', 'strength', ARRAY['chest', 'triceps', 'shoulders'], ARRAY['dip bars'], 'Support body on bars, lower until shoulders below elbows, push up', 'Lean forward for chest emphasis', 4, false),

-- Back exercises
('Deadlift', 'back', 'strength', ARRAY['back', 'glutes', 'hamstrings', 'traps'], ARRAY['barbell'], 'Stand with bar over mid-foot, grip bar, lift by extending hips and knees', 'Keep bar close to body, neutral spine', 4, false),
('Pull-ups', 'back', 'strength', ARRAY['back', 'biceps'], ARRAY['pull-up bar'], 'Hang from bar, pull body up until chin over bar', 'Full range of motion, control descent', 4, false),
('Bent-over Row', 'back', 'strength', ARRAY['back', 'biceps'], ARRAY['barbell'], 'Hinge at hips, row bar to lower chest', 'Keep back straight, squeeze shoulder blades', 3, false),
('Lat Pulldown', 'back', 'strength', ARRAY['back', 'biceps'], ARRAY['cable machine'], 'Sit at machine, pull bar to upper chest', 'Lean back slightly, focus on lats', 2, false),
('Seated Cable Row', 'back', 'strength', ARRAY['back', 'biceps'], ARRAY['cable machine'], 'Sit upright, pull handle to torso', 'Squeeze shoulder blades together', 2, false),

-- Leg exercises
('Squat', 'legs', 'strength', ARRAY['quadriceps', 'glutes', 'hamstrings'], ARRAY['barbell'], 'Stand with bar on upper back, squat down until thighs parallel', 'Keep knees in line with toes, chest up', 3, false),
('Leg Press', 'legs', 'strength', ARRAY['quadriceps', 'glutes'], ARRAY['leg press machine'], 'Sit in machine, press weight with legs', 'Full range of motion, control the weight', 2, false),
('Romanian Deadlift', 'legs', 'strength', ARRAY['hamstrings', 'glutes'], ARRAY['barbell'], 'Hold bar, hinge at hips, lower bar along legs', 'Feel stretch in hamstrings, keep back straight', 3, false),
('Leg Curls', 'legs', 'strength', ARRAY['hamstrings'], ARRAY['leg curl machine'], 'Lie prone, curl heels toward glutes', 'Squeeze hamstrings at top', 2, false),
('Calf Raises', 'legs', 'strength', ARRAY['calves'], ARRAY['bodyweight'], 'Rise up on toes, lower slowly', 'Full range of motion, pause at top', 1, false),
('Lunges', 'legs', 'strength', ARRAY['quadriceps', 'glutes'], ARRAY['bodyweight'], 'Step forward, lower back knee toward ground', 'Keep front knee over ankle', 2, false),

-- Shoulder exercises
('Overhead Press', 'shoulders', 'strength', ARRAY['shoulders', 'triceps'], ARRAY['barbell'], 'Press bar from shoulders overhead', 'Keep core tight, press straight up', 3, false),
('Lateral Raises', 'shoulders', 'strength', ARRAY['shoulders'], ARRAY['dumbbells'], 'Raise arms to sides until parallel to ground', 'Control the movement, slight bend in elbows', 2, false),
('Rear Delt Flyes', 'shoulders', 'strength', ARRAY['shoulders'], ARRAY['dumbbells'], 'Bend forward, raise arms to sides', 'Squeeze shoulder blades, control weight', 2, false),
('Face Pulls', 'shoulders', 'strength', ARRAY['shoulders', 'upper back'], ARRAY['cable machine'], 'Pull rope to face level, elbows high', 'Focus on rear delts and rhomboids', 2, false),

-- Arm exercises
('Bicep Curls', 'arms', 'strength', ARRAY['biceps'], ARRAY['dumbbells'], 'Curl weights toward shoulders', 'Keep elbows at sides, control descent', 2, false),
('Tricep Dips', 'arms', 'strength', ARRAY['triceps'], ARRAY['bench'], 'Support on bench, lower body, push back up', 'Keep elbows close to body', 3, false),
('Hammer Curls', 'arms', 'strength', ARRAY['biceps', 'forearms'], ARRAY['dumbbells'], 'Curl with neutral grip', 'Keep wrists straight, control movement', 2, false),
('Tricep Extensions', 'arms', 'strength', ARRAY['triceps'], ARRAY['dumbbells'], 'Extend weight overhead', 'Keep elbows stationary', 2, false),

-- Core exercises
('Plank', 'core', 'strength', ARRAY['core'], ARRAY['bodyweight'], 'Hold push-up position', 'Keep body straight, breathe normally', 2, false),
('Crunches', 'core', 'strength', ARRAY['abs'], ARRAY['bodyweight'], 'Lie on back, curl shoulders toward knees', 'Focus on abs, don''t pull on neck', 1, false),
('Russian Twists', 'core', 'strength', ARRAY['obliques'], ARRAY['bodyweight'], 'Sit with knees bent, rotate torso side to side', 'Keep chest up, engage core', 2, false),
('Dead Bug', 'core', 'strength', ARRAY['core'], ARRAY['bodyweight'], 'Lie on back, extend opposite arm and leg', 'Keep lower back pressed to floor', 2, false),
('Mountain Climbers', 'core', 'strength', ARRAY['core', 'shoulders'], ARRAY['bodyweight'], 'In plank position, alternate bringing knees to chest', 'Keep hips level, maintain plank', 3, false),

-- Cardio exercises
('Running', 'cardio', 'cardio', ARRAY['legs', 'cardiovascular'], ARRAY['treadmill'], 'Maintain steady pace', 'Start slow, build endurance gradually', 2, false),
('Cycling', 'cardio', 'cardio', ARRAY['legs', 'cardiovascular'], ARRAY['bike'], 'Pedal at consistent cadence', 'Adjust resistance for intensity', 2, false),
('Rowing', 'cardio', 'cardio', ARRAY['back', 'legs', 'cardiovascular'], ARRAY['rowing machine'], 'Pull handle to chest, extend legs', 'Drive with legs, finish with arms', 3, false),
('Burpees', 'cardio', 'plyometric', ARRAY['full body'], ARRAY['bodyweight'], 'Squat, jump back to plank, jump forward, jump up', 'Maintain form even when tired', 4, false),
('Jump Rope', 'cardio', 'cardio', ARRAY['calves', 'cardiovascular'], ARRAY['jump rope'], 'Jump over rope with both feet', 'Stay on balls of feet, light bounces', 2, false);

-- Insert sample user preferences (these will be created when users sign up)
-- This is just for reference - actual user preferences are created via triggers

-- Insert sample workout templates
-- These would be created by users or admins, but here are some examples
INSERT INTO public.workout_templates (user_id, name, description, category, is_public, exercises, estimated_duration, difficulty_level, tags) VALUES
-- Note: user_id would need to be a real UUID from auth.users in production
-- For now, these are placeholder templates that would be created by an admin user

-- Sample public templates (would need real user_id in production)
-- ('00000000-0000-0000-0000-000000000000', 'Push Day', 'Chest, shoulders, and triceps workout', 'strength', true, 
--  '[
--    {"exercise_name": "Bench Press", "sets": 4, "reps": 8, "rest_time": 180},
--    {"exercise_name": "Incline Dumbbell Press", "sets": 3, "reps": 10, "rest_time": 120},
--    {"exercise_name": "Lateral Raises", "sets": 3, "reps": 12, "rest_time": 90},
--    {"exercise_name": "Tricep Dips", "sets": 3, "reps": 10, "rest_time": 90}
--  ]'::jsonb, 60, 3, ARRAY['push', 'upper body', 'strength']),

-- ('00000000-0000-0000-0000-000000000000', 'Pull Day', 'Back and biceps workout', 'strength', true,
--  '[
--    {"exercise_name": "Deadlift", "sets": 4, "reps": 6, "rest_time": 180},
--    {"exercise_name": "Pull-ups", "sets": 3, "reps": 8, "rest_time": 120},
--    {"exercise_name": "Bent-over Row", "sets": 3, "reps": 10, "rest_time": 120},
--    {"exercise_name": "Bicep Curls", "sets": 3, "reps": 12, "rest_time": 90}
--  ]'::jsonb, 60, 3, ARRAY['pull', 'upper body', 'strength']),

-- ('00000000-0000-0000-0000-000000000000', 'Leg Day', 'Complete lower body workout', 'strength', true,
--  '[
--    {"exercise_name": "Squat", "sets": 4, "reps": 8, "rest_time": 180},
--    {"exercise_name": "Romanian Deadlift", "sets": 3, "reps": 10, "rest_time": 120},
--    {"exercise_name": "Leg Press", "sets": 3, "reps": 12, "rest_time": 120},
--    {"exercise_name": "Leg Curls", "sets": 3, "reps": 12, "rest_time": 90},
--    {"exercise_name": "Calf Raises", "sets": 4, "reps": 15, "rest_time": 60}
--  ]'::jsonb, 75, 4, ARRAY['legs', 'lower body', 'strength']);

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user profile
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Insert default user preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create a function to clean up expired analytics cache
CREATE OR REPLACE FUNCTION cleanup_expired_analytics_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.analytics_cache
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to calculate and cache analytics
CREATE OR REPLACE FUNCTION calculate_user_analytics(
  p_user_id UUID,
  p_metric_type TEXT,
  p_time_period TEXT
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  cache_duration INTERVAL;
BEGIN
  -- Set cache duration based on time period
  CASE p_time_period
    WHEN 'week' THEN cache_duration := INTERVAL '1 hour';
    WHEN 'month' THEN cache_duration := INTERVAL '6 hours';
    WHEN 'quarter' THEN cache_duration := INTERVAL '12 hours';
    WHEN 'year' THEN cache_duration := INTERVAL '24 hours';
    ELSE cache_duration := INTERVAL '1 hour';
  END CASE;

  -- Check if cached data exists and is not expired
  SELECT data INTO result
  FROM public.analytics_cache
  WHERE user_id = p_user_id
    AND metric_type = p_metric_type
    AND time_period = p_time_period
    AND expires_at > NOW();

  -- If no cached data, calculate and cache
  IF result IS NULL THEN
    -- Calculate based on metric type
    CASE p_metric_type
      WHEN 'workout_frequency' THEN
        SELECT jsonb_build_object(
          'total_workouts', COUNT(*),
          'avg_per_week', ROUND(COUNT(*)::DECIMAL / GREATEST(EXTRACT(DAYS FROM (MAX(created_at) - MIN(created_at))) / 7, 1), 2),
          'current_streak', 0 -- Would need more complex calculation
        ) INTO result
        FROM public.workouts
        WHERE user_id = p_user_id
          AND status = 'completed'
          AND created_at >= CASE
            WHEN p_time_period = 'week' THEN NOW() - INTERVAL '7 days'
            WHEN p_time_period = 'month' THEN NOW() - INTERVAL '30 days'
            WHEN p_time_period = 'quarter' THEN NOW() - INTERVAL '90 days'
            WHEN p_time_period = 'year' THEN NOW() - INTERVAL '365 days'
            ELSE NOW() - INTERVAL '30 days'
          END;

      WHEN 'strength_progress' THEN
        SELECT jsonb_agg(
          jsonb_build_object(
            'exercise_name', exercise_name,
            'max_weight', MAX(weight),
            'total_volume', SUM(sets * reps * weight),
            'avg_weight', ROUND(AVG(weight), 2)
          )
        ) INTO result
        FROM public.exercises e
        JOIN public.workouts w ON e.workout_id = w.id
        WHERE w.user_id = p_user_id
          AND w.status = 'completed'
          AND w.created_at >= CASE
            WHEN p_time_period = 'week' THEN NOW() - INTERVAL '7 days'
            WHEN p_time_period = 'month' THEN NOW() - INTERVAL '30 days'
            WHEN p_time_period = 'quarter' THEN NOW() - INTERVAL '90 days'
            WHEN p_time_period = 'year' THEN NOW() - INTERVAL '365 days'
            ELSE NOW() - INTERVAL '30 days'
          END
        GROUP BY exercise_name;

      ELSE
        result := '{}'::jsonb;
    END CASE;

    -- Cache the result
    INSERT INTO public.analytics_cache (user_id, metric_type, time_period, data, expires_at)
    VALUES (p_user_id, p_metric_type, p_time_period, result, NOW() + cache_duration)
    ON CONFLICT (user_id, metric_type, time_period)
    DO UPDATE SET
      data = result,
      calculated_at = NOW(),
      expires_at = NOW() + cache_duration;
  END IF;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert some sample recommendations types for reference
-- These would be generated by the AI system in production
-- INSERT INTO public.recommendations (user_id, type, priority, title, description, action, expected_outcome, metadata)
-- VALUES 
-- ('00000000-0000-0000-0000-000000000000', 'strength', 'high', 'Progressive Overload Opportunity', 
--  'Your bench press has plateaued at 185 lbs for 2 weeks. Consider increasing weight by 5-10 lbs or adding an extra set.',
--  'Increase bench press to 190-195 lbs next session',
--  'Continued strength gains and muscle growth',
--  '{"ai_confidence": 0.85, "data_points": 6}'::jsonb);

-- Create indexes for better performance on common queries
CREATE INDEX IF NOT EXISTS idx_workouts_user_status_date ON public.workouts(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exercises_workout_exercise ON public.exercises(workout_id, exercise_name);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_unread ON public.recommendations(user_id, is_read, generated_at DESC);

-- Grant necessary permissions
-- Note: In production, you might want more restrictive permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Allow anon users to read exercise library (for app functionality before login)
GRANT SELECT ON public.exercise_library TO anon;
