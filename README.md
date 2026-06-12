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

Build and lint:

```bash
npm run build
npm run lint
```

## Plaid Integration Plan

Do not put Plaid secrets in the React app. Add a small backend later for Plaid:

- `POST /api/create_link_token`
- `POST /api/exchange_public_token`
- `GET /api/transactions`

Suggested products:

- `transactions` first
- `balance` later if live balances matter

Suggested environment variables for the backend:

```env
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox
```

Frontend wiring point:

- Replace the current `Link Bank Account` placeholder action in `src/App.jsx` with a Plaid Link launch flow.
- Map Plaid transactions into DoomLedger transaction objects before rendering the activity feed.
