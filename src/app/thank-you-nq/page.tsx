import type { Metadata } from "next";
import ThankYouNqPage from "@/components/ThankYouNqPage";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for your interest in Nationwide Advance.",
};

export default function ThankYouNqRoute() {
  return <ThankYouNqPage />;
}
