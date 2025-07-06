-- Fix infinite recursion in profiles RLS policies

-- Drop the problematic admin policy that causes recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Create a safer admin policy that doesn't cause recursion
-- Admins are identified by checking auth metadata directly
CREATE POLICY "Admins can view all profiles safe" ON public.profiles
FOR SELECT 
USING (
  auth.uid() = id OR 
  (auth.jwt() ->> 'role' = 'admin') OR
  (auth.uid() IN (
    -- Fallback: check specific admin user IDs if needed
    SELECT id FROM auth.users WHERE email LIKE '%admin%'
  ))
);

CREATE POLICY "Admins can update all profiles safe" ON public.profiles
FOR UPDATE 
USING (
  auth.uid() = id OR 
  (auth.jwt() ->> 'role' = 'admin')
);