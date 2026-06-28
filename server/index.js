import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { getApps, initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const runningInFirebase = Boolean(process.env.FUNCTION_TARGET || process.env.K_SERVICE || process.env.FIREBASE_CONFIG);
const runningServerless = Boolean(process.env.VERCEL || runningInFirebase);
const dataDir = runningServerless ? path.join('/tmp', 'doomledger') : path.join(rootDir, '.data');
const statePath = path.join(dataDir, 'plaid-state.json');
const port = Number(process.env.PORT || 5174);
const host = process.env.HOST || '127.0.0.1';
const allowedOrigins = (process.env.CLIENT_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();
app.use(cors({
  origin(origin, callback) {
    if (
      !origin
      || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
      || /^http:\/\/localhost:\d+$/.test(origin)
      || allowedOrigins.includes(origin)
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
}));
app.use(express.json());

const allowedPlaidEnvs = new Set(['sandbox', 'development', 'production']);
const plaidEnv = process.env.PLAID_ENV || 'development';
if (!allowedPlaidEnvs.has(plaidEnv)) {
  throw new Error(`Unsupported PLAID_ENV "${plaidEnv}". Use sandbox, development, or production.`);
}
const products = (process.env.PLAID_PRODUCTS || 'transactions').split(',').map((p) => p.trim()).filter(Boolean);
const countryCodes = (process.env.PLAID_COUNTRY_CODES || 'US').split(',').map((c) => c.trim()).filter(Boolean);
const plaidConfigured = Boolean(process.env.PLAID_CLIENT_ID && process.env.PLAID_SECRET);
const maxPlaidItems = 2;

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

const firestore = runningInFirebase
  ? getFirestore(getApps().length ? getApps()[0] : initializeAdminApp())
  : null;
const plaidStateRef = firestore?.collection('appState').doc('plaid');

async function readState() {
  if (plaidStateRef) {
    const snapshot = await plaidStateRef.get();
    return snapshot.exists ? snapshot.data() : {};
  }

  try {
    return JSON.parse(await fs.readFile(statePath, 'utf8'));
  } catch {
    return {};
  }
}

async function writeState(nextState) {
  if (plaidStateRef) {
    await plaidStateRef.set(nextState);
    return;
  }

  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(statePath, JSON.stringify(nextState, null, 2));
}

function getPlaidItems(state) {
  if (state.environment && state.environment !== plaidEnv) {
    return [];
  }

  if (!state.environment && plaidEnv !== 'sandbox') {
    return [];
  }

  if (Array.isArray(state.items)) {
    return state.items.slice(0, maxPlaidItems);
  }

  if (state.accessToken) {
    return [{
      accessToken: state.accessToken,
      itemId: state.itemId || 'legacy-item',
      cursor: state.cursor || null,
      connectedAt: state.connectedAt || null,
      label: 'Signal Array 1',
    }];
  }

  return [];
}

function requirePlaid(_req, res, next) {
  if (!plaidConfigured || !plaidClient) {
    return res.status(500).json({
      error: 'Plaid is not configured. Copy .env.example to .env and add PLAID_CLIENT_ID and PLAID_SECRET from the Plaid Dashboard.',
    });
  }
  return next();
}

function mapPlaidTransaction(tx, item) {
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
    id: `${item.itemId}:${tx.transaction_id}`,
    sourceItemId: item.itemId,
    sourceLabel: item.label,
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
  const items = getPlaidItems(state);
  res.json({
    configured: plaidConfigured,
    connected: items.length > 0,
    itemCount: items.length,
    maxItems: maxPlaidItems,
    canLinkMore: items.length < maxPlaidItems,
    items: items.map(({ itemId, connectedAt, label }) => ({ itemId, connectedAt, label })),
    environment: plaidEnv,
    hasStoredItemsForDifferentEnv: Boolean(state.environment && state.environment !== plaidEnv),
    products,
  });
});

app.post('/api/create_link_token', requirePlaid, async (_req, res, next) => {
  try {
    const state = await readState();
    if (getPlaidItems(state).length >= maxPlaidItems) {
      return res.status(409).json({ error: `DoomLedger supports up to ${maxPlaidItems} connected Signal Arrays.` });
    }

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

    const state = await readState();
    const items = getPlaidItems(state);
    if (items.length >= maxPlaidItems) {
      return res.status(409).json({ error: `DoomLedger supports up to ${maxPlaidItems} connected Signal Arrays.` });
    }

    const response = await plaidClient.itemPublicTokenExchange({ public_token: publicToken });
    const existingIndex = items.findIndex((item) => item.itemId === response.data.item_id);
    const nextItem = {
      accessToken: response.data.access_token,
      itemId: response.data.item_id,
      cursor: null,
      connectedAt: new Date().toISOString(),
      label: `Signal Array ${existingIndex >= 0 ? existingIndex + 1 : items.length + 1}`,
    };
    const nextItems = existingIndex >= 0
      ? items.map((item, index) => (index === existingIndex ? { ...item, ...nextItem } : item))
      : [...items, nextItem].slice(0, maxPlaidItems);

    await writeState({ environment: plaidEnv, items: nextItems });

    return res.json({ ok: true, item_id: response.data.item_id, item_count: nextItems.length, max_items: maxPlaidItems });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/transactions', requirePlaid, async (_req, res, next) => {
  try {
    const state = await readState();
    const items = getPlaidItems(state);
    if (!items.length) {
      return res.status(409).json({ error: 'No Plaid account connected yet.' });
    }

    const added = [];
    const modified = [];
    const removed = [];
    const nextItems = [];

    for (const item of items) {
      let cursor = item.cursor || null;
      let hasMore = true;
      let nextCursor = cursor;

      while (hasMore) {
        const response = await plaidClient.transactionsSync({
          access_token: item.accessToken,
          cursor,
          count: 100,
        });
        added.push(...response.data.added.map((tx) => mapPlaidTransaction(tx, item)));
        modified.push(...response.data.modified.map((tx) => mapPlaidTransaction(tx, item)));
        removed.push(...response.data.removed.map((tx) => ({ ...tx, sourceItemId: item.itemId, sourceLabel: item.label })));
        hasMore = response.data.has_more;
        cursor = response.data.next_cursor;
        nextCursor = response.data.next_cursor;
      }

      nextItems.push({ ...item, cursor: nextCursor, lastSyncAt: new Date().toISOString() });
    }

    await writeState({ environment: plaidEnv, items: nextItems, lastSyncAt: new Date().toISOString() });

    return res.json({
      added,
      modified,
      removed,
      itemCount: nextItems.length,
    });
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, next) => {
  void next;
  const plaidError = error.response?.data;
  const message = plaidError?.error_code === 'INVALID_API_KEYS'
    ? `Plaid rejected the ${plaidEnv} credentials. Use the ${plaidEnv} secret from the Plaid Dashboard, or set PLAID_ENV to match the secret you are using.`
    : plaidError?.error_message || error.message || 'Unexpected server error.';
  console.error(plaidError || error);
  res.status(error.response?.status || 500).json({
    error: message,
    plaid_error_code: plaidError?.error_code,
  });
});

const runningDirectly = process.argv[1] === fileURLToPath(import.meta.url);

if (!runningServerless && runningDirectly) {
  app.listen(port, host, () => {
    console.log(`DoomLedger API listening on http://${host}:${port}`);
  });
}

export default app;
