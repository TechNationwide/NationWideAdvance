/** CreateAndVerifyRequest body — DecisionLogic Integration Guide V1.13 */
export type CreateAndVerifyRequestBody = {
  serviceKey: string;
  siteUserGuid: string;
  profileGuid: string;
  customerId?: string;
  firstName?: string;
  lastName?: string;
  accountNumber?: string;
  routingNumber?: string;
  institutionId?: number;
  emailAddress?: string;
  /** -1 = IAV only; 4 = DL Match; 5 = DL Match Plus */
  matchType: number;
  matchConsumerReferenceId?: string;
  matchFirstName?: string;
  matchMiddleName?: string;
  matchLastName?: string;
  matchSuffix?: string;
  matchAddressStreet?: string;
  matchAddressCity?: string;
  matchAddressState?: string;
  matchAddressZip?: string;
  matchPhoneNumber?: string;
  matchSocialSecurityNumber?: string;
  matchEmailAddress?: string;
  matchDobDay?: number;
  matchDobMonth?: number;
  matchDobYear?: number;
  matchDriversLicenseState?: string;
  matchDriversLicenseNumber?: string;
};

export type DecisionLogicEnvelope<T> = {
  trackingId?: string;
  isError?: boolean;
  errorMessage?: string;
  data?: T;
  httpStatusCode?: number;
};

export type StartVerificationInput = {
  customerId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  ssn?: string;
  dob?: string; // YYYY-MM-DD
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  /** Prefer DL Match (4) when identity fields are present; otherwise IAV (-1) */
  preferMatch?: boolean;
};

export const REQUEST_STATUS = {
  OTHER_ERROR: -3,
  FI_ERROR: -2,
  ACCOUNT_ERROR: -1,
  NOT_STARTED: 0,
  STARTED: 1,
  LOGIN_VERIFIED: 3,
  REFRESH_OK: 600,
  REFRESH_FAILED: 601,
} as const;
