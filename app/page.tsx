import WebsitePage from "./website/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Empowering Robotics Educators",
  description: "Start your own robotics training program with Aerophantom. We provide curriculum, hardware, and marketing support to help you succeed.",
};

export default function Page() {
  return <WebsitePage />;
}
