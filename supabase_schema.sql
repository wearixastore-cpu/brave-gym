-- ==========================================================
-- BRAVE GYM — SUPABASE PRODUCTION DATABASE & STORAGE SCHEMA
-- ==========================================================
-- Run this script in your Supabase SQL Editor (1-click run)
-- It provisions:
-- 1. Profiles (linked to auth.users)
-- 2. Classes & Timetable Schedule
-- 3. Member Bookings
-- 4. Workout Progress Logs
-- 5. Athlete Intake Consultation Requests
-- 6. Notifications with Realtime
-- 7. Transactions & Membership Tiers
-- 8. Storage Buckets (avatars, gym-media) with public read access
-- 9. Row Level Security (RLS) policies
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------
-- 1. PROFILES TABLE (Mirrors & extends auth.users)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'trainer')),
  membership TEXT DEFAULT 'Brave Trial',
  status TEXT DEFAULT 'Active',
  renewal_date TEXT DEFAULT '30 Days Free',
  streak INT DEFAULT 1,
  sessions_this_month INT DEFAULT 0,
  avatar_url TEXT DEFAULT '/media/chris-kendall-sJ6az6-T1u8-unsplash.jpg',
  bio TEXT,
  phone TEXT,
  weight_class TEXT,
  discipline TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to automatically create a profile record when a new user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, membership, status, streak, sessions_this_month, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    CASE WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 'Staff Command' ELSE 'Brave Trial' END,
    'Active',
    CASE WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 42 ELSE 1 END,
    CASE WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN 24 ELSE 0 END,
    CASE 
      WHEN NEW.raw_user_meta_data->>'role' = 'admin' THEN '/media/edgar-chaparro-sHfo3WOgGTU-unsplash.jpg'
      ELSE '/media/chris-kendall-sJ6az6-T1u8-unsplash.jpg'
    END
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      name = COALESCE(EXCLUDED.name, public.profiles.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------
-- 2. CLASSES & SCHEDULE TIMETABLE TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classes (
  id TEXT PRIMARY KEY DEFAULT ('sc-' || floor(extract(epoch from now()))::text || '-' || substr(md5(random()::text), 1, 4)),
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  class_title TEXT NOT NULL,
  trainer TEXT NOT NULL,
  spots_left INT NOT NULL DEFAULT 16,
  total INT NOT NULL DEFAULT 16,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial schedule if empty
INSERT INTO public.classes (id, day, time, class_title, trainer, spots_left, total)
VALUES
  ('sc-1', 'Monday', '06:30 AM', 'Metabolic Warfare', 'Jaxson Cole', 3, 20),
  ('sc-2', 'Monday', '08:00 AM', 'Championship Boxing', 'Marcus Vance', 2, 16),
  ('sc-3', 'Monday', '05:30 PM', 'Iron Discipline Strength', 'Elena Rostova', 1, 12),
  ('sc-4', 'Tuesday', '07:00 AM', 'Championship Boxing', 'Marcus Vance', 5, 16),
  ('sc-5', 'Tuesday', '06:00 PM', 'Kinetic Reset & Ice Protocol', 'Dr. Maya Lin', 2, 8),
  ('sc-6', 'Wednesday', '06:30 AM', 'Iron Discipline Strength', 'Elena Rostova', 4, 12),
  ('sc-7', 'Wednesday', '05:30 PM', 'Metabolic Warfare', 'Jaxson Cole', 0, 20),
  ('sc-8', 'Thursday', '07:00 AM', 'Championship Boxing', 'Marcus Vance', 3, 16),
  ('sc-9', 'Friday', '05:30 PM', 'Friday Night Sparring & Conditioning', 'Marcus Vance', 6, 16),
  ('sc-10', 'Saturday', '09:00 AM', 'Brave Community Combine', 'All Coaches', 8, 30)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------
-- 3. MEMBER BOOKINGS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY DEFAULT ('bk-' || floor(extract(epoch from now()))::text || '-' || substr(md5(random()::text), 1, 4)),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_title TEXT NOT NULL,
  trainer TEXT NOT NULL,
  date TEXT NOT NULL,
  room TEXT DEFAULT 'Main Athletic Floor',
  status TEXT DEFAULT 'Confirmed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------
-- 4. WORKOUT LOGS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id TEXT PRIMARY KEY DEFAULT ('log-' || floor(extract(epoch from now()))::text || '-' || substr(md5(random()::text), 1, 4)),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  exercise TEXT NOT NULL,
  weight TEXT NOT NULL,
  notes TEXT,
  date TEXT DEFAULT 'Today',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------
-- 5. CONSULTATION INTAKE REQUESTS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consultations (
  id TEXT PRIMARY KEY DEFAULT ('req-' || floor(extract(epoch from now()))::text || '-' || substr(md5(random()::text), 1, 4)),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  trainer_id TEXT,
  trainer_name TEXT NOT NULL,
  user_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  service_type TEXT NOT NULL,
  custom_requirements TEXT,
  chat_messages JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Contacted', 'Approved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------
-- 6. NOTIFICATIONS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY DEFAULT ('notif-' || floor(extract(epoch from now()))::text || '-' || substr(md5(random()::text), 1, 4)),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'system',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------
-- 7. TRANSACTIONS & MEMBERSHIPS TABLE
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id TEXT PRIMARY KEY DEFAULT ('tx-' || floor(extract(epoch from now()))::text || '-' || substr(md5(random()::text), 1, 4)),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  member TEXT NOT NULL,
  plan TEXT NOT NULL,
  amount TEXT NOT NULL,
  status TEXT DEFAULT 'Paid',
  date TEXT DEFAULT 'Today',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are readable by authenticated users" 
ON public.profiles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Classes policies: Anyone can view schedule, authenticated/admin can insert/update/delete
CREATE POLICY "Anyone can view timetable classes" 
ON public.classes FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Authenticated users can manage classes" 
ON public.classes FOR ALL TO authenticated USING (true);

-- Bookings policies: Users see their own bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their bookings" 
ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own bookings" 
ON public.bookings FOR DELETE TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);

-- Workout logs policies: Users manage their own logs
CREATE POLICY "Users can manage workout logs" 
ON public.workout_logs FOR ALL TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);

-- Consultations policies: Anyone can create a consultation request (leads)
CREATE POLICY "Anyone can submit a consultation request" 
ON public.consultations FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can view/manage consultations" 
ON public.consultations FOR ALL TO authenticated USING (true);

-- Notifications policies: Users manage their notifications
CREATE POLICY "Users can view and update their notifications" 
ON public.notifications FOR ALL TO authenticated USING (auth.uid() = user_id OR user_id IS NULL);

-- Transactions: Readable by authenticated users (Admin telemetry)
CREATE POLICY "Transactions viewable by authenticated users" 
ON public.transactions FOR ALL TO authenticated USING (true);

-- ----------------------------------------------------------
-- 9. STORAGE BUCKET CREATION (Supabase Storage)
-- ----------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('gym-media', 'gym-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage policies: Anyone can read avatar images
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

-- Authenticated users can upload avatars
CREATE POLICY "Authenticated users can upload avatars" 
ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can update their avatars" 
ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'avatars');

-- Enable Realtime for notifications and consultations
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.consultations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.classes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
