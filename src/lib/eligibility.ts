import type { LeadData } from "./lead-options";

/**
 * Screening rules mirrored from apply.nationwideadvance.com/thank-you-nq/
 * Keith can refine this config later without rewriting the apply flow.
 */
export const ELIGIBILITY = {
  /** Time-in-business answers that are under 12 months */
  underTwelveMonths: ["Less than 6 months", "6 - 12 months"] as const,
  requireBusinessBankAccount: true,
} as const;

export type EligibilityResult = {
  qualified: boolean;
  reasons: string[];
};

export function evaluateLeadEligibility(lead: LeadData): EligibilityResult {
  const reasons: string[] = [];

  if (ELIGIBILITY.requireBusinessBankAccount && lead.businessBankAccount !== "Yes") {
    reasons.push("business-bank-account");
  }

  if (
    (ELIGIBILITY.underTwelveMonths as readonly string[]).includes(lead.timeInBusiness)
  ) {
    reasons.push("time-in-business");
  }

  return {
    qualified: reasons.length === 0,
    reasons,
  };
}
