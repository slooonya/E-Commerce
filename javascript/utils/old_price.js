// Work out what the price *was* before a discount, so we can show it crossed
// out next to the current price. Three cases:
//   1. discountPercentage given -> back-calculate from current price
//   2. old_price already on the product -> just use it
//   3. nothing -> empty string
function old_price(product, current_price) {
  if (!product) {
    return "";
  }

  if (product.discountPercentage) {
    let percent = Number(product.discountPercentage);
    let now = Number(current_price);

    if (Number.isNaN(percent) || Number.isNaN(now) || percent >= 100) {
      return "";
    }

    return ((now / (100 - percent)) * 100).toFixed(2);
  }

  if (product.old_price) {
    return product.old_price;
  }

  return "";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { old_price };
}
