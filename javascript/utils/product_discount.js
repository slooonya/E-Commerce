// Render the small "X %" discount badge or empty when there is no discount.
function product_discount(product) {
  if (product && product.discountPercentage) {
    return product.discountPercentage + " %";
  }
  return "";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { product_discount };
}
