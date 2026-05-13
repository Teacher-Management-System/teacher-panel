import Inquiry from "@/features/inquiry/components/inquery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inquiry",
  description: "Have questions about starting your robotics training program? Contact us today to learn more.",
};

export default function InquiryPage() {
  return <Inquiry />;
}
