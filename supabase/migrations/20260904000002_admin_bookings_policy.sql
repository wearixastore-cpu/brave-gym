-- Migration to allow Admins to view and manage all bookings and view profiles
-- Drop prior restrictive policies if any

DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
CREATE POLICY "Users can view their own bookings or admins view all" 
ON public.bookings FOR SELECT TO authenticated 
USING (
  auth.uid() = user_id 
  OR user_id IS NULL
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Allow authenticated users or admins to insert bookings
DROP POLICY IF EXISTS "Users can create their bookings" ON public.bookings;
CREATE POLICY "Users can create their bookings" 
ON public.bookings FOR INSERT TO authenticated 
WITH CHECK (
  auth.uid() = user_id 
  OR user_id IS NULL
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Allow deletion of bookings by owner or admin
DROP POLICY IF EXISTS "Users can delete their own bookings" ON public.bookings;
CREATE POLICY "Users or admins can delete bookings" 
ON public.bookings FOR DELETE TO authenticated 
USING (
  auth.uid() = user_id 
  OR user_id IS NULL
  OR EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Add user_name or email reference directly to bookings table if not present for instant display
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS user_name TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS user_email TEXT;
