# DecisionLogic email package (Fwd: Call Follow Up)

**Source:** Gmail — tech@nationwideadvance.com  
**Original from:** Payton Pimentel `<payton.pimentel@decisionlogic.com>`  
**Forwarded by:** Zohar Avshalom (American Choice Capital) → Keith Matthews  
**Support:** integration@decisionlogic.com · Ph 858-586-0202

## Swagger / base URL

- Swagger UI: https://integration.decisionlogic.com/restful/swagger/index.html
- REST base: `https://integration.decisionlogic.com/restful/v1`
- Client portal: https://Portal.DecisionLogic.com/login.aspx
- Widget script: `https://assets.decisionlogic.com/cdn/widgetui/widgetUI.js`

## Primary APIs (from email)

| API | Purpose |
| --- | --- |
| **CreateAndVerifyRequest** | Creates Request Code; optional DL Match + Instant Bank Verification |
| **GetReportDetailsFromRequestCode** | Returns accounts + transaction history (XML/JSON report) for a Request Code |
| **InstantRefresh** | Forced refresh for a Request Code to pull updated transactions |

## Attachments saved here

1. `Precision-Engine-Client-Guide.pdf`
2. `DecisionLogic-Integration-Guide-Restful-APIs-V1.13.pdf`
3. `Testing-Credentials-flows.pdf`
4. `Integration-Status-Codes.pdf`
5. `2.7-Integration-Credentials.xlsx` (**secrets — do not commit**)

## Test bank login flows (sandbox UI)

From `Testing-Credentials-flows.pdf`:

1. **Always succeed:** routing `999999963`, FI WorldWide Savings, user `michael.draper`, password anything  
2. **Account error:** same FI/routing, user `A.persona`  
3. **MFA:** FI “WorldWide Savings (Security Question)”, user `charles.dickens`, answers Texas / w3schools  

## Status codes (request)

| Code | Meaning |
| --- | --- |
| -3 | Other error |
| -2 | Financial institution error |
| -1 | Account error |
| 0 | Not started |
| 1 | Started, not completed |
| 3 | Login verified (success) |
| 600 | Refresh successful |
| 601 | Refresh failed |

## Important go-live notes

- API calls must come from a **whitelisted static IP** (DecisionLogic support).
- Widget parent page URL must be **whitelisted on the Profile** (e.g. `https://nationwideadvance.vercel.app/*`).
- Keep `serviceKey`, GUIDs, and spreadsheet credentials **server-side only**.
