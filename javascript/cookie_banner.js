import {
  CONSENT_ACCEPTED,
  CONSENT_REJECTED,
  hasCookieConsent,
  setCookieConsent,
} from "./utils/cookie_consent.js";

export function initCookieBanner() {
  const banner = document.getElementById("cookie-banner");

  if (!banner || hasCookieConsent()) {
    return;
  }

  const acceptBtn = banner.querySelector(".cookie-banner__accept");
  const rejectBtn = banner.querySelector(".cookie-banner__reject");

  showBanner(banner);

  acceptBtn?.addEventListener("click", () => {
    setCookieConsent(CONSENT_ACCEPTED);
    hideBanner(banner);
  });

  rejectBtn?.addEventListener("click", () => {
    setCookieConsent(CONSENT_REJECTED);
    hideBanner(banner);
  });
}

function showBanner(banner) {
  banner.removeAttribute("hidden");
  banner.setAttribute("aria-hidden", "false");
  banner.classList.add("cookie-banner--visible");

  const focusTarget =
    banner.querySelector(".cookie-banner__accept") ||
    banner.querySelector("button");

  focusTarget?.focus();
}

function hideBanner(banner) {
  banner.classList.remove("cookie-banner--visible");
  banner.setAttribute("aria-hidden", "true");
  banner.setAttribute("hidden", "");
}
