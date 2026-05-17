const STORAGE_KEY = "cookie-consent";

const CONSENT_ACCEPTED = "accepted";
const CONSENT_REJECTED = "rejected";

function getCookieConsent() {
  return localStorage.getItem(STORAGE_KEY);
}

function setCookieConsent(value) {
  localStorage.setItem(STORAGE_KEY, value);
}

function hasCookieConsent() {
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
