"use client";

import Image from "next/image";
import {
  FormEvent,
  type HTMLAttributes,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import { DEMO_MODE, ENTITY_TYPES, STATES, STEP_LABELS } from "@/lib/constants";
import { maskEin, maskSsn, masks, type MaskKey } from "@/lib/masks";

type FormState = {
  legalName: string;
  dba: string;
  entityType: string;
  stateOfIncorporation: string;
  businessStartDate: string;
  ein: string;
  productsServices: string;
  bizStreet: string;
  bizCity: string;
  bizState: string;
  bizZip: string;
  ownerFirstName: string;
  ownerLastName: string;
  email: string;
  phone: string;
  dob: string;
  ssn: string;
  ownershipPct: string;
  sameAsBusiness: boolean;
  homeStreet: string;
  homeCity: string;
  homeState: string;
  homeZip: string;
  consent: boolean;
};

type FieldErrors = Partial<Record<keyof FormState | "bank" | "consent", string>>;

type BankState = {
  connected: boolean;
  requestCode: string | null;
  status: "idle" | "wait" | "ok" | "error";
  message: string;
};

const initialForm: FormState = {
  legalName: "",
  dba: "",
  entityType: "",
  stateOfIncorporation: "",
  businessStartDate: "",
  ein: "",
  productsServices: "",
  bizStreet: "",
  bizCity: "",
  bizState: "",
  bizZip: "",
  ownerFirstName: "",
  ownerLastName: "",
  email: "",
  phone: "",
  dob: "",
  ssn: "",
  ownershipPct: "",
  sameAsBusiness: false,
  homeStreet: "",
  homeCity: "",
  homeState: "",
  homeZip: "",
  consent: false,
};

function formatDateLabel(d: string) {
  if (!d) return "";
  return new Date(`${d}T00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAddress(street: string, city: string, state: string, zip: string) {
  return `${street}, ${city}, ${state} ${zip}`;
}

export default function ApplicationForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [bank, setBank] = useState<BankState>({
    connected: false,
    requestCode: null,
    status: "idle",
    message: "Not connected yet",
  });
  const [submitting, setSubmitting] = useState(false);
  const [doneRef, setDoneRef] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState("");

  const today = useMemo(() => new Date(), []);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "sameAsBusiness" && value === true) {
        next.homeStreet = prev.bizStreet;
        next.homeCity = prev.bizCity;
        next.homeState = prev.bizState;
        next.homeZip = prev.bizZip;
      }
      if (
        prev.sameAsBusiness &&
        (key === "bizStreet" || key === "bizCity" || key === "bizState" || key === "bizZip")
      ) {
        if (key === "bizStreet") next.homeStreet = value as string;
        if (key === "bizCity") next.homeCity = value as string;
        if (key === "bizState") next.homeState = value as string;
        if (key === "bizZip") next.homeZip = value as string;
      }
      return next;
    });
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function applyMask(key: keyof FormState, mask: MaskKey, raw: string) {
    setField(key, masks[mask](raw) as FormState[typeof key]);
  }

  function validateField(key: keyof FormState, value: string, disabled = false): string {
    const v = value.trim();
    if (disabled) return "";
    const requiredKeys: (keyof FormState)[] = [
      "legalName",
      "entityType",
      "stateOfIncorporation",
      "businessStartDate",
      "ein",
      "productsServices",
      "bizStreet",
      "bizCity",
      "bizState",
      "bizZip",
      "ownerFirstName",
      "ownerLastName",
      "email",
      "phone",
      "dob",
      "ssn",
      "ownershipPct",
      "homeStreet",
      "homeCity",
      "homeState",
      "homeZip",
    ];
    if (requiredKeys.includes(key) && !v) return "Required.";
    if (!v) return "";

    if (key === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) {
      return "Enter a valid email address.";
    }
    if (key === "ein" && v.replace(/\D/g, "").length !== 9) return "EIN must be 9 digits.";
    if (key === "ssn" && v.replace(/\D/g, "").length !== 9) return "SSN must be 9 digits.";
    if (key === "phone" && v.replace(/\D/g, "").length !== 10) {
      return "Enter a 10-digit phone number.";
    }
    if ((key === "bizZip" || key === "homeZip") && v.length !== 5) {
      return "ZIP must be 5 digits.";
    }
    if (key === "ownershipPct") {
      const n = Number(v);
      if (n < 1 || n > 100) return "Enter a percentage from 1 to 100.";
    }
    if (key === "businessStartDate" && new Date(v) > today) {
      return "Start date can't be in the future.";
    }
    if (key === "dob") {
      const age = (today.getTime() - new Date(v).getTime()) / 31557600000;
      if (age < 18) return "Owner must be at least 18.";
      if (age > 110) return "Check the date of birth.";
    }
    return "";
  }

  function validateStep(i: number): boolean {
    const nextErrors: FieldErrors = {};
    let firstInvalid: keyof FormState | null = null;

    const stepFields: (keyof FormState)[][] = [
      [
        "legalName",
        "entityType",
        "stateOfIncorporation",
        "businessStartDate",
        "ein",
        "productsServices",
        "bizStreet",
        "bizCity",
        "bizState",
        "bizZip",
      ],
      [
        "ownerFirstName",
        "ownerLastName",
        "email",
        "phone",
        "dob",
        "ssn",
        "ownershipPct",
        "homeStreet",
        "homeCity",
        "homeState",
        "homeZip",
      ],
      [],
      [],
    ];

    for (const key of stepFields[i]) {
      const disabled = form.sameAsBusiness && key.startsWith("home");
      const msg = validateField(key, String(form[key] ?? ""), disabled);
      if (msg) {
        nextErrors[key] = msg;
        if (!firstInvalid) firstInvalid = key;
      }
    }

    if (i === 2) {
      if (!bank.connected) nextErrors.bank = "Connect your bank account to continue.";
      else if (!form.consent) nextErrors.consent = "Please check the authorization box to continue.";
    }

    setErrors(nextErrors);
    if (firstInvalid) {
      const el = document.getElementById(firstInvalid);
      el?.focus();
    }
    return Object.keys(nextErrors).length === 0;
  }

  function buildPayload() {
    return {
      business: {
        legalName: form.legalName.trim(),
        dba: form.dba.trim(),
        entityType: form.entityType,
        stateOfIncorporation: form.stateOfIncorporation,
        businessStartDate: form.businessStartDate,
        ein: form.ein,
        productsServices: form.productsServices.trim(),
        address: {
          street: form.bizStreet.trim(),
          city: form.bizCity.trim(),
          state: form.bizState,
          zip: form.bizZip,
        },
      },
      owner: {
        firstName: form.ownerFirstName.trim(),
        lastName: form.ownerLastName.trim(),
        email: form.email.trim(),
        phone: form.phone,
        dob: form.dob,
        ssn: form.ssn,
        ownershipPct: Number(form.ownershipPct),
        homeAddress: {
          street: form.homeStreet.trim(),
          city: form.homeCity.trim(),
          state: form.homeState,
          zip: form.homeZip,
        },
      },
      decisionLogic: { requestCode: bank.requestCode },
      consent: {
        accepted: form.consent,
        timestamp: new Date().toISOString(),
      },
      source: "nwa-secondary-application",
    };
  }

  async function connectBank() {
    setBank((prev) => ({
      ...prev,
      status: "wait",
      message: "Waiting for bank connection…",
    }));
    try {
      if (DEMO_MODE) {
        await new Promise((r) => setTimeout(r, 1400));
        const requestCode = `DL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
        setBank({
          connected: true,
          requestCode,
          status: "ok",
          message: `Bank connected · Ref ${requestCode}`,
        });
        setErrors((prev) => {
          const next = { ...prev };
          delete next.bank;
          return next;
        });
        return;
      }

      const res = await fetch("/api/decisionlogic/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: form.ein,
          firstName: form.ownerFirstName,
          lastName: form.ownerLastName,
          email: form.email,
        }),
      });
      if (!res.ok) throw new Error("DecisionLogic start failed");
      const data = (await res.json()) as { requestCode: string; url: string };
      if (data.url) window.open(data.url, "_blank");
      setBank({
        connected: true,
        requestCode: data.requestCode,
        status: "ok",
        message: `Bank connected · Ref ${data.requestCode}`,
      });
      setErrors((prev) => {
        const next = { ...prev };
        delete next.bank;
        return next;
      });
    } catch {
      setBank({
        connected: false,
        requestCode: null,
        status: "error",
        message: "Couldn't start the bank connection. Try again.",
      });
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (step < 3) {
      if (validateStep(step)) setStep((s) => s + 1);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    const payload = buildPayload();
    try {
      let ref: string;
      if (DEMO_MODE) {
        await new Promise((r) => setTimeout(r, 900));
        ref = `NWA-${Date.now().toString().slice(-7)}`;
      } else {
        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("submit failed");
        const data = (await res.json()) as { applicationId: string };
        ref = data.applicationId;
      }
      setDoneRef(ref);
    } catch {
      setSubmitError("We couldn't submit your application. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const homeDisabled = form.sameAsBusiness;

  if (doneRef) {
    return (
      <div className="app-shell">
        <BrandHeader />
        <Hero />
        <main className="wrap gut">
          <div className="card">
            <div className="done-panel">
              <svg width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
                <circle cx="28" cy="28" r="26" fill="#F3EAEB" />
                <path
                  d="M17 29l7 7 15-16"
                  stroke="#76030E"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h2>Application received</h2>
              <p>
                Your application and bank verification were sent to the Nationwide Advance funding
                team. A representative will reach out shortly.
              </p>
              <div className="ref">Reference {doneRef}</div>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <BrandHeader />
      <Hero />
      <main className="wrap gut">
        <div className="card">
          <ol className="steps" aria-label="Application progress">
            {STEP_LABELS.map((label, i) => (
              <li key={label} className={i < step ? "done" : i === step ? "on" : ""}>
                <span>{i < step ? "✓" : i + 1}</span>
                <em>{label}</em>
              </li>
            ))}
          </ol>

          <form id="app" className="app-form" noValidate onSubmit={onSubmit}>
            {step === 0 && (
              <fieldset>
                <legend>Business information</legend>
                <p className="sub">Use the name exactly as it appears on your formation documents.</p>
                <div className="grid">
                  <Field
                    className="full"
                    id="legalName"
                    label="Legal / Corporate Name"
                    required
                    value={form.legalName}
                    error={errors.legalName}
                    onChange={(v) => setField("legalName", v)}
                    autoComplete="organization"
                  />
                  <div className="f full">
                    <label htmlFor="dba">DBA</label>
                    <input
                      id="dba"
                      name="dba"
                      value={form.dba}
                      onChange={(e) => setField("dba", e.target.value)}
                    />
                    <div className="hint">Leave blank if you operate under your legal name.</div>
                  </div>
                  <div className="f">
                    <label htmlFor="entityType">
                      Type of Entity <i>*</i>
                    </label>
                    <select
                      id="entityType"
                      name="entityType"
                      required
                      value={form.entityType}
                      aria-invalid={errors.entityType ? "true" : "false"}
                      onChange={(e) => setField("entityType", e.target.value)}
                    >
                      <option value="">Please select</option>
                      {ENTITY_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <div className="msg">{errors.entityType}</div>
                  </div>
                  <StateSelect
                    id="stateOfIncorporation"
                    label="State of Incorporation"
                    value={form.stateOfIncorporation}
                    error={errors.stateOfIncorporation}
                    onChange={(v) => setField("stateOfIncorporation", v)}
                  />
                  <Field
                    id="businessStartDate"
                    label="Business Start Date"
                    required
                    type="date"
                    value={form.businessStartDate}
                    error={errors.businessStartDate}
                    onChange={(v) => setField("businessStartDate", v)}
                  />
                  <Field
                    id="ein"
                    label="EIN"
                    required
                    value={form.ein}
                    error={errors.ein}
                    placeholder="12-3456789"
                    inputMode="numeric"
                    onChange={(v) => applyMask("ein", "ein", v)}
                  />
                  <Field
                    className="full"
                    id="productsServices"
                    label="Products or Services Sold"
                    required
                    value={form.productsServices}
                    error={errors.productsServices}
                    placeholder="e.g. Residential HVAC installation and repair"
                    onChange={(v) => setField("productsServices", v)}
                  />
                </div>
                <div className="group">Business address</div>
                <div className="addr">
                  <Field
                    className="full"
                    id="bizStreet"
                    label="Street"
                    required
                    value={form.bizStreet}
                    error={errors.bizStreet}
                    autoComplete="address-line1"
                    onChange={(v) => setField("bizStreet", v)}
                  />
                  <Field
                    className="city"
                    id="bizCity"
                    label="City"
                    required
                    value={form.bizCity}
                    error={errors.bizCity}
                    onChange={(v) => setField("bizCity", v)}
                  />
                  <StateSelect
                    id="bizState"
                    label="State"
                    value={form.bizState}
                    error={errors.bizState}
                    onChange={(v) => setField("bizState", v)}
                  />
                  <Field
                    id="bizZip"
                    label="ZIP"
                    required
                    value={form.bizZip}
                    error={errors.bizZip}
                    inputMode="numeric"
                    maxLength={5}
                    onChange={(v) => applyMask("bizZip", "zip", v)}
                  />
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset>
                <legend>Owner information</legend>
                <p className="sub">The majority owner signing for the business.</p>
                <div className="grid">
                  <Field
                    id="ownerFirstName"
                    label="First Name"
                    required
                    value={form.ownerFirstName}
                    error={errors.ownerFirstName}
                    autoComplete="given-name"
                    onChange={(v) => setField("ownerFirstName", v)}
                  />
                  <Field
                    id="ownerLastName"
                    label="Last Name"
                    required
                    value={form.ownerLastName}
                    error={errors.ownerLastName}
                    autoComplete="family-name"
                    onChange={(v) => setField("ownerLastName", v)}
                  />
                  <Field
                    id="email"
                    label="Email"
                    required
                    type="email"
                    value={form.email}
                    error={errors.email}
                    autoComplete="email"
                    onChange={(v) => setField("email", v)}
                  />
                  <Field
                    id="phone"
                    label="Phone"
                    required
                    type="tel"
                    value={form.phone}
                    error={errors.phone}
                    placeholder="(555) 555-5555"
                    inputMode="tel"
                    autoComplete="tel"
                    onChange={(v) => applyMask("phone", "phone", v)}
                  />
                  <Field
                    id="dob"
                    label="Date of Birth"
                    required
                    type="date"
                    value={form.dob}
                    error={errors.dob}
                    autoComplete="bday"
                    onChange={(v) => setField("dob", v)}
                  />
                  <Field
                    id="ssn"
                    label="SSN"
                    required
                    value={form.ssn}
                    error={errors.ssn}
                    placeholder="123-45-6789"
                    inputMode="numeric"
                    autoComplete="off"
                    onChange={(v) => applyMask("ssn", "ssn", v)}
                  />
                  <Field
                    id="ownershipPct"
                    label="Ownership Percentage"
                    required
                    type="number"
                    value={form.ownershipPct}
                    error={errors.ownershipPct}
                    placeholder="%"
                    min={1}
                    max={100}
                    step={1}
                    onChange={(v) => setField("ownershipPct", v)}
                  />
                </div>
                <div className="group">Home address</div>
                <label className="check">
                  <input
                    type="checkbox"
                    id="sameAsBusiness"
                    checked={form.sameAsBusiness}
                    onChange={(e) => setField("sameAsBusiness", e.target.checked)}
                  />
                  Same as business address
                </label>
                <div className="addr" id="homeAddr">
                  <Field
                    className="full"
                    id="homeStreet"
                    label="Street"
                    required
                    value={form.homeStreet}
                    error={errors.homeStreet}
                    disabled={homeDisabled}
                    autoComplete="address-line1"
                    onChange={(v) => setField("homeStreet", v)}
                  />
                  <Field
                    className="city"
                    id="homeCity"
                    label="City"
                    required
                    value={form.homeCity}
                    error={errors.homeCity}
                    disabled={homeDisabled}
                    onChange={(v) => setField("homeCity", v)}
                  />
                  <StateSelect
                    id="homeState"
                    label="State"
                    value={form.homeState}
                    error={errors.homeState}
                    disabled={homeDisabled}
                    onChange={(v) => setField("homeState", v)}
                  />
                  <Field
                    id="homeZip"
                    label="ZIP"
                    required
                    value={form.homeZip}
                    error={errors.homeZip}
                    disabled={homeDisabled}
                    inputMode="numeric"
                    maxLength={5}
                    onChange={(v) => applyMask("homeZip", "zip", v)}
                  />
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset>
                <legend>Verify your bank</legend>
                <p className="sub">
                  We use DecisionLogic to review recent business bank activity. No statements to
                  upload.
                </p>
                <div className="bank">
                  <h3>Connect your business bank account</h3>
                  <ul>
                    <li>Read-only access through DecisionLogic&apos;s secure portal</li>
                    <li>We never see or store your banking password</li>
                    <li>Takes about 2 minutes</li>
                  </ul>
                  <div
                    className={`status ${bank.status === "ok" ? "ok" : bank.status === "wait" ? "wait" : ""}`}
                  >
                    <span className="dot" />
                    <span>{bank.message}</span>
                  </div>
                  <div>
                    <button type="button" className="btn primary" onClick={connectBank}>
                      {bank.connected ? "Reconnect" : "Connect bank with DecisionLogic"}
                    </button>
                  </div>
                </div>
                <label className="check">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={form.consent}
                    onChange={(e) => {
                      setField("consent", e.target.checked);
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.consent;
                        return next;
                      });
                    }}
                  />
                  I certify the information provided is accurate and authorize Nationwide Advance and
                  their funding partners to obtain credit reports and verify bank, business and
                  personal information for this application.
                </label>
                <div className="msg">{errors.bank || errors.consent}</div>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset>
                <legend>Review &amp; submit</legend>
                <p className="sub">Check everything once more. Sensitive numbers are masked.</p>
                {submitError && <p className="msg">{submitError}</p>}
                <div className="review">
                  <ReviewSection title="Business" onEdit={() => setStep(0)}>
                    <Row label="Legal name" value={form.legalName} />
                    <Row label="DBA" value={form.dba || "—"} />
                    <Row label="Entity" value={form.entityType} />
                    <Row label="State of inc." value={form.stateOfIncorporation} />
                    <Row label="Start date" value={formatDateLabel(form.businessStartDate)} />
                    <Row label="EIN" value={maskEin(form.ein)} />
                    <Row label="Products / services" value={form.productsServices} />
                    <Row
                      label="Address"
                      value={formatAddress(
                        form.bizStreet,
                        form.bizCity,
                        form.bizState,
                        form.bizZip,
                      )}
                    />
                  </ReviewSection>
                  <ReviewSection title="Owner" onEdit={() => setStep(1)}>
                    <Row label="Name" value={`${form.ownerFirstName} ${form.ownerLastName}`} />
                    <Row label="Email" value={form.email} />
                    <Row label="Phone" value={form.phone} />
                    <Row label="Date of birth" value={formatDateLabel(form.dob)} />
                    <Row label="SSN" value={maskSsn(form.ssn)} />
                    <Row label="Ownership" value={`${form.ownershipPct}%`} />
                    <Row
                      label="Home address"
                      value={formatAddress(
                        form.homeStreet,
                        form.homeCity,
                        form.homeState,
                        form.homeZip,
                      )}
                    />
                  </ReviewSection>
                  <ReviewSection title="Bank" onEdit={() => setStep(2)}>
                    <Row
                      label="DecisionLogic"
                      value={
                        bank.connected
                          ? `Connected · ${bank.requestCode}`
                          : "Not connected"
                      }
                    />
                  </ReviewSection>
                </div>
              </fieldset>
            )}

            <div className="actions">
              <button
                type="button"
                className="btn ghost"
                hidden={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Back
              </button>
              <span className="secure">
                <svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true">
                  <rect x="1" y="7" width="12" height="8" rx="1.5" fill="currentColor" />
                  <path
                    d="M4 7V4.5a3 3 0 0 1 6 0V7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    fill="none"
                  />
                </svg>
                Encrypted &amp; secure
              </span>
              <button type="submit" className="btn primary" disabled={submitting}>
                {submitting
                  ? "Submitting…"
                  : step === 3
                    ? "Submit application →"
                    : "Continue →"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function BrandHeader() {
  return (
    <div className="brandbar gut">
      <div className="brandbar-in" aria-label="Nationwide Advance">
        {/* Same clear lockup used by SMS Agent / Submission Portal (chart + NATIONWIDE + ADVANCE) */}
        <Image
          src="/nationwide-logo-clear.png"
          alt="Nationwide Advance"
          width={308}
          height={192}
          priority
          unoptimized
          style={{ height: 72, width: "auto" }}
        />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <header className="band gut">
      <div className="band-in">
        <div className="eyebrow">Merchant cash advance application</div>
        <h1>Get the funding you need</h1>
        <p className="lede">
          A few details about your business and its owner, plus a secure bank connection. It takes
          about 5 minutes.
        </p>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer gut">
      <span>© 2026 Nationwide Advance. All Rights Reserved.</span>
      <span>Questions? 888-891-6772</span>
    </footer>
  );
}

function Field({
  id,
  label,
  required,
  value,
  error,
  onChange,
  className,
  type = "text",
  placeholder,
  inputMode,
  autoComplete,
  disabled,
  min,
  max,
  step,
  maxLength,
}: {
  id: string;
  label: string;
  required?: boolean;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  className?: string;
  type?: string;
  placeholder?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  maxLength?: number;
}) {
  return (
    <div className={`f ${className ?? ""}`}>
      <label htmlFor={id}>
        {label} {required ? <i>*</i> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        maxLength={maxLength}
        aria-invalid={error ? "true" : "false"}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="msg">{error}</div>
    </div>
  );
}

function StateSelect({
  id,
  label,
  value,
  error,
  onChange,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="f">
      <label htmlFor={id}>
        {label} <i>*</i>
      </label>
      <select
        id={id}
        name={id}
        required
        value={value}
        disabled={disabled}
        aria-invalid={error ? "true" : "false"}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select</option>
        {STATES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <div className="msg">{error}</div>
    </div>
  );
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: ReactNode;
}) {
  return (
    <section>
      <h4>
        {title}
        <button type="button" onClick={onEdit}>
          Edit
        </button>
      </h4>
      <dl>{children}</dl>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value || "—"}</dd>
    </>
  );
}
