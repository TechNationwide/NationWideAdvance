import type { Metadata } from "next";
import { Suspense } from "react";
import ThankYouNqPage from "@/components/ThankYouNqPage";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for your interest in Nationwide Advance.",
};

export default function ThankYouNqRoute() {
  return (
    <Suspense fallback={<div className="page-loading">Loading…</div>}>
      <ThankYouNqPage />
    </Suspense>
  );
}
