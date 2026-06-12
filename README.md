# DoomLedger

DoomLedger is a gamified personal finance ledger built with React and Vite.

The current app includes:

- Mission-style financial goal setup
- Shield progress, threat level, XP, and milestone previews
- Dashboard, squad, activity feed, and rankings screens
- Placeholder bank-link action for a future Plaid integration

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
PLAID_ENV=sandbox
PLAID_PRODUCTS=transactions
PLAID_COUNTRY_CODES=US
```

For Sandbox testing, use Plaid's Sandbox credentials in Link. For real personal bank data, switch `PLAID_ENV` and `PLAID_SECRET` to Production values after Plaid grants access.

Local Plaid state is stored in `.data/plaid-state.json`, which is ignored by Git.

### Frontend Flow

The `Link Bank Account` button in `src/App.jsx` now:

1. Requests a Link token from the local backend.
2. Opens Plaid Link.
3. Exchanges the returned public token for an access token on the backend.
4. Syncs transactions with `/transactions/sync`.
5. Maps Plaid transactions into DoomLedger's activity feed.
