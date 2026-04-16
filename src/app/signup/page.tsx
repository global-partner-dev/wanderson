import type { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign up - Polonia4u",
  description: "Create your Polonia4u account",
};

export default function SignupPage() {
  return <SignupForm />;
}
