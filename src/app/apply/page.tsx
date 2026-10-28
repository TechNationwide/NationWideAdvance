import { Suspense } from "react";
import ApplyPage from "@/components/ApplyPage";

export default function ApplyRoute() {
  return (
    <Suspense fallback={<div className="page-loading">Loading application…</div>}>
      <ApplyPage />
    </Suspense>
  );
}
