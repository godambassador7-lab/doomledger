# DoomLedger

DoomLedger is a gamified personal finance ledger built with React and Vite.

The current app includes:

- Mission-style financial goal setup
- Shield progress, threat level, XP, and milestone previews
- Dashboard, squad, activity feed, and rankings screens
- Plaid Link bank connection with transaction sync through a private backend

## Local Development

```bash
npm install
npm run dev
```

`npm run dev` starts both:

- Vite React app on `http://localhost:5173`
- Local Plaid API server on `http://127.0.0.1:5174`

Build and lint:

```bash
npm run build
npm run lint
```

## GitHub Pages Bank Linking

GitHub Pages can host the DoomLedger frontend, but Plaid still requires a private backend for `link_token` creation and token exchange. Deploy `server/index.js` to a Node host such as Render, Railway, Fly.io, or a VPS, then point the Pages build at that API.

Backend environment variables:

```env
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=development
PLAID_PRODUCTS=transactions
PLAID_COUNTRY_CODES=US
PORT=5174
HOST=0.0.0.0
CLIENT_ORIGINS=https://YOUR_GITHUB_USERNAME.github.io
```

If the Pages URL includes a custom domain, put that full origin in `CLIENT_ORIGINS` instead. Multiple origins can be comma-separated. The backend URL must be HTTPS for the GitHub Pages site to call it from the browser.

GitHub repository variable:

```env
VITE_API_BASE_URL=https://your-deployed-doomledger-api.example.com
```

Set this as a GitHub Actions repository variable named `VITE_API_BASE_URL`, then rerun the Pages workflow. Do not add Plaid secrets to GitHub Pages or any `VITE_` variable.

## Firebase Hosting + Functions

This repo is also configured for Firebase option 2:

- Firebase Hosting serves the Vite build from `dist`.
- `/api/**` rewrites to the `api` HTTPS Cloud Function.
- The Cloud Function reuses `server/index.js` for Plaid routes.
- Plaid token state is stored in Firestore when running on Firebase.

Firebase Functions with secrets require the Firebase project to be on the Blaze plan. After upgrading the `doom-ledger` project, set the Plaid secrets:

```bash
firebase functions:secrets:set PLAID_CLIENT_ID --project doom-ledger
firebase functions:secrets:set PLAID_SECRET --project doom-ledger
```

Use the Plaid Development secret for `PLAID_ENV=development`, or the Production secret for `PLAID_ENV=production`. Then deploy:

```bash
npm run deploy:firebase
```

The Firebase build uses `/` as the Vite base path so assets load correctly from `https://doom-ledger.web.app/`.

## Plaid Integration Plan

Do not put Plaid secrets in the React app. This repo includes a local Express backend for Plaid:

- `POST /api/create_link_token`
- `POST /api/exchange_public_token`
- `GET /api/transactions`
- `GET /api/plaid/status`

Suggested products:

- `transactions` first
- `balance` later if live balances matter

### Configure Plaid

Copy the example env file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then fill in values from the Plaid Dashboard:

```env
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=development
PLAID_PRODUCTS=transactions
PLAID_COUNTRY_CODES=US
```

For real personal bank data, use `PLAID_ENV=development` with your Development secret from the Plaid Dashboard. After Plaid grants Production access, switch `PLAID_ENV=production` and use your Production secret. Sandbox is only for fake test institutions and credentials.

If you previously linked sandbox accounts, restart the dev server after changing `PLAID_ENV`. Sandbox tokens cannot sync against Development or Production, so DoomLedger keeps local Plaid state separated by environment.

Local Plaid state is stored in `.data/plaid-state.json`, which is ignored by Git.

### Frontend Flow

The `Link Bank Account` button in `src/App.jsx` now:

1. Requests a Link token from the local backend.
2. Opens Plaid Link.
3. Exchanges the returned public token for an access token on the backend.
4. Syncs transactions with `/api/transactions`.
5. Maps Plaid transactions into DoomLedger's activity feed.
