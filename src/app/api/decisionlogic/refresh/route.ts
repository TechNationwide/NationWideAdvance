import { NextResponse } from "next/server";
import { instantRefresh, isDecisionLogicConfigured } from "@/lib/decisionlogic/client";

/** Force-refresh transaction data for an existing Request Code. */
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
        note: "Demo InstantRefresh — no outbound call.",
      });
    }

    if (!isDecisionLogicConfigured()) {
      return NextResponse.json({ error: "DecisionLogic is not configured." }, { status: 501 });
    }

    const raw = await instantRefresh(requestCode);
    return NextResponse.json({ mode: "live", requestCode, ...raw });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to refresh DecisionLogic request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
