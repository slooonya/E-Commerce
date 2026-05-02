// Fall back to 4 stars when a product is missing rating info.
function product_rate(product) {
  if (product && product.rating) {
    return product.rating;
  }
  return 4;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { product_rate };
}
