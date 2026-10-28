import { NextResponse } from "next/server";

/**
 * DecisionLogic start endpoint.
 * DEMO: returns a simulated request code + placeholder URL.
 * LIVE: replace with CreateAndVerifyRequest using server-side credentials.
 * Credentials must stay in environment variables — never in the browser.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const demo = process.env.DEMO_MODE !== "false";

    if (demo) {
      const requestCode = `DL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      return NextResponse.json({
        requestCode,
        url: null,
        mode: "demo",
        note: "Demo mode — no real DecisionLogic call was made.",
        received: {
          customerId: body?.customerId ? "[redacted]" : null,
          hasName: Boolean(body?.firstName || body?.lastName),
          hasEmail: Boolean(body?.email),
        },
      });
    }

    // Live adapter stub — wire CreateAndVerifyRequest here when sandbox is ready.
    return NextResponse.json(
      {
        error: "DecisionLogic live mode is not configured yet.",
        hint: "Set DEMO_MODE=false and implement CreateAndVerifyRequest with DECISIONLOGIC_* env vars.",
      },
      { status: 501 },
    );
  } catch {
    return NextResponse.json({ error: "Unable to start DecisionLogic request." }, { status: 500 });
  }
}
