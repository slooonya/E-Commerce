function product_stock(product) {
  if (product && product.stock) {
    return product.stock;
  }
  return "Many In Stock";
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { product_stock };
}
