-- Staff signup approval (checkbox at signup → admin approves before backoffice access)

do $$ begin
  create type public.staff_approval_status as enum ('none', 'pending', 'approved', 'rejected');
exception
  when duplicate_object then null;
end $$;

alter table public.profiles
  add column if not exists staff_signup_requested boolean not null default false;

alter table public.profiles
  add column if not exists staff_approval_status public.staff_approval_status not null default 'none';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  req boolean;
  full_name_text text;
begin
  full_name_text := coalesce(new.raw_user_meta_data ->> 'full_name', '');
  req := coalesce((new.raw_user_meta_data ->> 'staff_signup')::boolean, false);

  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    staff_signup_requested,
    staff_approval_status
  )
  values (
    new.id,
    new.email,
    full_name_text,
    'client',
    req,
    case when req then 'pending'::public.staff_approval_status else 'none'::public.staff_approval_status end
  );
  return new;
end;
$$;
