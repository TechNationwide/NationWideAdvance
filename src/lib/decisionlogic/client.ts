import type {
  CreateAndVerifyRequestBody,
  DecisionLogicEnvelope,
  StartVerificationInput,
} from "./types";

function requiredEnv(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing environment variable: ${name}`);
  return v;
}

function baseUrl(): string {
  return (
    process.env.DECISIONLOGIC_BASE_URL?.replace(/\/$/, "") ||
    "https://integration.decisionlogic.com/restful/v1"
  );
}

async function dlPost<T>(path: string, body: unknown): Promise<DecisionLogicEnvelope<T>> {
  const url = `${baseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await res.text();
  let json: DecisionLogicEnvelope<T> | null = null;
  try {
    json = text ? (JSON.parse(text) as DecisionLogicEnvelope<T>) : null;
  } catch {
    throw new Error(`DecisionLogic ${path} returned non-JSON (${res.status}): ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    throw new Error(
      json?.errorMessage || `DecisionLogic ${path} failed with HTTP ${res.status}`,
    );
  }

  if (json?.isError) {
    throw new Error(json.errorMessage || `DecisionLogic ${path} returned isError=true`);
  }

  return json || {};
}

function parseDob(dob?: string): { day?: number; month?: number; year?: number } {
  if (!dob) return {};
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  if (!m) return {};
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}

/**
 * Create a DecisionLogic Instant Account Verification request.
 * Returns the Request Code string used by the widget UI.
 */
export async function createAndVerifyRequest(
  input: StartVerificationInput,
): Promise<{ requestCode: string; matchType: number; raw: DecisionLogicEnvelope<string> }> {
  const serviceKey = requiredEnv("DECISIONLOGIC_SERVICE_KEY");
  const siteUserGuid = requiredEnv("DECISIONLOGIC_SITE_USER_GUID");
  const profileGuid = requiredEnv("DECISIONLOGIC_PROFILE_GUID");

  const dob = parseDob(input.dob);
  const hasMatchFields = Boolean(
    input.firstName &&
      input.lastName &&
      input.street &&
      input.city &&
      input.state &&
      input.zip &&
      input.phone &&
      input.ssn &&
      dob.day &&
      dob.month &&
      dob.year,
  );

  const matchType =
    input.preferMatch === false || !hasMatchFields
      ? Number(process.env.DECISIONLOGIC_DEFAULT_MATCH_TYPE ?? -1)
      : 4;

  const body: CreateAndVerifyRequestBody = {
    serviceKey,
    siteUserGuid,
    profileGuid,
    customerId: input.customerId || undefined,
    firstName: input.firstName,
    lastName: input.lastName,
    emailAddress: input.email,
    institutionId: 0,
    matchType,
  };

  if (matchType >= 4) {
    body.matchFirstName = input.firstName;
    body.matchLastName = input.lastName;
    body.matchAddressStreet = input.street;
    body.matchAddressCity = input.city;
    body.matchAddressState = input.state;
    body.matchAddressZip = input.zip;
    body.matchPhoneNumber = input.phone?.replace(/\D/g, "");
    body.matchSocialSecurityNumber = input.ssn?.replace(/\D/g, "");
    body.matchEmailAddress = input.email;
    body.matchDobDay = dob.day;
    body.matchDobMonth = dob.month;
    body.matchDobYear = dob.year;
  }

  const raw = await dlPost<string>("CreateAndVerifyRequest", body);
  const requestCode = typeof raw.data === "string" ? raw.data.trim() : "";
  if (!requestCode) {
    throw new Error("DecisionLogic CreateAndVerifyRequest returned an empty request code.");
  }

  return { requestCode, matchType, raw };
}

export async function getReportDetailsFromRequestCode(requestCode: string) {
  const serviceKey = requiredEnv("DECISIONLOGIC_SERVICE_KEY");
  return dlPost<unknown>("GetReportDetailsFromRequestCode", {
    serviceKey,
    requestCode,
  });
}

export async function instantRefresh(requestCode: string) {
  const serviceKey = requiredEnv("DECISIONLOGIC_SERVICE_KEY");
  const siteUserGuid = requiredEnv("DECISIONLOGIC_SITE_USER_GUID");
  return dlPost<unknown>("InstantRefresh", {
    serviceKey,
    siteUserGuid,
    requestCode,
  });
}

export function isDecisionLogicConfigured(): boolean {
  return Boolean(
    process.env.DECISIONLOGIC_SERVICE_KEY &&
      process.env.DECISIONLOGIC_SITE_USER_GUID &&
      process.env.DECISIONLOGIC_PROFILE_GUID,
  );
}
