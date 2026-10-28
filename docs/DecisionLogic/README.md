# DecisionLogic integration package

Email attachments + notes for Nationwide Advance Instant Account Verification (IAV).

## Files from DecisionLogic

| File | Purpose |
| --- | --- |
| `Precision-Engine-Client-Guide.pdf` | Product overview |
| `DecisionLogic-Integration-Guide-Restful-APIs-V1.13.pdf` | REST + widget integration |
| `Testing-Credentials-flows.pdf` | Sandbox bank logins |
| `Integration-Status-Codes.pdf` | Request status codes |
| `2.7-Integration-Credentials.xlsx` | **ACC test keys — kept only on local machine, not in git** |

See `EMAIL-NOTES.md` for the email summary and Swagger URL.

## App implementation

Wired in `nationwide-advance-app`:

| Piece | Location |
| --- | --- |
| REST client | `src/lib/decisionlogic/client.ts` |
| Start request | `POST /api/decisionlogic/start` |
| Pull report | `POST /api/decisionlogic/report` |
| Instant refresh | `POST /api/decisionlogic/refresh` |
| Bank widget UI | `src/components/DecisionLogicWidget.tsx` |
| Application Bank step | `src/components/ApplicationForm.tsx` |

## Go-live checklist (client / DecisionLogic)

1. Confirm Service Key, Site User GUID, Profile GUID (production or ACC test).
2. Ask DecisionLogic to **whitelist Vercel egress IP(s)** for API calls (or use a static-IP proxy).
3. Ask DecisionLogic to **whitelist parent page URLs** on the Profile, e.g.  
   `https://nationwideadvance.vercel.app/*` and any custom domain.
4. In Vercel project env:
   - `DEMO_MODE=false`
   - `NEXT_PUBLIC_DEMO_MODE=false`
   - `DECISIONLOGIC_SERVICE_KEY=…`
   - `DECISIONLOGIC_SITE_USER_GUID=…`
   - `DECISIONLOGIC_PROFILE_GUID=…`
   - `DECISIONLOGIC_BASE_URL=https://integration.decisionlogic.com/restful/v1`
5. Sandbox bank test (from Testing-Credentials-flows): routing `999999963`, FI WorldWide Savings, user `michael.draper`.
6. After widget success, app can call `GetReportDetailsFromRequestCode` via `/api/decisionlogic/report`.

Until steps 2–4 are done, leave `DEMO_MODE=true` so the form works without live DecisionLogic.
