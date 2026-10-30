# Nationwide Advance — Merchant Application

Next.js 15 app for the Nationwide Advance merchant cash advance application  
(Business → Owner → Bank → Review) with DecisionLogic IAV and LoanPro submit stub.

**Workspace docs:** see [`../PROJECT.md`](../PROJECT.md) and [`../docs/`](../docs/).

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Nationwide brand CSS
- DecisionLogic REST client + widget (demo or live)
- Application submit API (demo accept / LoanPro stub)

## Folder layout (this app)

```
nationwide-advance-app/
├── src/
│   ├── app/                 # Pages + API routes
│   │   ├── apply/           # Lead screening
│   │   ├── thank-you-nq/    # Thank-you + embedded MCA form
│   │   ├── application/     # Standalone 4-step form
│   │   └── api/
│   │       ├── decisionlogic/  # start | report | refresh
│   │       └── applications/   # submit → LoanPro (stub)
│   ├── components/          # UI (ApplicationForm, DecisionLogicWidget, …)
│   └── lib/                 # eligibility, decisionlogic client, masks
├── public/                  # Logos & site images
├── scripts/                 # Local DecisionLogic API smoke test
├── docs/                    # Pointers to ../../docs
├── .env.example
└── .env.local               # secrets — do not commit
```

## Run locally

```bash
cd nationwide-advance-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo mode

`DEMO_MODE=true` and `NEXT_PUBLIC_DEMO_MODE=true` (see `.env.example`):

- **Connect bank** simulates DecisionLogic and shows a reference code
- **Submit** accepts the JSON bundle locally and returns `NWA-XXXXXXX`

No real DecisionLogic or LoanPro calls are made in demo mode.

## Live DecisionLogic smoke test

Credentials: `../docs/integrations/decisionlogic/2.7-Integration-Credentials.xlsx` → `.env.local`

```bash
node scripts/test-decisionlogic.mjs
# optional: DEMO_MODE=false NEXT_PUBLIC_DEMO_MODE=false npm run dev
# then POST http://localhost:3000/api/decisionlogic/start
```

## Notes

- SSN / EIN / DOB must not be logged in plaintext
- Host on HTTPS before collecting real applicant data
- Production: https://nationwideadvance.vercel.app
