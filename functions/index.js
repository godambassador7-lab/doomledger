import { onRequest } from 'firebase-functions/v2/https';
import app from '../server/index.js';

export const api = onRequest({
  region: 'us-central1',
  secrets: ['PLAID_CLIENT_ID', 'PLAID_SECRET'],
}, app);
