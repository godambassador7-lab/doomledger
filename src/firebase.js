import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: 'AIzaSyA1YkQWiSF6r4cHeG-ssdkJROOJmdPx7Ws',
  authDomain: 'doom-ledger.firebaseapp.com',
  projectId: 'doom-ledger',
  storageBucket: 'doom-ledger.firebasestorage.app',
  messagingSenderId: '536159293338',
  appId: '1:536159293338:web:fd27258b994fe185eef423',
  measurementId: 'G-C53G855RRM',
};

export const firebaseApp = initializeApp(firebaseConfig);

export const analyticsPromise = isSupported()
  .then((supported) => (supported ? getAnalytics(firebaseApp) : null))
  .catch(() => null);
