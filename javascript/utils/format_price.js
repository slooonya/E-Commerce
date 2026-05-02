// Convert a USD price into the active currency and tack the name on the end.
// Used in the product card and the cart preview - both were doing the same
// (price * rate).toFixed(2) + " " + name dance inline.
function format_price(price_usd, currency) {
  if (price_usd == null || !currency) {
    return "";
  }

  let price = Number(price_usd);
  let rate = Number(currency.rate);

  if (Number.isNaN(price) || Number.isNaN(rate)) {
    return "";
  }

  return (price * rate).toFixed(2) + " " + currency.name;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { format_price };
}
