const {
  CONSENT_ACCEPTED,
  CONSENT_REJECTED,
  getCookieConsent,
  setCookieConsent,
  hasCookieConsent,
} = require("../javascript/utils/cookie_consent.js");

describe("cookie_consent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("returns null when no consent is stored", () => {
    expect(getCookieConsent()).toBeNull();
    expect(hasCookieConsent()).toBe(false);
  });

  test("stores and reads accepted consent", () => {
    setCookieConsent(CONSENT_ACCEPTED);
    expect(getCookieConsent()).toBe(CONSENT_ACCEPTED);
    expect(hasCookieConsent()).toBe(true);
  });

  test("stores and reads rejected consent", () => {
    setCookieConsent(CONSENT_REJECTED);
    expect(getCookieConsent()).toBe(CONSENT_REJECTED);
    expect(hasCookieConsent()).toBe(true);
  });
});
