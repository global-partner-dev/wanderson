export type ProductCategory =
  | "citizenship"
  | "document_search"
  | "translation"
  | "transcription";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  category: ProductCategory;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  amount_brl_cents: number | null;
  currency: string;
  active: boolean;
  sort_order: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type OrderStatus = "pending" | "paid" | "failed" | "refunded";

export interface Order {
  id: string;
  user_id: string | null;
  product_id: string | null;
  category: ProductCategory;
  status: OrderStatus;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  customer_email: string;
  customer_name: string | null;
  amount_total_cents: number | null;
  currency: string;
  payment_method_types: string[] | null;
  metadata: Record<string, unknown>;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InvitationSnapshot {
  token: string;
  email: string;
  full_name: string | null;
  expires_at: string;
  claimed_at: string | null;
  order_id: string;
}

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  citizenship: "Citizenship",
  document_search: "Document search",
  translation: "Translation",
  transcription: "USC transcription",
};

export function formatBRL(cents: number | null | undefined): string {
  if (cents == null) return "R$ —";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
