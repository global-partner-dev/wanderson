-- When a new auth user is created (Supabase invitation, email signup, etc.),
-- automatically link any pending orders that were created by webhook BEFORE
-- the account existed. This handles the ecommerce flow where Stripe pays
-- first and the user account is created afterwards by inviteUserByEmail.

create or replace function public.link_orders_to_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.orders
    set user_id = new.id
    where user_id is null
      and lower(customer_email) = lower(coalesce(new.email, ''));

  -- Mark any open invitation rows as claimed so the admin panel reflects it.
  update public.invitations
    set claimed_at = coalesce(claimed_at, now()),
        claimed_by = coalesce(claimed_by, new.id)
    where claimed_at is null
      and lower(email) = lower(coalesce(new.email, ''));

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_link_orders on auth.users;

create trigger on_auth_user_created_link_orders
  after insert on auth.users
  for each row execute function public.link_orders_to_new_user();
