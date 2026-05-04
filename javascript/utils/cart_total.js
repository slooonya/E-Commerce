// Sum cart line totals. Each item is { price, quantity }, both numeric-ish.
// Quantity defaults to 1 to match the markup in display_cart_preview.
function cart_total(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return 0;
  }

  let total = 0;
  for (let i = 0; i < items.length; i++) {
    let item = items[i] || {};
    let price = Number(item.price);
    let qty = item.quantity == null ? 1 : Number(item.quantity);

    if (Number.isNaN(price) || Number.isNaN(qty)) {
      continue;
    }
    total += price * qty;
  }

  return +total.toFixed(2);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { cart_total };
}
