# Nationwide Advance — Merchant Application

Local 4-step merchant cash advance application for Nationwide Advance.

**Structure & fields** match the client-approved Claude artifact (Business → Owner → Bank → Review).  
**Branding** uses Nationwide Advance logo, burgundy palette, and site fonts (not American Choice Capital).

## Stack

- Next.js 15 (App Router) + React + TypeScript
- Nationwide brand CSS
- Demo DecisionLogic + application submit APIs

## Run locally

```bash
cd nationwide-advance-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo mode

`DEMO_MODE=true` and `NEXT_PUBLIC_DEMO_MODE=true` (see `.env.example`):

- **Connect bank** simulates DecisionLogic and shows a `DL-XXXXXX` reference
- **Submit** accepts the JSON bundle locally and returns `NWA-XXXXXXX`

No real DecisionLogic or LoanPro calls are made in demo mode.

## API routes (ready for live wiring)

| Route | Purpose |
|-------|---------|
| `POST /api/decisionlogic/start` | Create DecisionLogic request / return bank URL |
| `POST /api/applications` | Bundle application + DL request code → LoanPro (LOS) |

## Next step

Wire live DecisionLogic (`CreateAndVerifyRequest`, etc.) using Call Follow Up credentials in env vars, then LoanPro sandbox when available.

## Notes

- SSN / EIN / DOB must not be logged in plaintext
- Host on HTTPS before collecting real applicant data
- Eligibility after the Unbounce lead form remains configurable for a later step
