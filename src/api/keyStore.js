// Keys live in sessionStorage — automatically cleared when the tab/browser closes.
// Falls back to .env values if no key has been entered via the UI.

const SK = { SL: 'hermes_sl_key', GHL: 'hermes_ghl_key' };

export function getSmartLeadKey() {
  return sessionStorage.getItem(SK.SL) || import.meta.env.VITE_SMARTLEAD_API_KEY || '';
}

export function setSmartLeadKey(key) {
  sessionStorage.setItem(SK.SL, key.trim());
}

export function getGHLKey() {
  return sessionStorage.getItem(SK.GHL) || import.meta.env.VITE_GHL_API_KEY || '';
}

export function setGHLKey(key) {
  sessionStorage.setItem(SK.GHL, key.trim());
}

export function isSmartLeadConnected() {
  return !!getSmartLeadKey();
}

export function isGHLConnected() {
  return !!getGHLKey();
}
