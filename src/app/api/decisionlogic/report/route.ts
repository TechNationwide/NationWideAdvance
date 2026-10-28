import { NextResponse } from "next/server";
import {
  getReportDetailsFromRequestCode,
  isDecisionLogicConfigured,
} from "@/lib/decisionlogic/client";

/** Pull bank report for a completed DecisionLogic Request Code. */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const requestCode = String(body?.requestCode || "").trim();
    if (!requestCode) {
      return NextResponse.json({ error: "requestCode is required." }, { status: 400 });
    }

    const demo = process.env.DEMO_MODE !== "false";
    if (demo) {
      return NextResponse.json({
        mode: "demo",
        requestCode,
        data: {
          note: "Demo report placeholder — live mode calls GetReportDetailsFromRequestCode.",
          isVerified: true,
        },
      });
    }

    if (!isDecisionLogicConfigured()) {
      return NextResponse.json({ error: "DecisionLogic is not configured." }, { status: 501 });
    }

    const raw = await getReportDetailsFromRequestCode(requestCode);
    return NextResponse.json({ mode: "live", requestCode, ...raw });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to fetch DecisionLogic report.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
