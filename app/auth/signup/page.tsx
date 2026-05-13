import { SignupForm } from "@/features/auth/components/signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become an Educator",
  description: "Join the Aerophantom Educator Training Program and start your own robotics training business today.",
};

export default function SignupPage() {
  return <SignupForm />;
}
