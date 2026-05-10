// Show stock count, or a fallback string when there is none.
// `fallback` is optional - if you don't pass anything we still return
// "Many In Stock" so old callers and the existing tests keep working.
// The page passes an i18next string when it has one.
function product_stock(product, fallback) {
  if (product && product.stock) {
    return product.stock;
  }
  return fallback || "Many In Stock";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { product_stock };
}
