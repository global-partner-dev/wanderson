# stripe-webhook (Supabase Edge Function)

Receives Stripe webhook events, verifies the signature, persists orders,
and issues a single-use invitation token so buyers can claim an account.

## Setup

```bash
# 1. Login + link the project once (run at repo root)
supabase login
supabase link --project-ref <your-project-ref>

# 2. Push the database migrations (products / orders / invitations + RLS)
supabase db push

# 3. Configure secrets used by the function
supabase secrets set STRIPE_SECRET_KEY=sk_test_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
supabase secrets set SITE_URL=http://localhost:3000

# SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically
# inside the Edge Functions runtime; you do not need to set them.

# 4. Deploy
supabase functions deploy stripe-webhook --no-verify-jwt
```

The deployed URL will be

```
https://<project-ref>.functions.supabase.co/stripe-webhook
```

Add it as a webhook endpoint in the Stripe Dashboard with these events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `checkout.session.async_payment_failed`

Copy the generated signing secret into `STRIPE_WEBHOOK_SECRET`.

## Local testing

```bash
supabase functions serve stripe-webhook --no-verify-jwt --env-file ./.env
stripe listen --forward-to http://127.0.0.1:54321/functions/v1/stripe-webhook
```

The CLI will print a temporary `whsec_...` — set it as `STRIPE_WEBHOOK_SECRET`
in the `.env` file that `supabase functions serve` reads.
