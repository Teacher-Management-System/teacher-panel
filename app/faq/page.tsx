import FAQClient from "./faq-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Find answers to common questions about the Aerophantom Educator Training Program, curriculum, robotics hardware, and support.",
};

export default function FAQPage() {
  return <FAQClient />;
}
