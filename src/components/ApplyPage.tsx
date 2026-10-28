"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import {
  BANK_ACCOUNT_OPTIONS,
  CAPITAL_OPTIONS,
  INDUSTRY_OPTIONS,
  TIME_IN_BUSINESS_OPTIONS,
  type LeadData,
} from "@/lib/lead-options";
import { evaluateLeadEligibility } from "@/lib/eligibility";
import { readLead, saveLead } from "@/lib/lead-storage";
import { masks } from "@/lib/masks";

type Errors = Partial<Record<keyof LeadData, string>>;

const FEATURES = [
  {
    title: "Faster Than Banks",
    body: "Nationwide Advance offers solution that's faster, more efficient, and tailored to your needs.",
    icon: "/site/icon-faster.png",
  },
  {
    title: "Tailored Funds",
    body: "Crafting cash flow solutions unlocking your entrepreneurial potential with seamless funding.",
    icon: "/site/icon-tailored.png",
  },
  {
    title: "Loyalty Benefits",
    body: "Entrepreneurial potential with seamless funding, tailored solutions, and trusted expertise.",
    icon: "/site/icon-loyalty.png",
  },
] as const;

export default function ApplyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const reqParam = params.get("req") || "";

  const [form, setForm] = useState<LeadData>({
    capitalNeeded: reqParam,
    businessName: "",
    timeInBusiness: "",
    businessBankAccount: "",
    industry: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const saved = readLead();
    setForm((prev) => ({
      capitalNeeded: reqParam || saved?.capitalNeeded || prev.capitalNeeded,
      businessName: saved?.businessName || prev.businessName,
      timeInBusiness: saved?.timeInBusiness || prev.timeInBusiness,
      businessBankAccount: saved?.businessBankAccount || prev.businessBankAccount,
      industry: saved?.industry || prev.industry,
      phone: saved?.phone || prev.phone,
    }));
  }, [reqParam]);

  function setField<K extends keyof LeadData>(key: K, value: LeadData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (!form.capitalNeeded) next.capitalNeeded = "Required";
    if (!form.businessName.trim()) next.businessName = "Required";
    if (!form.timeInBusiness) next.timeInBusiness = "Required";
    if (!form.businessBankAccount) next.businessBankAccount = "Required";
    if (!form.industry) next.industry = "Required";
    const digits = form.phone.replace(/\D/g, "");
    if (digits.length !== 10) next.phone = "Enter a valid 10-digit phone number";
    return next;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;
    saveLead(form);

    // Same fork as live Unbounce: not qualified → thank-you-nq; qualified → full MCA form
    const result = evaluateLeadEligibility(form);
    if (!result.qualified) {
      const qs = new URLSearchParams({
        req: form.capitalNeeded,
        bn: form.businessName,
        tib: form.timeInBusiness,
        businessbankaccount: form.businessBankAccount,
        ind: form.industry,
        ph: form.phone,
        reasons: result.reasons.join(","),
      });
      router.push(`/thank-you-nq?${qs.toString()}`);
      return;
    }

    router.push("/application");
  }

  return (
    <div className="marketing apply-page">
      <SiteHeader tone="apply" />

      <section className="apply-hero">
        <div className="apply-hero-in">
          <div className="apply-hero-copy">
            <p className="home-kicker home-kicker--light">
              <span /> Nationwide Advance
            </p>
            <h1>Compare business loan options in minutes</h1>
            <p className="home-lede">
              Empower your business with flexible business funding options.
            </p>
            <div className="apply-hero-photo">
              <Image
                src="/site/office-team.jpg"
                alt="Business team reviewing funding options"
                width={701}
                height={466}
                priority
                unoptimized
              />
            </div>
            <div className="trust-badges">
              <Image src="/site/mcafee.png" alt="McAfee Secure" width={95} height={35} unoptimized />
              <Image src="/site/norton.png" alt="Norton Secured" width={95} height={51} unoptimized />
              <Image src="/site/bbb.png" alt="BBB Accredited Business A+" width={144} height={39} unoptimized />
            </div>
          </div>

          <form className="apply-form-card" onSubmit={onSubmit} noValidate>
            <div className="apply-form-top">
              <Image
                src="/site/start-here.png"
                alt="Start Here"
                width={216}
                height={61}
                className="start-here-img"
                unoptimized
              />
              <span className="step-pill">Step 1 of 2</span>
            </div>

            <label>
              How much capital does your business need?*
              <select
                value={form.capitalNeeded}
                onChange={(e) => setField("capitalNeeded", e.target.value)}
              >
                <option value="">Please Select</option>
                {CAPITAL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.capitalNeeded ? <em>{errors.capitalNeeded}</em> : null}
            </label>

            <label>
              What is the name of your business?*
              <input
                type="text"
                placeholder="Business Name"
                value={form.businessName}
                onChange={(e) => setField("businessName", e.target.value)}
              />
              {errors.businessName ? <em>{errors.businessName}</em> : null}
            </label>

            <label>
              How long have you been in business?*
              <select
                value={form.timeInBusiness}
                onChange={(e) => setField("timeInBusiness", e.target.value)}
              >
                <option value="">Please Select</option>
                {TIME_IN_BUSINESS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.timeInBusiness ? <em>{errors.timeInBusiness}</em> : null}
            </label>

            <label>
              Do you have a business bank account?*
              <select
                value={form.businessBankAccount}
                onChange={(e) => setField("businessBankAccount", e.target.value)}
              >
                <option value="">Please Select</option>
                {BANK_ACCOUNT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.businessBankAccount ? <em>{errors.businessBankAccount}</em> : null}
            </label>

            <label>
              Select your Industry*
              <select value={form.industry} onChange={(e) => setField("industry", e.target.value)}>
                <option value="">Please Select</option>
                {INDUSTRY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.industry ? <em>{errors.industry}</em> : null}
            </label>

            <label>
              What is the best number to reach you on?*
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Best Contact Number"
                value={form.phone}
                onChange={(e) => setField("phone", masks.phone(e.target.value))}
              />
              {errors.phone ? <em>{errors.phone}</em> : null}
            </label>

            <button type="submit" className="btn-maroon">
              Continue
            </button>
            <p className="secure-note">Privacy &amp; Security Protected</p>
          </form>
        </div>
      </section>

      <section className="feature-row">
        <div className="feature-row-in">
          {FEATURES.map((f) => (
            <article key={f.title} className="feature-card">
              <Image src={f.icon} alt="" width={65} height={65} unoptimized />
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
          <article className="feature-card feature-card--maroon">
            <h3>Transparent Pricing</h3>
            <p>Clarity in every transaction. Honest rates, no surprises. Join us for seamless funding.</p>
            <Link href="/application" className="btn-outline-light">
              Apply Today
            </Link>
          </article>
        </div>
      </section>

      <section className="split-section">
        <div className="split-section-in">
          <Image
            src="/site/home-side.jpg"
            alt="Entrepreneurs reviewing cash flow"
            width={784}
            height={534}
            unoptimized
          />
          <div>
            <h2>Aiding Entrepreneurs in Generating Cash Flow</h2>
            <p>
              We take pride in the professionalism, trust and amazing speed we offer in helping you
              develop/create your dream. As we know it is very hard nowadays to get funding in a
              timely matter from a bank. Therefore we give an alternative funding route to funding
              that is as seamless as it should be.
            </p>
            <p>
              Allow our funding representatives to provide you with the tools and funding needed. We
              look at you as a partner not just another customer.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
