import { NextResponse } from "next/server";
import {
  createAndVerifyRequest,
  isDecisionLogicConfigured,
} from "@/lib/decisionlogic/client";

/**
 * Starts a DecisionLogic Instant Account Verification request.
 * DEMO_MODE=true → simulated request code (no outbound call).
 * DEMO_MODE=false → live CreateAndVerifyRequest (requires env + IP whitelist).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const demo = process.env.DEMO_MODE !== "false";

    if (demo) {
      const requestCode = Math.random().toString(36).slice(2, 8).toUpperCase();
      return NextResponse.json({
        requestCode,
        mode: "demo",
        widgetMode: "LIVE",
        note: "Demo mode — no real DecisionLogic call was made. Set DEMO_MODE=false for live.",
        received: {
          customerId: body?.customerId ? "[present]" : null,
          hasName: Boolean(body?.firstName || body?.lastName),
          hasEmail: Boolean(body?.email),
        },
      });
    }

    if (!isDecisionLogicConfigured()) {
      return NextResponse.json(
        {
          error: "DecisionLogic is not configured.",
          hint: "Set DECISIONLOGIC_SERVICE_KEY, DECISIONLOGIC_SITE_USER_GUID, and DECISIONLOGIC_PROFILE_GUID.",
        },
        { status: 501 },
      );
    }

    const result = await createAndVerifyRequest({
      customerId: body?.customerId,
      firstName: body?.firstName,
      lastName: body?.lastName,
      email: body?.email,
      phone: body?.phone,
      ssn: body?.ssn,
      dob: body?.dob,
      street: body?.street,
      city: body?.city,
      state: body?.state,
      zip: body?.zip,
      preferMatch: body?.preferMatch !== false,
    });

    return NextResponse.json({
      requestCode: result.requestCode,
      matchType: result.matchType,
      mode: "live",
      widgetMode: "LIVE",
      trackingId: result.raw.trackingId,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unable to start DecisionLogic request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
