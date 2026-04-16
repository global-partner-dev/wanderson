import type { Metadata } from "next";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Set new password - Polonia4u",
  description: "Choose a new password for your Polonia4u account",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
