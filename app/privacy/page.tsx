import PrivacyClient from "./privacy-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Learn how Aerophantom collects, uses, and protects your personal information and student data.",
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
