-- =====================================================
-- ADMIN USER SETUP SQL
-- Run this in Supabase Dashboard > SQL Editor
-- =====================================================

-- NOTE: You must first create the user in:
-- Authentication > Users > Add User
-- Email: hassanoubihi@stu.cwnu.edu.cn
-- Password: cwnu2026

-- After creating the user, run this SQL to set admin role:

UPDATE public.profiles 
SET 
  role = 'admin',
  username = 'admin_hassan',
  display_name = 'Hassan Admin',
  updated_at = now()
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'hassanoubihi@stu.cwnu.edu.cn'
);

-- Verify the update
SELECT id, email, username, role, display_name 
FROM public.profiles 
WHERE email = 'hassanoubihi@stu.cwnu.edu.cn' 
   OR username = 'admin_hassan';

-- =====================================================
-- ALTERNATIVE: If you want to insert directly (not recommended)
-- =====================================================
-- First create user in Dashboard, then run:
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'USER_ID_FROM_AUTH';
