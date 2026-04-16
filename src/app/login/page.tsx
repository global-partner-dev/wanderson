import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in - Polonia4u",
  description: "Sign in to your Polonia4u account",
};

export default function LoginPage() {
  return <LoginForm />;
}
