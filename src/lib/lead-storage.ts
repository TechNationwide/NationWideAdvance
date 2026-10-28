import type { LeadData } from "./lead-options";

export const LEAD_STORAGE_KEY = "nationwide-advance-lead";

export function saveLead(data: LeadData) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(data));
}

export function readLead(): LeadData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(LEAD_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as LeadData;
  } catch {
    return null;
  }
}
