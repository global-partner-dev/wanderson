-- Fix: self-referencing RLS policies on profiles cause infinite recursion (500 errors).
-- Solution: use a SECURITY DEFINER helper function to read the current user's role
-- without triggering RLS, then use that function in policies.

create or replace function public.get_my_role()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select role::text from public.profiles where id = auth.uid();
$$;

-- Drop the broken self-referencing policies
drop policy if exists "Admin and staff can read all profiles" on public.profiles;
drop policy if exists "Admins can update any profile" on public.profiles;

-- Recreate without self-referencing subqueries
create policy "Admin and staff can read all profiles"
  on public.profiles for select
  using (public.get_my_role() in ('admin', 'staff'));

create policy "Admins can update any profile"
  on public.profiles for update
  using (public.get_my_role() = 'admin');
