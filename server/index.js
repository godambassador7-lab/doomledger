import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const dataDir = path.join(rootDir, '.data');
const statePath = path.join(dataDir, 'plaid-state.json');
const port = Number(process.env.PORT || 5174);

const app = express();
app.use(cors({ origin: [/^http:\/\/127\.0\.0\.1:\d+$/, /^http:\/\/localhost:\d+$/] }));
app.use(express.json());

const plaidEnv = process.env.PLAID_ENV || 'sandbox';
const products = (process.env.PLAID_PRODUCTS || 'transactions').split(',').map((p) => p.trim()).filter(Boolean);
const countryCodes = (process.env.PLAID_COUNTRY_CODES || 'US').split(',').map((c) => c.trim()).filter(Boolean);
const plaidConfigured = Boolean(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET);

const plaidClient = plaidConfigured
  ? new PlaidApi(new Configuration({
      basePath: PlaidEnvironments[plaidEnv],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
          'PLAID-SECRET': process.env.PLAID_SECRET,
        },
      },
    }))
  : null;

async function readState() {
  try {
    return JSON.parse(await fs.readFile(statePath, 'utf8'));
  } catch {
    return {};
  }
}

async function writeState(nextState) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(statePath, JSON.stringify(nextState, null, 2));
}

function requirePlaid(_req, res, next) {
  if (!plaidConfigured || !plaidClient) {
    return res.status(500).json({
      error: 'Plaid is not configured. Copy .env.example to .env and add PLAID_CLIENT_ID and PLAID_SECRET from the Plaid Dashboard.',
    });
  }
  return next();
}

function mapPlaidTransaction(tx) {
  const isOutflow = tx.amount > 0;
  const amount = isOutflow ? -tx.amount : Math.abs(tx.amount);
  const category = tx.personal_finance_category?.primary || tx.category?.[0] || 'OTHER';
  const isSavings = category.includes('TRANSFER') || /savings|deposit/i.test(tx.name || '');
  const type = isSavings || !isOutflow
    ? 'positive'
    : category.includes('FOOD_AND_DRINK') || category.includes('GENERAL_MERCHANDISE')
      ? 'negative'
      : 'neutral';

  return {
    id: tx.transaction_id,
    userId: 'u_001',
    merchant: tx.merchant_name || tx.name,
    category,
    amount,
    type,
    impact: type === 'positive' ? '+Shield' : type === 'negative' ? '-Shield' : 'Tracked',
    timestamp: new Date(tx.datetime || tx.date),
  };
}

app.get('/api/plaid/status', async (_req, res) => {
  const state = await readState();
  res.json({
    configured: plaidConfigured,
    connected: Boolean(state.accessToken),
    environment: plaidEnv,
    products,
  });
});

app.post('/api/create_link_token', requirePlaid, async (_req, res, next) => {
  try {
    const request = {
      user: { client_user_id: 'doomledger-personal-user' },
      client_name: 'DoomLedger',
      products,
      country_codes: countryCodes,
      language: 'en',
    };

    if (process.env.PLAID_REDIRECT_URI) {
      request.redirect_uri = process.env.PLAID_REDIRECT_URI;
    }

    const response = await plaidClient.linkTokenCreate(request);
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    next(error);
  }
});

app.post('/api/exchange_public_token', requirePlaid, async (req, res, next) => {
  try {
    const { public_token: publicToken } = req.body;
    if (!publicToken) {
      return res.status(400).json({ error: 'Missing public_token from Plaid Link.' });
    }

    const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
    const state = await readState();
    await writeState({
      ...state,
      accessToken: response.data.access_token,
      itemId: response.data.item_id,
      cursor: null,
      connectedAt: new Date().toISOString(),
    });

    return res.json({ ok: true, item_id: response.data.item_id });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/transactions', requirePlaid, async (_req, res, next) => {
  try {
    const state = await readState();
    if (!state.accessToken) {
      return res.status(409).json({ error: 'No Plaid account connected yet.' });
    }

    let cursor = state.cursor || null;
    let hasMore = true;
    const added = [];
    const modified = [];
    const removed = [];
    let nextCursor = cursor;

    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: state.accessToken,
        cursor,
        count: 100,
      });
      added.push(...response.data.added);
      modified.push(...response.data.modified);
      removed.push(...response.data.removed);
      hasMore = response.data.has_more;
      cursor = response.data.next_cursor;
      nextCursor = response.data.next_cursor;
    }

    await writeState({ ...state, cursor: nextCursor, lastSyncAt: new Date().toISOString() });

    return res.json({
      added: added.map(mapPlaidTransaction),
      modified: modified.map(mapPlaidTransaction),
      removed,
      cursor: nextCursor,
    });
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res) => {
  const plaidError = error.response?.data;
  console.error(plaidError || error);
  res.status(error.response?.status || 500).json({
    error: plaidError?.error_message || error.message || 'Unexpected server error.',
    plaid_error_code: plaidError?.error_code,
  });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`DoomLedger API listening on http://127.0.0.1:${port}`);
});
