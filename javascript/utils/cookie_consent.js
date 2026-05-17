const STORAGE_KEY = "cookie-consent";

export const CONSENT_ACCEPTED = "accepted";
export const CONSENT_REJECTED = "rejected";

export function getCookieConsent() {
  return localStorage.getItem(STORAGE_KEY);
}

export function setCookieConsent(value) {
  localStorage.setItem(STORAGE_KEY, value);
}

export function hasCookieConsent() {
  return getCookieConsent() !== null;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CONSENT_ACCEPTED,
    CONSENT_REJECTED,
    getCookieConsent,
    setCookieConsent,
    hasCookieConsent,
  };
}
