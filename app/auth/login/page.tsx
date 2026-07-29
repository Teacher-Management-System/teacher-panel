import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inquiry",
  description: "Inquire for Aerophantom educator training program.",
};

export default function LoginPage() {
  // Login route is disabled; redirecting to inquiry form
  redirect("/inquiry");

  /*
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
  */
}
