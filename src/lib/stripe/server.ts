import "server-only";
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured. Set it in .env to enable Stripe Checkout.",
    );
  }

  _stripe = new Stripe(secret, {
    apiVersion: "2026-03-25.dahlia",
    typescript: true,
    appInfo: { name: "polonia4u-saas", version: "0.1.0" },
  });
  return _stripe;
}
