-- ====================================================================
-- MIGRATION: Promote / Demote Admin Users Function & Permissions
-- ====================================================================
-- This migration creates a secure PostgreSQL function `set_user_role`
-- that allows easily promoting any user to 'admin' by their email address.
-- It can be called from SQL or anywhere with database access.

CREATE OR REPLACE FUNCTION public.set_user_role(target_email TEXT, target_role TEXT)
RETURNS VOID AS $$
BEGIN
  -- Validate role
  IF target_role NOT IN ('admin', 'user', 'trainer') THEN
    RAISE EXCEPTION 'Invalid role: %. Must be admin, user, or trainer', target_role;
  END IF;

  -- Update profiles table
  UPDATE public.profiles
  SET 
    role = target_role,
    membership = CASE WHEN target_role = 'admin' THEN 'Staff Command' ELSE membership END,
    avatar_url = CASE 
      WHEN target_role = 'admin' AND avatar_url = '/media/chris-kendall-sJ6az6-T1u8-unsplash.jpg' 
        THEN '/media/edgar-chaparro-sHfo3WOgGTU-unsplash.jpg' 
      ELSE avatar_url 
    END,
    updated_at = NOW()
  WHERE LOWER(email) = LOWER(target_email);

  -- Also update auth.users raw_user_meta_data so auth token claims carry the role
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    to_jsonb(target_role)
  )
  WHERE LOWER(email) = LOWER(target_email);

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --------------------------------------------------------------------
-- Convenience template:
-- If you want to grant admin to specific email(s), add them here:
-- SELECT public.set_user_role('admin@bravegym.com', 'admin');
-- --------------------------------------------------------------------
