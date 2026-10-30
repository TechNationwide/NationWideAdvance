/**
 * One-off live DecisionLogic CreateAndVerifyRequest test.
 * Loads .env.local — prints status only (no secrets / no request body dump).
 * Usage: node scripts/test-decisionlogic.mjs
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env.local");

function loadEnv(file) {
  const out = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
  return out;
}

const env = loadEnv(envPath);
const base = (env.DECISIONLOGIC_BASE_URL || "https://integration.decisionlogic.com/restful/v1").replace(
  /\/$/,
  "",
);
const serviceKey = env.DECISIONLOGIC_SERVICE_KEY;
const siteUserGuid = env.DECISIONLOGIC_SITE_USER_GUID;
const profileGuid = env.DECISIONLOGIC_PROFILE_GUID;

console.log("DecisionLogic live API test");
console.log("base:", base);
console.log(
  "creds:",
  serviceKey && siteUserGuid && profileGuid
    ? `present (keyLen=${serviceKey.length}, site=${siteUserGuid.length}, profile=${profileGuid.length})`
    : "MISSING",
);

if (!serviceKey || !siteUserGuid || !profileGuid) {
  process.exitCode = 1;
  console.error("FAIL: missing DECISIONLOGIC_* in .env.local");
  process.exit(1);
}

const body = {
  serviceKey,
  siteUserGuid,
  profileGuid,
  customerId: "NWA-TEST-" + Date.now().toString().slice(-6),
  firstName: "Michael",
  lastName: "Draper",
  emailAddress: "dl.test@nationwideadvance.com",
  institutionId: 0,
  matchType: -1,
};

const url = `${base}/CreateAndVerifyRequest`;
const started = Date.now();
let res;
try {
  res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
} catch (err) {
  console.error("FAIL: network error calling DecisionLogic");
  console.error(String(err?.message || err));
  process.exit(1);
}

const text = await res.text();
let json = null;
try {
  json = text ? JSON.parse(text) : null;
} catch {
  console.error("FAIL: non-JSON response", res.status, text.slice(0, 300));
  process.exit(1);
}

function extractRequestCode(data) {
  if (typeof data === "string") return data.trim();
  if (data && typeof data === "object") {
    const code = data.requestCode ?? data.RequestCode;
    if (typeof code === "string") return code.trim();
  }
  return "";
}

const ms = Date.now() - started;
const nestedErr = Boolean(json?.data && typeof json.data === "object" && json.data.isError);
const requestCode = extractRequestCode(json?.data);
const ok = res.ok && !json?.isError && !nestedErr && Boolean(requestCode);

console.log("http:", res.status);
console.log("ms:", ms);
console.log("isError:", Boolean(json?.isError), "nestedIsError:", nestedErr);
console.log("errorMessage:", json?.errorMessage || json?.data?.errorMessage || "(none)");
console.log(
  "requestCode:",
  requestCode ? `${requestCode.slice(0, 2)}…(${requestCode.length} chars)` : "(empty)",
);
console.log(
  ok
    ? "RESULT: PASS — live CreateAndVerifyRequest works from this machine"
    : "RESULT: FAIL",
);

if (!ok) process.exit(1);
