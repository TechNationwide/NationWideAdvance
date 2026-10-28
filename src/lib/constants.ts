export const STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL",
  "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME",
  "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH",
  "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
  "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
] as const;

export const ENTITY_TYPES = [
  "LLC",
  "S-Corporation",
  "C-Corporation",
  "Sole Proprietorship",
  "Partnership",
  "Non-Profit",
] as const;

export const STEP_LABELS = ["Business", "Owner", "Bank", "Review"] as const;

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
