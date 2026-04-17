-- E-commerce path: product catalog, orders, and invitations to claim accounts.
--
-- Direct sales flow:
--   Landing (/services) -> Stripe Checkout -> webhook (Edge Function)
--     -> insert row into orders (source of truth for paid sales)
--     -> insert row into invitations (single-use token emailed / shared)
--     -> buyer opens /invite/[token], sets password, signs in
--
-- Stripe IS the price source of truth; amount_brl_cents on products is only
-- a display cache. Webhook always takes amount_total from the Stripe session.

-- ───────────────────────────── PRODUCTS ──────────────────────────────

create type public.product_category as enum (
  'citizenship',
  'document_search',
  'translation',
  'transcription'
);

create table public.products (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  name                text not null,
  description         text,
  category            public.product_category not null,
  stripe_product_id   text,
  stripe_price_id     text,
  amount_brl_cents    integer,
  currency            text not null default 'brl',
  active              boolean not null default true,
  sort_order          integer not null default 0,
  metadata            jsonb not null default '{}'::jsonb,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index on public.products (category);
create index on public.products (active);

alter table public.products enable row level security;

-- Public (anon + authenticated) can read active products.
create policy "Public can read active products"
  on public.products for select
  to anon, authenticated
  using (active = true);

-- Admins can read every row (even inactive ones) for management.
create policy "Admins can read all products"
  on public.products for select
  to authenticated
  using (public.get_my_role() in ('admin', 'staff'));

create policy "Admins can insert products"
  on public.products for insert
  to authenticated
  with check (public.get_my_role() = 'admin');

create policy "Admins can update products"
  on public.products for update
  to authenticated
  using (public.get_my_role() = 'admin')
  with check (public.get_my_role() = 'admin');

create policy "Admins can delete products"
  on public.products for delete
  to authenticated
  using (public.get_my_role() = 'admin');

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.update_updated_at();

-- ───────────────────────────── ORDERS ────────────────────────────────

create type public.order_status as enum (
  'pending',   -- checkout session created, not paid yet
  'paid',      -- checkout.session.completed received
  'failed',    -- async_payment_failed
  'refunded'
);

create table public.orders (
  id                            uuid primary key default gen_random_uuid(),
  user_id                       uuid references public.profiles(id) on delete set null,
  product_id                    uuid references public.products(id) on delete set null,
  category                      public.product_category not null,
  status                        public.order_status not null default 'pending',
  stripe_checkout_session_id    text unique,
  stripe_payment_intent_id      text,
  stripe_customer_id            text,
  customer_email                text not null,
  customer_name                 text,
  amount_total_cents            integer,
  currency                      text not null default 'brl',
  payment_method_types          text[],
  metadata                      jsonb not null default '{}'::jsonb,
  paid_at                       timestamptz,
  created_at                    timestamptz not null default now(),
  updated_at                    timestamptz not null default now()
);

create index on public.orders (user_id);
create index on public.orders (customer_email);
create index on public.orders (status);
create index on public.orders (category);

alter table public.orders enable row level security;

-- A client can read only their own linked orders.
create policy "Clients can read own orders"
  on public.orders for select
  to authenticated
  using (user_id = auth.uid());

-- Admin and staff can read all orders for finance/CRM views.
create policy "Admin and staff can read all orders"
  on public.orders for select
  to authenticated
  using (public.get_my_role() in ('admin', 'staff'));

-- No one writes through PostgREST by default. The Stripe webhook writes
-- via the service_role client inside the Edge Function, which bypasses RLS.
-- Admins may manually update linkage (e.g. attach user_id):
create policy "Admins can update orders"
  on public.orders for update
  to authenticated
  using (public.get_my_role() = 'admin')
  with check (public.get_my_role() = 'admin');

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.update_updated_at();

-- ─────────────────────────── INVITATIONS ────────────────────────────
--
-- Buyers pay first; accounts are created after payment via a single-use
-- token. We expose validation through a SECURITY DEFINER function so anon
-- users can check a token without table-wide SELECT privileges.

create table public.invitations (
  id            uuid primary key default gen_random_uuid(),
  token         text not null unique,
  order_id      uuid not null references public.orders(id) on delete cascade,
  email         text not null,
  full_name     text,
  expires_at    timestamptz not null,
  claimed_at    timestamptz,
  claimed_by    uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index on public.invitations (email);
create index on public.invitations (order_id);

alter table public.invitations enable row level security;

-- Admins can inspect invitations; clients do not read this table directly.
create policy "Admins can read all invitations"
  on public.invitations for select
  to authenticated
  using (public.get_my_role() in ('admin', 'staff'));

create policy "Admins can delete invitations"
  on public.invitations for delete
  to authenticated
  using (public.get_my_role() = 'admin');

-- Public lookup by token (read-only snapshot for the claim screen).
-- Returned columns exclude secrets and only reveal what the claimant needs.
create or replace function public.get_invitation_by_token(p_token text)
returns table (
  token       text,
  email       text,
  full_name   text,
  expires_at  timestamptz,
  claimed_at  timestamptz,
  order_id    uuid
)
language sql
stable
security definer
set search_path = ''
as $$
  select token, email, full_name, expires_at, claimed_at, order_id
    from public.invitations
    where token = p_token
    limit 1;
$$;

grant execute on function public.get_invitation_by_token(text) to anon, authenticated;

-- After a buyer successfully signs up and is signed in, the Next.js server
-- action calls this to mark the invitation claimed and link order.user_id.
-- It runs as the signed-in user; it will refuse if the email doesn't match.
create or replace function public.claim_invitation(p_token text)
returns table (
  order_id uuid,
  product_id uuid
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_invite public.invitations;
  v_auth_email text;
  v_auth_uid uuid;
begin
  v_auth_uid := auth.uid();
  if v_auth_uid is null then
    raise exception 'not authenticated';
  end if;

  select email into v_auth_email from auth.users where id = v_auth_uid;

  select * into v_invite from public.invitations where token = p_token limit 1;
  if not found then
    raise exception 'invitation not found';
  end if;
  if v_invite.claimed_at is not null then
    raise exception 'invitation already claimed';
  end if;
  if v_invite.expires_at < now() then
    raise exception 'invitation expired';
  end if;
  if lower(v_invite.email) <> lower(coalesce(v_auth_email, '')) then
    raise exception 'email mismatch';
  end if;

  update public.invitations
    set claimed_at = now(), claimed_by = v_auth_uid
    where id = v_invite.id;

  update public.orders
    set user_id = v_auth_uid
    where id = v_invite.order_id;

  return query
    select v_invite.order_id, o.product_id from public.orders o where o.id = v_invite.order_id;
end;
$$;

grant execute on function public.claim_invitation(text) to authenticated;

-- ───────────────────────── SEED CATALOG ─────────────────────────────
-- One real standalone SKU matching the existing single Stripe product the
-- team already created in test mode. Additional services can be inserted
-- later by admins through the UI.

insert into public.products (
  slug,
  name,
  description,
  category,
  stripe_product_id,
  amount_brl_cents,
  sort_order,
  active
)
values (
  'sworn-translation',
  'Sworn translation',
  'Official sworn translation of a single document into Portuguese by an accredited translator.',
  'translation',
  'prod_ULz0EA7Rf4IzD6',
  100000,
  10,
  true
)
on conflict (slug) do nothing;
