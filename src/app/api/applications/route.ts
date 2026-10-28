import { NextResponse } from "next/server";

/**
 * Application submit endpoint.
 * DEMO: accepts the JSON bundle and returns a reference id.
 * LIVE: forward business + owner + DecisionLogic requestCode to LoanPro (LOS).
 * Do not log SSN/EIN/DOB in plaintext.
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const demo = process.env.DEMO_MODE !== "false";

    if (!payload?.business?.legalName || !payload?.owner?.email) {
      return NextResponse.json({ error: "Invalid application payload." }, { status: 400 });
    }

    if (!payload?.decisionLogic?.requestCode) {
      return NextResponse.json(
        { error: "DecisionLogic request code is required before submit." },
        { status: 400 },
      );
    }

    if (!payload?.consent?.accepted) {
      return NextResponse.json({ error: "Consent is required." }, { status: 400 });
    }

    if (demo) {
      const applicationId = `NWA-${Date.now().toString().slice(-7)}`;
      return NextResponse.json({
        applicationId,
        status: "received",
        mode: "demo",
        note: "Demo mode — payload accepted locally; LoanPro was not called.",
      });
    }

    // Live LoanPro adapter stub
    return NextResponse.json(
      {
        error: "LoanPro live mode is not configured yet.",
        hint: "Set DEMO_MODE=false and implement LoanPro submit with LOANPRO_* env vars.",
      },
      { status: 501 },
    );
  } catch {
    return NextResponse.json({ error: "Unable to submit application." }, { status: 500 });
  }
}
