import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot password - Polonia4u",
  description: "Reset your Polonia4u account password",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
